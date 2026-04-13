import type {
  ActivityEntry,
  CalendarPost,
  ContentRequest,
  DashboardSeedData,
  DashboardSettings,
  DashboardUser,
  Idea,
  TeamMember,
} from './types'

const now = new Date()

const daysFromNow = (days: number) => {
  const date = new Date(now)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

const monthDay = (month: number, day: number) => new Date(2026, month, day).toISOString()

export const dashboardSettings: DashboardSettings = {
  appName: 'SGA Comms Dashboard',
  orgName: 'SGA Communications',
  brandTagline: 'Requests, calendars, and team workflow in one clean workspace.',
  uploadLimitMb: 2,
  allowedUploadTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'video/mp4'],
  analytics: {
    totalFollowers: 12480,
    weeklyEngagement: 3820,
    postsThisMonth: 18,
    topPerformingPost: 'Spring Fest teaser reel',
  },
}

// Bootstrap admin credentials moved to environment variables for security
// See .env.local for SGA_BOOTSTRAP_USERNAME and SGA_BOOTSTRAP_PASSWORD
export const dashboardUsers: DashboardUser[] = []

export const dashboardTeamMembers: TeamMember[] = []

export const dashboardRequests: ContentRequest[] = []

export const dashboardCalendarPosts: CalendarPost[] = [
  {
    id: 'post-2001',
    post_date: daysFromNow(1),
    content_type: 'reel',
    series: "Michael's Minutes",
    caption: 'Week 5 recap with student shoutouts.',
    media_files: [],
    posted: false,
    related_request_id: 'req-1002',
  },
  {
    id: 'post-2002',
    post_date: daysFromNow(3),
    content_type: 'story',
    series: 'Campus Spotlight',
    caption: 'Move-in weekend highlight frames.',
    media_files: [],
    posted: false,
    related_request_id: 'req-1003',
  },
  {
    id: 'post-2003',
    post_date: daysFromNow(7),
    content_type: 'post',
    series: 'Event Coverage',
    caption: 'Spring Fest promo roundup.',
    media_files: [],
    posted: false,
    related_request_id: 'req-1001',
  },
]

export const dashboardIdeas: Idea[] = [
  {
    id: 'idea-3001',
    idea_text: 'Student of the week spotlights with short behind-the-scenes clips.',
    category: 'recurring',
    submitted_by: 'tyler',
    status: 'new',
    submitted_date: daysFromNow(-2),
  },
  {
    id: 'idea-3002',
    idea_text: 'Quick before-and-after post for renovations and campus upgrades.',
    category: 'event',
    submitted_by: 'maya',
    status: 'in_progress',
    submitted_date: daysFromNow(-7),
  },
  {
    id: 'idea-3003',
    idea_text: 'Monthly wrap-up reel featuring best-performing content and event highlights.',
    category: 'seasonal',
    submitted_by: 'carson',
    status: 'used',
    submitted_date: daysFromNow(-14),
  },
]

export const dashboardActivityLog: ActivityEntry[] = [
  {
    id: 'activity-1',
    actor: 'Tyler Mastrangelo',
    action: 'approved request',
    detail: 'Homecoming Promo was marked approved and scheduled.',
    timestamp: daysFromNow(-1),
  },
  {
    id: 'activity-2',
    actor: 'Carson Reeves',
    action: 'updated draft',
    detail: "Michael's Minutes - Week 5 was moved into progress.",
    timestamp: daysFromNow(-2),
  },
  {
    id: 'activity-3',
    actor: 'Maya Patel',
    action: 'added idea',
    detail: 'Student of the week spotlight concept was submitted.',
    timestamp: daysFromNow(-3),
  },
]

export const dashboardSeedData: DashboardSeedData = {
  users: dashboardUsers,
  teamMembers: dashboardTeamMembers,
  requests: dashboardRequests,
  calendarPosts: dashboardCalendarPosts,
  ideas: dashboardIdeas,
  activityLog: dashboardActivityLog,
  settings: dashboardSettings,
}