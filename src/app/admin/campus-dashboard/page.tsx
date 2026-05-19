'use client'

import { DashboardLayout } from './components/DashboardLayout'
import { WelcomeBanner } from './components/WelcomeBanner'
import { StatsCards } from './components/StatsCards'
import { AnalyticsChart } from './components/AnalyticsChart'
import { AttendanceChart } from './components/AttendanceChart'
import { RecentAnnouncements } from './components/RecentAnnouncements'
import { UpcomingClasses } from './components/UpcomingClasses'
import { ActivityTimeline } from './components/ActivityTimeline'
import { PlaceholderView } from './components/PlaceholderView'

function DashboardHome() {
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1600px] mx-auto">
      <WelcomeBanner />
      <StatsCards />
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 min-h-[320px]">
          <AnalyticsChart />
        </div>
        <div className="min-h-[320px]">
          <AttendanceChart />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentAnnouncements />
        </div>
        <div>
          <ActivityTimeline />
        </div>
      </div>
      <UpcomingClasses />
      <div className="h-2" />
    </div>
  )
}

export default function CampusDashboardPage() {
  return (
    <DashboardLayout>
      {(activeItem) => {
        if (activeItem === 'dashboard') {
          return <DashboardHome />
        }
        return <PlaceholderView view={activeItem} />
      }}
    </DashboardLayout>
  )
}
