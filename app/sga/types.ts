export type DashboardRole = 'admin' | 'team'

export type RequestPriority = 'urgent' | 'high' | 'normal' | 'low'
export type RequestStatus =
  | 'submitted'
  | 'assigned'
  | 'in_progress'
  | 'in_review'
  | 'approved'
  | 'scheduled'
  | 'posted'

export type ApprovalStatus = 'pending' | 'approved' | 'needs_edits'

export type ContentType = 'video' | 'graphic' | 'story' | 'post' | 'reel' | 'carousel' | 'other'

export type IdeaCategory = 'seasonal' | 'recurring' | 'one-off' | 'event'
export type IdeaStatus = 'new' | 'in_progress' | 'used'

export type TeamSkill = 'video' | 'editing' | 'design' | 'social'

export type CalendarContentType = 'reel' | 'post' | 'story'

export interface DashboardUser {
  username: string
  password: string
  role: DashboardRole
  name: string
  email?: string
  phone?: string
  active?: boolean
}

export interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  roles: TeamSkill[]
  active: boolean
  join_date: string
  username: string
  password: string
  userRole: DashboardRole
  portfolio_files: string[]
}

export interface ContentRequest {
  id: string
  submitted_date: string
  requestor_name: string
  requestor_email: string
  requestor_role: string
  organization_name?: string
  content_goal?: string
  requested_content_types?: string[]
  preferred_post_datetime?: string
  hard_deadline?: string
  event_datetime?: string
  event_location?: string
  event_topic: string
  event_date?: string
  posting_deadline: string
  content_types: ContentType[]
  description: string
  key_message: string
  target_audience: string
  assets: string[]
  priority: RequestPriority
  status: RequestStatus
  assigned_to: string
  draft_link: string
  approval_status: ApprovalStatus
  vp_notes: string
  posted_date?: string
  post_link: string
  additional_notes: string
  archived: boolean
}

export interface CalendarPost {
  id: string
  post_date: string
  content_type: CalendarContentType
  series: string
  caption: string
  media_files: string[]
  posted: boolean
  related_request_id?: string
  post_link?: string
}

export interface Idea {
  id: string
  idea_text: string
  category: IdeaCategory
  submitted_by: string
  status: IdeaStatus
  submitted_date: string
}

export interface ActivityEntry {
  id: string
  actor: string
  action: string
  detail: string
  timestamp: string
}

export interface AnalyticsSnapshot {
  totalFollowers: number
  weeklyEngagement: number
  postsThisMonth: number
  topPerformingPost: string
}

export interface DashboardSettings {
  appName: string
  orgName: string
  brandTagline: string
  uploadLimitMb: number
  allowedUploadTypes: string[]
  analytics: AnalyticsSnapshot
}

export interface DashboardSeedData {
  users: DashboardUser[]
  teamMembers: TeamMember[]
  requests: ContentRequest[]
  calendarPosts: CalendarPost[]
  ideas: Idea[]
  activityLog: ActivityEntry[]
  settings: DashboardSettings
}

export interface AuthSession {
  username: string
  role: DashboardRole
  name: string
}

// Form Builder Types
export type FormFieldType =
  | 'text'
  | 'email'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'radio'
  | 'dropdown'
  | 'date'
  | 'phone'
  | 'file'
  | 'rating'
  | 'url'
  | 'section'

export interface FormField {
  id: string
  label: string
  type: FormFieldType
  placeholder?: string
  description?: string
  required: boolean
  options?: { label: string; value: string }[] // For checkbox, radio, dropdown
  maxLength?: number
  minLength?: number
  pattern?: string
  helpText?: string
  order: number
}

export interface Form {
  id: string
  name: string
  description: string
  slug: string
  fields_json: string // JSON stringified array of FormField[]
  created_by: string
  created_at: string
  updated_at: string
  is_active: boolean
  response_count?: number
}

export type FormContactFieldMode = 'off' | 'optional' | 'required'

export interface FormContactSettings {
  name: FormContactFieldMode
  email: FormContactFieldMode
}

export interface SerializedFormConfig {
  fields: FormField[]
  contact?: FormContactSettings
}

export interface FormResponse {
  id: string
  form_id: string
  response_data: string // JSON stringified object of form answers
  submitted_at: string
  submitter_name?: string
  submitter_email?: string
  ip_address?: string
  user_agent?: string
}

export interface FormAnalytics {
  total_responses: number
  response_rate?: number
  avg_completion_time?: number
  field_analytics?: Record<
    string,
    {
      field_label: string
      responses: number
      completion_rate: number
    }
  >
}

export interface Task {
  id: string
  name: string
  description: string
  created_by: string
  created_at: string
  updated_at: string
  due_date: string
  assigned_to: string[] // array of usernames
  content_request_id?: string // optional link to content request
  status: 'pending' | 'in_progress' | 'completed'
  archived: boolean
}