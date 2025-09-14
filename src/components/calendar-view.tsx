'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStudyStore } from '@/store/study-store'

const CalendarView = () => {
  const { sessions, categories, getSessionsByDate } = useStudyStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`
  }

  const getDayStudyTime = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const daySessions = getSessionsByDate(dateStr)
    return daySessions.reduce((total, session) => total + session.duration, 0)
  }

  const getDayCategories = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const daySessions = getSessionsByDate(dateStr)
    const uniqueCategories = [...new Set(daySessions.map(s => s.subject))]
    return uniqueCategories.map(categoryName => {
      const category = categories.find(c => c.name === categoryName)
      return category || { name: categoryName, color: '#6B7280', icon: '📚' }
    })
  }

  const getStudyTimeLevel = (minutes: number) => {
    if (minutes === 0) return 'none'
    if (minutes < 30) return 'low'
    if (minutes < 120) return 'medium'
    if (minutes < 240) return 'high'
    return 'very-high'
  }

  const getStudyTimeColor = (level: string) => {
    switch (level) {
      case 'none': return 'bg-gray-100 dark:bg-gray-800'
      case 'low': return 'bg-blue-200 dark:bg-blue-900/40'
      case 'medium': return 'bg-blue-400 dark:bg-blue-700/60'
      case 'high': return 'bg-blue-600 dark:bg-blue-600/80'
      case 'very-high': return 'bg-blue-800 dark:bg-blue-500'
      default: return 'bg-gray-100 dark:bg-gray-800'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1))
  }

  // Get days for the grid (including previous/next month days for complete weeks)
  const startDate = startOfMonth(currentMonth)
  const endDate = endOfMonth(currentMonth)
  const startWeek = new Date(startDate)
  startWeek.setDate(startDate.getDate() - startDate.getDay())
  const endWeek = new Date(endDate)
  endWeek.setDate(endDate.getDate() + (6 - endDate.getDay()))

  const calendarDays = eachDayOfInterval({ start: startWeek, end: endWeek })

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          カレンダー
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          日々の勉強記録をカレンダーで確認できます。
        </p>
      </div>

      {/* Calendar Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>{format(currentMonth, 'yyyy年M月')}</span>
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-px mb-2">
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {calendarDays.map((day, index) => {
              const studyTime = getDayStudyTime(day)
              const studyLevel = getStudyTimeLevel(studyTime)
              const dayCategories = getDayCategories(day)
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isCurrentDay = isToday(day)

              return (
                <div
                  key={index}
                  className={`
                    min-h-[120px] p-2 bg-white dark:bg-gray-800 relative
                    ${!isCurrentMonth ? 'opacity-50' : ''}
                    ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`
                      text-sm font-medium
                      ${isCurrentDay ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}
                    `}>
                      {format(day, 'd')}
                    </span>
                    {studyTime > 0 && (
                      <div
                        className={`w-3 h-3 rounded-full ${getStudyTimeColor(studyLevel)}`}
                        title={`勉強時間: ${formatTime(studyTime)}`}
                      />
                    )}
                  </div>

                  {/* Study time */}
                  {studyTime > 0 && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {formatTime(studyTime)}
                    </div>
                  )}

                  {/* Category indicators */}
                  <div className="space-y-1">
                    {dayCategories.slice(0, 3).map((category, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-1 text-xs"
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-gray-700 dark:text-gray-300 truncate">
                          {category.name}
                        </span>
                      </div>
                    ))}
                    {dayCategories.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayCategories.length - 3}個
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>勉強時間:</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
                  <span>なし</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-900/40" />
                  <span>少</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-700/60" />
                  <span>中</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-blue-600 dark:bg-blue-600/80" />
                  <span>多</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-blue-800 dark:bg-blue-500" />
                  <span>とても多</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">今月の勉強時間</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(
                    sessions
                      .filter(session => {
                        const sessionDate = new Date(session.date)
                        return sessionDate >= monthStart && sessionDate <= monthEnd
                      })
                      .reduce((total, session) => total + session.duration, 0)
                  )}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">今月の勉強日数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(
                    sessions
                      .filter(session => {
                        const sessionDate = new Date(session.date)
                        return sessionDate >= monthStart && sessionDate <= monthEnd
                      })
                      .map(session => session.date)
                  ).size}日
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">今月のセッション数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sessions
                    .filter(session => {
                      const sessionDate = new Date(session.date)
                      return sessionDate >= monthStart && sessionDate <= monthEnd
                    }).length}回
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CalendarView