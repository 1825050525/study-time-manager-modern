'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import Dashboard from '@/components/dashboard'
import AddStudyForm from '@/components/add-study-form'
import CalendarView from '@/components/calendar-view'
import AnalyticsView from '@/components/analytics-view'
import AchievementsView from '@/components/achievements-view'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />
      case 'add':
        return <AddStudyForm />
      case 'calendar':
        return <CalendarView />
      case 'analytics':
        return <AnalyticsView />
      case 'achievements':
        return <AchievementsView />
      default:
        return <Dashboard onTabChange={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  )
}
