'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TeamMember, TeamSkill } from '@/app/sga/types'
import { useSession } from '@/lib/sga-session'

const TEAM_SKILLS: TeamSkill[] = ['video', 'editing', 'design', 'social']

export default function TeamPage() {
  const router = useRouter()
  const { user } = useSession()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roles: [] as string[],
    username: '',
    password: '',
    userRole: 'team' as 'team' | 'admin',
  })
  const [removingUser, setRemovingUser] = useState<string | null>(null)
  const [transferTo, setTransferTo] = useState('')
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isEditingMember, setIsEditingMember] = useState(false)
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userRole: 'team' as 'team' | 'admin',
    roles: [] as TeamSkill[],
  })

  const loadMembers = async () => {
    try {
      setLoadingMembers(true)
      const res = await fetch('/api/sga/team?includeSecrets=1', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load members')
      }
      setTeamMembers(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load team roster.')
    } finally {
      setLoadingMembers(false)
    }
  }

  useEffect(() => {
    if (!user) return
    if (user.role !== 'admin') {
      router.push('/sga')
      return
    }
    loadMembers()
  }, [user, router])

  const handleAddMember = async () => {
    setError('')

    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      const response = await fetch('/api/sga/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create member')
      }

      await loadMembers()
      setFormData({
        name: '',
        email: '',
        phone: '',
        roles: [],
        username: '',
        password: '',
        userRole: 'team',
      })
      setShowAddForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create member.')
    }
  }

  const handleRemoveMember = async (username: string) => {
    setError('')
    try {
      const response = await fetch('/api/sga/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, transferTo }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove member')
      }

      await loadMembers()
      if (selectedMember?.username === username) {
        setSelectedMember(null)
      }
      setRemovingUser(null)
      setTransferTo('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member.')
    }
  }

  const handleUpdateMember = async (member: TeamMember, updates: Partial<TeamMember>) => {
    setError('')

    try {
      const response = await fetch('/api/sga/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: member.username,
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          password: updates.password,
          roles: updates.roles,
          userRole: updates.userRole,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update member')
      }

      await loadMembers()
      if (selectedMember?.username === member.username) {
        const merged = { ...selectedMember, ...data }
        setSelectedMember(merged)
        setMemberForm({
          name: merged.name || '',
          email: merged.email || '',
          phone: merged.phone || '',
          password: merged.password || '',
          userRole: merged.userRole,
          roles: [...(merged.roles || [])],
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member.')
    }
  }

  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member)
    setShowPassword(false)
    setIsEditingMember(false)
    setMemberForm({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      password: member.password || '',
      userRole: member.userRole,
      roles: [...(member.roles || [])],
    })
  }

  const handleSaveMemberDetails = async () => {
    if (!selectedMember) return
    await handleUpdateMember(selectedMember, {
      name: memberForm.name,
      email: memberForm.email,
      phone: memberForm.phone,
      password: memberForm.password,
      userRole: memberForm.userRole,
      roles: memberForm.roles,
    })
    setIsEditingMember(false)
  }

  const activeMembers = teamMembers.filter((m) => m.active)

  if (user && user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Access denied. Admin only.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Team Roster</h1>
          <p className="text-slate-600">Communications team members and their roles</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          {showAddForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h3 className="font-semibold text-slate-900">New Team Member</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.userRole}
              onChange={(e) =>
                setFormData({ ...formData, userRole: e.target.value === 'admin' ? 'admin' : 'team' })
              }
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="team">Team Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Roles</label>
            <div className="flex flex-wrap gap-2">
              {TEAM_SKILLS.map((role) => (
                <label key={role} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, roles: [...formData.roles, role] })
                      } else {
                        setFormData({
                          ...formData,
                          roles: formData.roles.filter((r) => r !== role),
                        })
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddMember}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
            >
              Add Member
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>

        </div>
      )}

      {/* Team Grid */}
      {loadingMembers ? (
        <div className="text-slate-600">Loading team members...</div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => handleSelectMember(member)}
            className="text-left cursor-pointer bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md hover:border-blue-300 transition"
          >
            <h3 className="font-semibold text-slate-900 mb-1">{member.name}</h3>
            
            <div className="text-xs text-slate-600 space-y-1 mb-3">
              <p>{member.email}</p>
              {member.phone && <p>{member.phone}</p>}
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {member.roles.map((role) => (
                <span key={role} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded capitalize">
                  {role}
                </span>
              ))}
            </div>

            <div className="text-xs text-slate-600">
              <p>Joined: {new Date(member.join_date).toLocaleDateString()}</p>
              <p className="text-blue-600 mt-1">Click to view full details</p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
              <label className="block text-xs font-medium text-slate-700">Role Access</label>
              <select
                value={member.userRole}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  handleUpdateMember(member, {
                    userRole: e.target.value === 'admin' ? 'admin' : 'team',
                  })
                }
                className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                disabled={member.username === user?.username}
              >
                <option value="team">Team</option>
                <option value="admin">Admin</option>
              </select>

              {member.username !== user?.username && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setRemovingUser(member.username)
                  }}
                  className="w-full px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200"
                >
                  Remove Member
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {activeMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-600">No team members yet</p>
        </div>
      )}

      {removingUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Remove Team Member</h3>
            <p className="text-sm text-slate-600">
              You can transfer assigned requests to someone else before removing this member.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">Transfer assigned requests to</label>
              <select
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Unassign all requests</option>
                {activeMembers
                  .filter((m) => m.username !== removingUser)
                  .map((member) => (
                    <option key={member.username} value={member.username}>
                      {member.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRemovingUser(null)
                  setTransferTo('')
                }}
                className="flex-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveMember(removingUser)}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMember && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{selectedMember.name}</h3>
                <p className="text-sm text-slate-600">Team member details</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingMember) {
                      setIsEditingMember(false)
                      setMemberForm({
                        name: selectedMember.name || '',
                        email: selectedMember.email || '',
                        phone: selectedMember.phone || '',
                        password: selectedMember.password || '',
                        userRole: selectedMember.userRole,
                        roles: [...(selectedMember.roles || [])],
                      })
                    } else {
                      setIsEditingMember(true)
                    }
                  }}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50"
                >
                  {isEditingMember ? 'Cancel Edit' : 'Edit'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {isEditingMember ? (
                <EditableRow
                  label="Email"
                  value={memberForm.email}
                  onChange={(value) => setMemberForm((prev) => ({ ...prev, email: value }))}
                />
              ) : (
                <InfoRow label="Email" value={selectedMember.email || '—'} />
              )}

              {isEditingMember ? (
                <EditableRow
                  label="Phone"
                  value={memberForm.phone}
                  onChange={(value) => setMemberForm((prev) => ({ ...prev, phone: value }))}
                />
              ) : (
                <InfoRow label="Phone" value={selectedMember.phone || '—'} />
              )}

              {isEditingMember ? (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-medium text-slate-600 mb-1">Role Access</p>
                  <select
                    value={memberForm.userRole}
                    onChange={(e) =>
                      setMemberForm((prev) => ({ ...prev, userRole: e.target.value === 'admin' ? 'admin' : 'team' }))
                    }
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  >
                    <option value="team">Team</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ) : (
                <InfoRow label="Role Access" value={selectedMember.userRole === 'admin' ? 'Admin' : 'Team'} />
              )}

              <InfoRow label="Joined" value={new Date(selectedMember.join_date).toLocaleDateString()} />

              {isEditingMember ? (
                <EditableRow
                  label="Name"
                  value={memberForm.name}
                  onChange={(value) => setMemberForm((prev) => ({ ...prev, name: value }))}
                />
              ) : (
                <InfoRow label="Name" value={selectedMember.name || '—'} />
              )}

              <InfoRow label="Username" value={selectedMember.username || '—'} />

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 sm:col-span-2">
                <p className="text-xs font-medium text-slate-600 mb-1">Password</p>
                <div className="flex items-center justify-between gap-3">
                  {isEditingMember ? (
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={memberForm.password}
                      onChange={(e) => setMemberForm((prev) => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
                    />
                  ) : (
                    <p className="text-slate-900 font-mono break-all text-sm">
                      {showPassword ? selectedMember.password || '—' : selectedMember.password ? '••••••••' : '—'}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="px-2.5 py-1 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Skills</p>
              {isEditingMember ? (
                <div className="flex flex-wrap gap-3">
                  {TEAM_SKILLS.map((role) => (
                    <label key={role} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={memberForm.roles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMemberForm((prev) => ({ ...prev, roles: [...prev.roles, role as TeamSkill] }))
                          } else {
                            setMemberForm((prev) => ({
                              ...prev,
                              roles: prev.roles.filter((r) => r !== role),
                            }))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedMember.roles.length > 0 ? (
                    selectedMember.roles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded capitalize"
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm">No skills selected</span>
                  )}
                </div>
              )}
            </div>

            {isEditingMember && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveMemberDetails}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
      <p className="text-xs font-medium text-slate-600 mb-1">{label}</p>
      <p className="text-slate-900 break-all">{value}</p>
    </div>
  )
}

function EditableRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
      <p className="text-xs font-medium text-slate-600 mb-1">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
      />
    </div>
  )
}
