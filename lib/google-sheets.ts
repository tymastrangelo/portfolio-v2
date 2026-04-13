/**
 * Google Sheets API wrapper for SGA Forms
 * Stores form definitions and responses in a Google Sheet
 */

import { createSign } from 'crypto'
import type { Idea, TeamMember, Task } from '@/app/sga/types'

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'
const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token'

interface SheetConfig {
  spreadsheetId: string
  apiKey: string
}

interface ServiceAccountConfig {
  clientEmail: string
  privateKey: string
}

interface AccessTokenCache {
  token: string
  expiresAt: number
}

let sheetConfig: SheetConfig | null = null
let serviceAccountConfig: ServiceAccountConfig | null = null
let accessTokenCache: AccessTokenCache | null = null

function getConfig(): SheetConfig {
  if (sheetConfig) return sheetConfig

  const spreadsheetId = process.env.GOOGLE_SHEETS_ID
  const apiKey = process.env.GOOGLE_API_KEY

  if (!spreadsheetId || !apiKey) {
    throw new Error('Missing GOOGLE_SHEETS_ID or GOOGLE_API_KEY environment variables')
  }

  sheetConfig = { spreadsheetId, apiKey }
  return sheetConfig
}

function getServiceAccountConfig(): ServiceAccountConfig {
  if (serviceAccountConfig) return serviceAccountConfig

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

  if (!clientEmail || !privateKeyRaw) {
    throw new Error(
      'Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY. Google Sheets writes require service account auth.'
    )
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, '\n')
  serviceAccountConfig = { clientEmail, privateKey }
  return serviceAccountConfig
}

function createSignedJwt(clientEmail: string, privateKey: string): string {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: OAUTH_TOKEN_URL,
    exp: now + 3600,
    iat: now,
  }

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const unsignedToken = `${encodedHeader}.${encodedPayload}`

  const signer = createSign('RSA-SHA256')
  signer.update(unsignedToken)
  signer.end()
  const signature = signer.sign(privateKey, 'base64url')

  return `${unsignedToken}.${signature}`
}

async function getAccessToken(): Promise<string> {
  const now = Date.now()
  if (accessTokenCache && accessTokenCache.expiresAt - 60_000 > now) {
    return accessTokenCache.token
  }

  const { clientEmail, privateKey } = getServiceAccountConfig()
  const assertion = createSignedJwt(clientEmail, privateKey)

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  })

  const response = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Failed to get Google access token: ${response.status} ${err}`)
  }

  const data = (await response.json()) as { access_token: string; expires_in: number }
  accessTokenCache = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  }

  return data.access_token
}

interface GetValuesResponse {
  values?: string[][]
}

function parseSheetBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return false
  const normalized = value.trim().toLowerCase()
  return normalized === 'true' || normalized === '1' || normalized === 'yes'
}

function normalizeSlug(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().toLowerCase()
}

/**
 * Read values from a sheet range
 */
async function readSheetValues(sheetName: string, range: string): Promise<string[][]> {
  try {
    const { spreadsheetId } = getConfig()
    const url = `${SHEETS_API}/${spreadsheetId}/values/${sheetName}!${range}`
    let response = await fetch(`${url}?key=${getConfig().apiKey}`)

    // If the sheet is not public, fall back to service-account auth.
    if (response.status === 401 || response.status === 403) {
      const token = await getAccessToken()
      response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    if (!response.ok) {
      throw new Error(`Failed to read sheet: ${response.statusText}`)
    }

    const data: GetValuesResponse = await response.json()
    return data.values || []
  } catch (error) {
    console.error('Error reading sheet:', error)
    throw error
  }
}

/**
 * Append values to a sheet
 */
async function appendSheetValues(
  sheetName: string,
  values: (string | number | boolean)[][]
): Promise<void> {
  try {
    const { spreadsheetId } = getConfig()
    const token = await getAccessToken()

    // Build the request body
    const body = {
      values: values,
    }

    const url = `${SHEETS_API}/${spreadsheetId}/values/${sheetName}!A:Z:append?valueInputOption=RAW`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Failed to append to sheet: ${response.status} ${err}`)
    }
  } catch (error) {
    console.error('Error appending to sheet:', error)
    throw error
  }
}

/**
 * Update a specific cell or range
 */
async function updateSheetValues(
  sheetName: string,
  range: string,
  values: (string | number | boolean)[][]
): Promise<void> {
  try {
    const { spreadsheetId } = getConfig()
    const token = await getAccessToken()

    const body = {
      values: values,
    }

    const url = `${SHEETS_API}/${spreadsheetId}/values/${sheetName}!${range}?valueInputOption=RAW`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Failed to update sheet: ${response.status} ${err}`)
    }
  } catch (error) {
    console.error('Error updating sheet:', error)
    throw error
  }
}

/**
 * Parse form from row format
 */
function parseFormRow(row: string[]): any {
  if (!row || row.length < 8) return null

  return {
    id: row[0],
    name: row[1],
    description: row[2],
    slug: normalizeSlug(row[3]),
    fields_json: row[4],
    created_by: row[5],
    created_at: row[6],
    updated_at: row[7],
    is_active: parseSheetBoolean(row[8]),
  }
}

/**
 * Get all forms
 */
export async function getForms(): Promise<any[]> {
  try {
    const rows = await readSheetValues('Forms', 'A2:I1000')
    return rows.filter((row) => row[0]).map(parseFormRow).filter(Boolean)
  } catch (error) {
    console.error('Error fetching forms:', error)
    throw error
  }
}

/**
 * Get form by ID
 */
export async function getFormById(formId: string): Promise<any> {
  try {
    const forms = await getForms()
    return forms.find((f) => f.id === formId) || null
  } catch (error) {
    console.error('Error fetching form:', error)
    throw error
  }
}

/**
 * Get form by slug
 */
export async function getFormBySlug(slug: string): Promise<any> {
  try {
    const targetSlug = normalizeSlug(slug)
    const forms = await getForms()
    const matches = forms.filter((f) => normalizeSlug(f.slug) === targetSlug)

    if (matches.length === 0) return null

    // Prefer active versions first, then newest by updated_at/created_at.
    const sorted = [...matches].sort((a, b) => {
      const activeDelta = Number(Boolean(b.is_active)) - Number(Boolean(a.is_active))
      if (activeDelta !== 0) return activeDelta

      const aTime = Date.parse(a.updated_at || a.created_at || '') || 0
      const bTime = Date.parse(b.updated_at || b.created_at || '') || 0
      return bTime - aTime
    })

    return sorted[0]
  } catch (error) {
    console.error('Error fetching form by slug:', error)
    throw error
  }
}

/**
 * Create new form
 */
export async function createForm(data: {
  name: string
  description: string
  slug: string
  fields_json: string
  created_by: string
  is_active?: boolean
}): Promise<any> {
  try {
    const formId = `form_${Date.now()}`
    const now = new Date().toISOString()

    const row = [
      [
        formId,
        data.name,
        data.description,
        data.slug,
        data.fields_json,
        data.created_by,
        now,
        now,
        data.is_active ? 'TRUE' : 'FALSE',
      ],
    ]

    await appendSheetValues('Forms', row)

    return {
      id: formId,
      ...data,
      created_at: now,
      updated_at: now,
      is_active: data.is_active ?? true,
    }
  } catch (error) {
    console.error('Error creating form:', error)
    throw error
  }
}

/**
 * Update form
 */
export async function updateForm(formId: string, data: Record<string, any>): Promise<any> {
  try {
    const rows = await readSheetValues('Forms', 'A2:I1000')
    const rowIndex = rows.findIndex((row) => row[0] === formId)

    if (rowIndex === -1) {
      throw new Error('Form not found')
    }

    const form = parseFormRow(rows[rowIndex])
    const updated = {
      ...form,
      ...data,
      slug: data.slug ? normalizeSlug(data.slug) : form.slug,
      updated_at: new Date().toISOString(),
    }

    const row = [
      [
        updated.id,
        updated.name,
        updated.description,
        updated.slug,
        updated.fields_json,
        updated.created_by,
        updated.created_at,
        updated.updated_at,
        updated.is_active ? 'TRUE' : 'FALSE',
      ],
    ]

    // Update row (rowIndex + 2 because of header and 1-indexing)
    const rowNumber = rowIndex + 2
    await updateSheetValues('Forms', `A${rowNumber}:I${rowNumber}`, row)

    return updated
  } catch (error) {
    console.error('Error updating form:', error)
    throw error
  }
}

/**
 * Delete form (mark as inactive and remove)
 */
export async function deleteForm(formId: string): Promise<boolean> {
  try {
    const forms = await getForms()
    const formIndex = forms.findIndex((f) => f.id === formId)

    if (formIndex === -1) {
      throw new Error('Form not found')
    }

    // For simplicity, we'll just mark as inactive or could delete the row
    // For now, let's just update to inactive
    const form = forms[formIndex]
    await updateForm(formId, { is_active: false })

    return true
  } catch (error) {
    console.error('Error deleting form:', error)
    throw error
  }
}

/**
 * Parse response from row format
 */
function parseResponseRow(row: string[]): any {
  if (!row || row.length < 4) return null

  return {
    id: row[0],
    form_id: row[1],
    response_data: row[2],
    submitted_at: row[3],
    submitter_name: row[4] || '',
    submitter_email: row[5] || '',
    ip_address: row[6] || '',
    user_agent: row[7] || '',
  }
}

/**
 * Submit form response
 */
export async function submitFormResponse(data: {
  form_id: string
  response_data: string
  submitter_name?: string
  submitter_email?: string
  ip_address?: string
  user_agent?: string
}): Promise<any> {
  try {
    const responseId = `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    const row = [
      [
        responseId,
        data.form_id,
        data.response_data,
        now,
        data.submitter_name || '',
        data.submitter_email || '',
        data.ip_address || '',
        data.user_agent || '',
        'submitted',
        'normal',
        '',
        'pending',
        'FALSE',
        '',
        '',
        '',
        '',
        '',
      ],
    ]

    await appendSheetValues('Responses', row)

    return {
      id: responseId,
      ...data,
      submitted_at: now,
    }
  } catch (error) {
    console.error('Error submitting form response:', error)
    throw error
  }
}

/**
 * Get all responses for a form
 */
export async function getFormResponses(formId: string): Promise<any[]> {
  try {
    const rows = await readSheetValues('Responses', 'A2:R1000')
    return rows
      .filter((row) => row[0] && row[1] === formId)
      .map(parseResponseRow)
      .filter(Boolean)
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
  } catch (error) {
    console.error('Error fetching form responses:', error)
    throw error
  }
}

/**
 * Delete form response
 */
export async function deleteFormResponse(responseId: string): Promise<boolean> {
  try {
    const rows = await readSheetValues('Responses', 'A:R')
    const responseIndex = rows.findIndex((row) => row[0] === responseId)

    if (responseIndex === -1) {
      throw new Error('Response not found')
    }

    // Mark for deletion by clearing the row (or we could filter it out)
    const emptyRow = [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']]
    const rowNumber = responseIndex + 1
    await updateSheetValues('Responses', `A${rowNumber}:R${rowNumber}`, emptyRow)

    return true
  } catch (error) {
    console.error('Error deleting form response:', error)
    throw error
  }
}

/**
 * Get response count for a form
 */
export async function getResponseCount(formId: string): Promise<number> {
  try {
    const responses = await getFormResponses(formId)
    return responses.length
  } catch (error) {
    console.error('Error getting response count:', error)
    return 0
  }
}

function parseTeamMemberRow(row: string[]): TeamMember | null {
  if (!row || row.length < 10 || !row[0]) return null

  let roles: TeamMember['roles'] = []
  try {
    const parsed = row[4] ? JSON.parse(row[4]) : []
    if (Array.isArray(parsed)) {
      roles = parsed as TeamMember['roles']
    }
  } catch {
    roles = []
  }

  let portfolioFiles: string[] = []
  try {
    const parsed = row[10] ? JSON.parse(row[10]) : []
    if (Array.isArray(parsed)) {
      portfolioFiles = parsed.map(String)
    }
  } catch {
    portfolioFiles = []
  }

  return {
    id: row[0],
    name: row[1] || '',
    email: row[2] || '',
    phone: row[3] || '',
    roles,
    active: parseSheetBoolean(row[5]),
    join_date: row[6] || new Date().toISOString(),
    username: row[7] || '',
    password: row[8] || '',
    userRole: row[9] === 'admin' ? 'admin' : 'team',
    portfolio_files: portfolioFiles,
  }
}

export async function getTeamMembers(includeInactive = false): Promise<TeamMember[]> {
  const rows = await readSheetValues('TeamMembers', 'A2:K1000')
  const members = rows.map(parseTeamMemberRow).filter(Boolean) as TeamMember[]
  return includeInactive ? members : members.filter((m) => m.active)
}

export async function getTeamMemberByUsername(username: string): Promise<TeamMember | null> {
  const members = await getTeamMembers(true)
  return members.find((m) => m.username === username) || null
}

export async function createTeamMember(member: {
  name: string
  email: string
  phone?: string
  roles: TeamMember['roles']
  username: string
  password: string
  userRole?: 'admin' | 'team'
}): Promise<TeamMember> {
  const existing = await getTeamMemberByUsername(member.username)
  if (existing) {
    throw new Error('A team member with that username already exists')
  }

  const now = new Date().toISOString()
  const created: TeamMember = {
    id: `tm-${Date.now()}`,
    name: member.name,
    email: member.email,
    phone: member.phone || '',
    roles: member.roles,
    active: true,
    join_date: now,
    username: member.username,
    password: member.password,
    userRole: member.userRole || 'team',
    portfolio_files: [],
  }

  await appendSheetValues('TeamMembers', [
    [
      created.id,
      created.name,
      created.email,
      created.phone,
      JSON.stringify(created.roles),
      'TRUE',
      created.join_date,
      created.username,
      created.password,
      created.userRole,
      JSON.stringify(created.portfolio_files),
    ],
  ])

  return created
}

export async function updateTeamMemberByUsername(
  username: string,
  updates: Partial<{
    name: string
    email: string
    phone: string
    roles: TeamMember['roles']
    password: string
    active: boolean
    userRole: 'admin' | 'team'
  }>
): Promise<TeamMember> {
  const rows = await readSheetValues('TeamMembers', 'A2:K1000')
  const rowIndex = rows.findIndex((row) => row[7] === username)

  if (rowIndex === -1) {
    throw new Error('Team member not found')
  }

  const current = parseTeamMemberRow(rows[rowIndex])
  if (!current) {
    throw new Error('Team member row is invalid')
  }

  const updated: TeamMember = {
    ...current,
    name: updates.name ?? current.name,
    email: updates.email ?? current.email,
    phone: updates.phone ?? current.phone,
    roles: updates.roles ?? current.roles,
    password: updates.password ?? current.password,
    active: updates.active ?? current.active,
    userRole: updates.userRole ?? current.userRole,
  }

  const rowNumber = rowIndex + 2
  await updateSheetValues('TeamMembers', `A${rowNumber}:K${rowNumber}`, [
    [
      updated.id,
      updated.name,
      updated.email,
      updated.phone,
      JSON.stringify(updated.roles),
      updated.active ? 'TRUE' : 'FALSE',
      updated.join_date,
      updated.username,
      updated.password,
      updated.userRole,
      JSON.stringify(updated.portfolio_files || []),
    ],
  ])

  return updated
}

export async function transferAssignedRequests(fromUsername: string, toUsername = ''): Promise<void> {
  if (!fromUsername) return

  const rows = await readSheetValues('Responses', 'A2:R1000')

  await Promise.all(
    rows.map(async (row, index) => {
      if (!row[0]) return
      if ((row[10] || '') !== fromUsername) return

      const status = coerceStatus(row[8] || 'submitted')
      const priority = coercePriority(row[9] || 'normal')
      const approvalStatus = coerceApprovalStatus(row[11] || 'pending')
      const archived = parseSheetBoolean(row[12])

      const writeRow = [[
        status,
        priority,
        toUsername,
        approvalStatus,
        archived ? 'TRUE' : 'FALSE',
        row[13] || '',
        row[14] || '',
        row[15] || '',
        row[16] || '',
        row[17] || '',
      ]]

      const rowNumber = index + 2
      await updateSheetValues('Responses', `I${rowNumber}:R${rowNumber}`, writeRow)
    })
  )
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getFieldValue(data: Record<string, unknown>, aliases: string[]): unknown {
  const aliasSet = new Set(aliases.map((k) => normalizeKey(k)))
  for (const [key, value] of Object.entries(data)) {
    if (aliasSet.has(normalizeKey(key))) return value
  }
  return undefined
}

function parseContentTypes(value: unknown): Array<'video' | 'graphic' | 'story' | 'post' | 'reel' | 'carousel' | 'other'> {
  const allowed = ['video', 'graphic', 'story', 'post', 'reel', 'carousel', 'other'] as const
  const toType = (raw: string) => {
    const normalized = raw.trim().toLowerCase()
    if (normalized === 'instagram post') return 'post'
    if (normalized === 'instagram reel') return 'reel'
    if (normalized === 'instagram story') return 'story'
    if (normalized === 'flyer graphic') return 'graphic'
    return allowed.find((v) => v === normalized)
  }

  if (Array.isArray(value)) {
    const parsed = value
      .map((v) => (typeof v === 'string' ? toType(v) : undefined))
      .filter(Boolean) as Array<'video' | 'graphic' | 'story' | 'post' | 'reel' | 'carousel' | 'other'>
    return parsed.length ? Array.from(new Set(parsed)) : []
  }

  if (typeof value === 'string') {
    const split = value
      .split(',')
      .map((v) => toType(v))
      .filter(Boolean) as Array<'video' | 'graphic' | 'story' | 'post' | 'reel' | 'carousel' | 'other'>
    return split.length ? Array.from(new Set(split)) : []
  }

  return []
}

function coercePriority(value: unknown): 'urgent' | 'high' | 'normal' | 'low' {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (normalized === 'urgent' || normalized === 'high' || normalized === 'low') return normalized
  return 'normal'
}

function coerceStatus(value: unknown): 'submitted' | 'assigned' | 'in_progress' | 'in_review' | 'approved' | 'scheduled' | 'posted' {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (
    normalized === 'submitted' ||
    normalized === 'assigned' ||
    normalized === 'in_progress' ||
    normalized === 'in_review' ||
    normalized === 'approved' ||
    normalized === 'scheduled' ||
    normalized === 'posted'
  ) {
    return normalized
  }
  return 'submitted'
}

function coerceApprovalStatus(value: unknown): 'pending' | 'approved' | 'needs_edits' {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (normalized === 'approved' || normalized === 'needs_edits') return normalized
  return 'pending'
}

export async function getContentRequestsFromFormSlug(formSlug: string): Promise<any[]> {
  const form = await getFormBySlug(formSlug)
  if (!form) return []

  const fieldLabelToId = new Map<string, string>()
  const fieldLabelToOptionLabelByValue = new Map<string, Map<string, string>>()
  try {
    const parsed = JSON.parse(form.fields_json) as any
    const fields = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.fields) ? parsed.fields : []
    for (const field of fields) {
      if (field?.label && field?.id) {
        const normalizedLabel = normalizeKey(String(field.label))
        fieldLabelToId.set(normalizedLabel, String(field.id))

        const optionMap = new Map<string, string>()
        if (Array.isArray(field.options)) {
          for (const option of field.options) {
            if (option?.value !== undefined && option?.label !== undefined) {
              optionMap.set(String(option.value), String(option.label))
            }
          }
        }
        fieldLabelToOptionLabelByValue.set(normalizedLabel, optionMap)
      }
    }
  } catch {
    // Keep empty map; fallback alias-based matching still works for older data.
  }

  const readPayloadValue = (payload: Record<string, unknown>, labels: string[]) => {
    for (const label of labels) {
      const fieldId = fieldLabelToId.get(normalizeKey(label))
      if (fieldId && payload[fieldId] !== undefined && payload[fieldId] !== null && payload[fieldId] !== '') {
        return payload[fieldId]
      }
    }
    return getFieldValue(payload, labels)
  }

  const resolveOptionLabels = (labels: string[], rawValue: unknown): string[] => {
    const optionMap = (() => {
      for (const label of labels) {
        const map = fieldLabelToOptionLabelByValue.get(normalizeKey(label))
        if (map && map.size > 0) return map
      }
      return null
    })()

    const values = Array.isArray(rawValue)
      ? rawValue.map((v) => String(v))
      : typeof rawValue === 'string' && rawValue.trim()
        ? [rawValue]
        : []

    if (!optionMap) return values
    return values.map((v) => optionMap.get(v) || v)
  }

  const rows = await readSheetValues('Responses', 'A2:R1000')
  const requests = rows
    .filter((row) => row[0] && row[1] === form.id)
    .map((row) => {
      let payload: Record<string, unknown> = {}
      try {
        payload = row[2] ? (JSON.parse(row[2]) as Record<string, unknown>) : {}
      } catch {
        payload = {}
      }

      const role = String(readPayloadValue(payload, ['Role', 'Requestor role']) || 'Unknown')
      const resolvedRole = resolveOptionLabels(['Role', 'Requestor role'], role)[0] || role
      const organization = String(
        readPayloadValue(payload, ['Organization / Committee Name', 'Organization', 'Committee Name']) || ''
      )
      const contentGoal = String(readPayloadValue(payload, ['Content Goal', 'Goal']) || '')
      const contentTypeValue = readPayloadValue(payload, ['Content Type', 'Platform requested', 'content types'])
      const requestedContentTypes = resolveOptionLabels(
        ['Content Type', 'Platform requested', 'content types'],
        contentTypeValue
      )

      const preferredPost = String(
        readPayloadValue(payload, ['Preferred Post Date/Time', 'Preferred post date/time']) || ''
      )
      const hardDeadline = String(readPayloadValue(payload, ['Hard Deadline', 'Deadline']) || '')
      const eventDateTime = String(readPayloadValue(payload, ['Event Date/Time', 'Event Date']) || '')
      const eventLocation = String(readPayloadValue(payload, ['Event Location']) || '')
      const deadline = hardDeadline || preferredPost || row[3] || new Date().toISOString()

      const description =
        contentGoal ||
        String(
          readPayloadValue(payload, ['description', 'details', 'request description', 'what do you need posted']) ||
            ''
        ) ||
        'No description provided.'

      const keyMessage = String(readPayloadValue(payload, ['key message', 'caption draft', 'message', 'copy']) || contentGoal || description)

      const request = {
        id: row[0],
        submitted_date: row[3] || new Date().toISOString(),
        requestor_name:
          row[4] || String(readPayloadValue(payload, ['requestor name', 'name', 'submitted by']) || 'Unknown Requestor'),
        requestor_email:
          row[5] || String(readPayloadValue(payload, ['contact email', 'email']) || ''),
        requestor_role: resolvedRole,
        organization_name: organization,
        content_goal: contentGoal,
        requested_content_types: requestedContentTypes,
        preferred_post_datetime: preferredPost || undefined,
        hard_deadline: hardDeadline || undefined,
        event_datetime: eventDateTime || undefined,
        event_location: eventLocation || undefined,
        event_topic:
          String(
            readPayloadValue(payload, ['Event or initiative title', 'Title', 'event or initiative title', 'topic']) ||
              (contentGoal ? `${organization || 'SGA'} - ${contentGoal}` : (organization ? `${organization} Content Request` : 'Untitled Request'))
          ),
        event_date: eventDateTime || undefined,
        posting_deadline: deadline,
        content_types: parseContentTypes(requestedContentTypes),
        description,
        key_message: keyMessage,
        target_audience: String(readPayloadValue(payload, ['audience target', 'target audience']) || organization || 'Campus-wide'),
        assets: (() => {
          const v = readPayloadValue(payload, ['asset upload/link', 'assets', 'links to include'])
          if (Array.isArray(v)) return v.map(String)
          if (typeof v === 'string' && v.trim()) return [v]
          return []
        })(),
        priority: coercePriority(row[9] || readPayloadValue(payload, ['priority level', 'priority'])),
        status: coerceStatus(row[8]),
        assigned_to: row[10] || '',
        draft_link: row[14] || '',
        approval_status: coerceApprovalStatus(row[11]),
        vp_notes: row[13] || '',
        posted_date: row[15] || undefined,
        post_link: row[16] || '',
        additional_notes: row[17] || String(readPayloadValue(payload, ['additional notes']) || ''),
        archived: parseSheetBoolean(row[12]),
      }

      return request
    })

  return requests.sort(
    (a, b) => new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime()
  )
}

export async function updateContentRequestMeta(
  responseId: string,
  updates: Partial<{
    status: string
    priority: string
    assigned_to: string
    approval_status: string
    archived: boolean
    vp_notes: string
    draft_link: string
    posted_date: string
    post_link: string
    additional_notes: string
  }>
): Promise<void> {
  const rows = await readSheetValues('Responses', 'A2:R1000')
  const rowIndex = rows.findIndex((row) => row[0] === responseId)

  if (rowIndex === -1) {
    throw new Error('Content request not found')
  }

  const row = rows[rowIndex]
  const status = coerceStatus(updates.status ?? row[8] ?? 'submitted')
  const priority = coercePriority(updates.priority ?? row[9] ?? 'normal')
  const assigned_to = updates.assigned_to ?? row[10] ?? ''
  const approval_status = coerceApprovalStatus(updates.approval_status ?? row[11] ?? 'pending')
  const archived = updates.archived ?? parseSheetBoolean(row[12])
  const vp_notes = updates.vp_notes ?? row[13] ?? ''
  const draft_link = updates.draft_link ?? row[14] ?? ''
  const posted_date = updates.posted_date ?? row[15] ?? ''
  const post_link = updates.post_link ?? row[16] ?? ''
  const additional_notes = updates.additional_notes ?? row[17] ?? ''

  const writeRow = [[
    status,
    priority,
    assigned_to,
    approval_status,
    archived ? 'TRUE' : 'FALSE',
    vp_notes,
    draft_link,
    posted_date,
    post_link,
    additional_notes,
  ]]

  const rowNumber = rowIndex + 2
  await updateSheetValues('Responses', `I${rowNumber}:R${rowNumber}`, writeRow)
}

/**
 * Task Management Functions
 */

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const now = new Date().toISOString()

  const writeRow = [[
    id,
    task.name,
    task.description,
    task.created_by,
    now,
    now,
    task.due_date,
    task.assigned_to.join(','),
    task.content_request_id || '',
    task.status,
    task.archived ? 'TRUE' : 'FALSE',
  ]]

  await appendSheetValues('Tasks', writeRow)

  return {
    ...task,
    id,
    created_at: now,
    updated_at: now,
  }
}

export async function getTasks(): Promise<Task[]> {
  const rows = await readSheetValues('Tasks', 'A2:K1000')
  return rows.map((row) => ({
    id: row[0],
    name: row[1] || '',
    description: row[2] || '',
    created_by: row[3] || '',
    created_at: row[4] || '',
    updated_at: row[5] || '',
    due_date: row[6] || '',
    assigned_to: (row[7] || '').split(',').filter((u: string) => u.trim()),
    content_request_id: row[8],
    status: (row[9] || 'pending') as 'pending' | 'in_progress' | 'completed',
    archived: parseSheetBoolean(row[10]),
  })) as Task[]
}

export async function getTasksByAssignee(
  username: string,
  includeCompleted = false
): Promise<Task[]> {
  const tasks = await getTasks()
  return tasks.filter(
    (task) =>
      task.assigned_to.includes(username) &&
      !task.archived &&
      (includeCompleted || task.status !== 'completed')
  )
}

export async function getTasksByCreator(username: string): Promise<Task[]> {
  const tasks = await getTasks()
  return tasks.filter((task) => task.created_by === username && !task.archived)
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const tasks = await getTasks()
  return tasks.find((task) => task.id === taskId) || null
}

export async function updateTask(
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'created_at' | 'created_by'>>
): Promise<Task> {
  const rows = await readSheetValues('Tasks', 'A2:K1000')
  const rowIndex = rows.findIndex((row) => row[0] === taskId)

  if (rowIndex === -1) {
    throw new Error('Task not found')
  }

  const row = rows[rowIndex]
  const existing = {
    id: row[0],
    name: row[1] || '',
    description: row[2] || '',
    created_by: row[3] || '',
    created_at: row[4] || '',
    updated_at: row[5] || '',
    due_date: row[6] || '',
    assigned_to: (row[7] || '').split(',').filter((u: string) => u.trim()),
    content_request_id: row[8],
    status: (row[9] || 'pending') as 'pending' | 'in_progress' | 'completed',
    archived: parseSheetBoolean(row[10]),
  }

  const updated = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  }

  const writeRow = [[
    updated.id,
    updated.name,
    updated.description,
    updated.created_by,
    updated.created_at,
    updated.updated_at,
    updated.due_date,
    updated.assigned_to.join(','),
    updated.content_request_id || '',
    updated.status,
    updated.archived ? 'TRUE' : 'FALSE',
  ]]

  const rowNumber = rowIndex + 2
  await updateSheetValues('Tasks', `A${rowNumber}:K${rowNumber}`, writeRow)

  return updated as Task
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const rows = await readSheetValues('Tasks', 'A2:K1000')
  const rowIndex = rows.findIndex((row) => row[0] === taskId)

  if (rowIndex === -1) {
    throw new Error('Task not found')
  }

  // Mark as archived instead of actually deleting
  await updateTask(taskId, { archived: true })
  return true
}

/**
 * Ideas Bank Functions
 */

function parseIdeaRow(row: string[]): (Idea & { archived?: boolean }) | null {
  if (!row || !row[0]) return null

  return {
    id: row[0],
    idea_text: row[1] || '',
    category: (row[2] || 'one-off') as Idea['category'],
    submitted_by: row[3] || '',
    status: (row[4] || 'new') as Idea['status'],
    submitted_date: row[5] || new Date().toISOString(),
    archived: parseSheetBoolean(row[6]),
  }
}

export async function getIdeas(includeArchived = false): Promise<Idea[]> {
  const rows = await readSheetValues('Ideas', 'A2:G1000')
  const ideas = rows.map(parseIdeaRow).filter(Boolean) as Array<Idea & { archived?: boolean }>
  const filtered = includeArchived ? ideas : ideas.filter((idea) => !idea.archived)
  return filtered.map(({ archived: _archived, ...idea }) => idea)
}

export async function getIdeaById(ideaId: string): Promise<(Idea & { archived?: boolean }) | null> {
  const rows = await readSheetValues('Ideas', 'A2:G1000')
  const row = rows.find((r) => r[0] === ideaId)
  if (!row) return null
  return parseIdeaRow(row)
}

export async function createIdea(data: Omit<Idea, 'id' | 'submitted_date'>): Promise<Idea> {
  const idea: Idea = {
    id: `idea_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    idea_text: data.idea_text,
    category: data.category,
    submitted_by: data.submitted_by,
    status: data.status,
    submitted_date: new Date().toISOString(),
  }

  await appendSheetValues('Ideas', [
    [
      idea.id,
      idea.idea_text,
      idea.category,
      idea.submitted_by,
      idea.status,
      idea.submitted_date,
      'FALSE',
    ],
  ])

  return idea
}

export async function updateIdea(
  ideaId: string,
  updates: Partial<Pick<Idea, 'idea_text' | 'category' | 'status'>>
): Promise<Idea> {
  const rows = await readSheetValues('Ideas', 'A2:G1000')
  const rowIndex = rows.findIndex((row) => row[0] === ideaId)

  if (rowIndex === -1) {
    throw new Error('Idea not found')
  }

  const existing = parseIdeaRow(rows[rowIndex])
  if (!existing) {
    throw new Error('Idea row is invalid')
  }

  const updated = {
    ...existing,
    idea_text: updates.idea_text ?? existing.idea_text,
    category: updates.category ?? existing.category,
    status: updates.status ?? existing.status,
  }

  const rowNumber = rowIndex + 2
  await updateSheetValues('Ideas', `A${rowNumber}:G${rowNumber}`, [
    [
      updated.id,
      updated.idea_text,
      updated.category,
      updated.submitted_by,
      updated.status,
      updated.submitted_date,
      updated.archived ? 'TRUE' : 'FALSE',
    ],
  ])

  const { archived: _archived, ...idea } = updated
  return idea
}

export async function deleteIdea(ideaId: string): Promise<void> {
  const rows = await readSheetValues('Ideas', 'A2:G1000')
  const rowIndex = rows.findIndex((row) => row[0] === ideaId)

  if (rowIndex === -1) {
    throw new Error('Idea not found')
  }

  const existing = parseIdeaRow(rows[rowIndex])
  if (!existing) {
    throw new Error('Idea row is invalid')
  }

  const rowNumber = rowIndex + 2
  await updateSheetValues('Ideas', `A${rowNumber}:G${rowNumber}`, [
    [
      existing.id,
      existing.idea_text,
      existing.category,
      existing.submitted_by,
      existing.status,
      existing.submitted_date,
      'TRUE',
    ],
  ])
}

