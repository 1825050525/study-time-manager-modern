'use client'

import { useMemo } from 'react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, subMonths } from 'date-fns'
import { BarChart3, TrendingUp, Clock, Target, Calendar, PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStudyStore } from '@/store/study-store'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const AnalyticsView = () => {
  const { sessions, categories, getStats } = useStudyStore()
  const stats = getStats()

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`
  }

  // Calculate weekly data for the past 8 weeks
  const weeklyData = useMemo(() => {
    const weeks = []
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i))
      const weekEnd = endOfWeek(weekStart)
      const weekLabel = format(weekStart, 'M/d')

      const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date)
        return sessionDate >= weekStart && sessionDate <= weekEnd
      })

      const totalTime = weekSessions.reduce((total, session) => total + session.duration, 0)
      weeks.push({ label: weekLabel, time: totalTime, sessions: weekSessions.length })
    }
    return weeks
  }, [sessions])

  // Calculate daily data for the past 2 weeks
  const dailyData = useMemo(() => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const day = subDays(new Date(), i)
      const dayLabel = format(day, 'M/d')
      const dateStr = format(day, 'yyyy-MM-dd')

      const daySessions = sessions.filter(session => session.date === dateStr)
      const totalTime = daySessions.reduce((total, session) => total + session.duration, 0)

      days.push({ label: dayLabel, time: totalTime, sessions: daySessions.length })
    }
    return days
  }, [sessions])

  // Category analysis
  const categoryAnalysis = useMemo(() => {
    return Object.entries(stats.categoryStats)
      .map(([name, data]) => {
        const category = categories.find(c => c.name === name)
        return {
          name,
          ...data,
          color: category?.color || '#6B7280',
          icon: category?.icon || '📚'
        }
      })
      .sort((a, b) => b.time - a.time)
  }, [stats.categoryStats, categories])

  // Study time trends
  const averageWeeklyTime = weeklyData.length > 0 ?
    weeklyData.reduce((sum, week) => sum + week.time, 0) / weeklyData.length : 0

  const averageDailyTime = dailyData.length > 0 ?
    dailyData.reduce((sum, day) => sum + day.time, 0) / dailyData.length : 0

  // Peak study hours analysis
  const hourlyDistribution = useMemo(() => {
    const hours = new Array(24).fill(0)
    sessions.forEach(session => {
      const startHour = new Date(session.startTime).getHours()
      hours[startHour] += session.duration
    })

    const peakHour = hours.indexOf(Math.max(...hours))
    return { hours, peakHour }
  }, [sessions])

  const maxWeeklyTime = Math.max(...weeklyData.map(w => w.time), 1)
  const maxDailyTime = Math.max(...dailyData.map(d => d.time), 1)
  const maxCategoryTime = Math.max(...categoryAnalysis.map(c => c.time), 1)

  // Chart.js data for bar chart (weekly data)
  const weeklyChartData = useMemo(() => ({
    labels: weeklyData.map(w => w.label),
    datasets: [
      {
        label: '勉強時間 (分)',
        data: weeklyData.map(w => w.time),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }), [weeklyData])

  // Chart.js data for pie chart (category distribution)
  const categoryChartData = useMemo(() => ({
    labels: categoryAnalysis.map(c => c.name),
    datasets: [
      {
        data: categoryAnalysis.map(c => c.time),
        backgroundColor: categoryAnalysis.map(c => c.color + 'CC'), // Add transparency
        borderColor: categoryAnalysis.map(c => c.color),
        borderWidth: 2,
      },
    ],
  }), [categoryAnalysis])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || context.raw;
            const hours = Math.floor(value / 60);
            const mins = value % 60;
            const timeStr = hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
            return `${label}: ${timeStr}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            const hours = Math.floor(value / 60);
            const mins = value % 60;
            return hours > 0 ? `${hours}h${mins}m` : `${mins}m`;
          }
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            const hours = Math.floor(value / 60);
            const mins = value % 60;
            const timeStr = hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
            return `${label}: ${timeStr} (${percentage}%)`;
          }
        }
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          分析
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          学習データの詳細な分析と傾向を確認できます。
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">週平均勉強時間</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(Math.round(averageWeeklyTime))}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">日平均勉強時間</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(Math.round(averageDailyTime))}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">最も集中する時間</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {hourlyDistribution.peakHour}時
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">勉強した日数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(sessions.map(s => s.date)).size}日
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>週間勉強時間の推移</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {weeklyData.length > 0 ? (
                <Bar data={weeklyChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  データがありません
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>カテゴリー別勉強時間の分布</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {categoryAnalysis.length > 0 ? (
                <Pie data={categoryChartData} options={pieOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  データがありません
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>カテゴリー別分析</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryAnalysis.length > 0 ? (
            <div className="space-y-6">
              {categoryAnalysis.map((category, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{category.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Level {category.level} • {category.streak}日連続
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatTime(category.time)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.sessions}回のセッション
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {/* Time Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: category.color,
                          width: `${(category.time / maxCategoryTime) * 100}%`
                        }}
                      />
                    </div>
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">XP</p>
                        <p className="font-medium text-gray-900 dark:text-white">{category.xp}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">平均/セッション</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {category.sessions > 0 ? formatTime(Math.round(category.time / category.sessions)) : '0分'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">全体の割合</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {stats.totalStudyTime > 0 ? Math.round((category.time / stats.totalStudyTime) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                まだデータがありません
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                勉強記録を追加すると、詳細な分析が表示されます。
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Study Habits Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>学習パターンの洞察</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">勉強時間帯の分布</h4>
              <div className="space-y-2">
                {[
                  { label: '朝 (6-12時)', range: [6, 12] },
                  { label: '午後 (12-18時)', range: [12, 18] },
                  { label: '夜 (18-24時)', range: [18, 24] },
                  { label: '深夜 (0-6時)', range: [0, 6] }
                ].map(period => {
                  const periodTime = period.range.reduce((sum, hour) => {
                    if (period.range[0] === 18) {
                      // 18-24時の場合
                      return sum + (hourlyDistribution.hours[hour] || 0)
                    } else if (period.range[0] === 0) {
                      // 0-6時の場合
                      return hour < 6 ? sum + (hourlyDistribution.hours[hour] || 0) : sum
                    } else {
                      // その他
                      return hour >= period.range[0] && hour < period.range[1]
                        ? sum + (hourlyDistribution.hours[hour] || 0)
                        : sum
                    }
                  }, 0)
                  const maxPeriodTime = Math.max(...[
                    [6, 12], [12, 18], [18, 24], [0, 6]
                  ].map(range => range.reduce((sum, hour) => sum + (hourlyDistribution.hours[hour] || 0), 0)), 1)

                  return (
                    <div key={period.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{period.label}</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatTime(periodTime)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(periodTime / maxPeriodTime) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">学習の傾向</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">最長連続日数</span>
                  <span className="text-gray-900 dark:text-white font-medium">{stats.longestStreak}日</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">総レベル</span>
                  <span className="text-gray-900 dark:text-white font-medium">Level {stats.currentLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">総XP</span>
                  <span className="text-gray-900 dark:text-white font-medium">{stats.totalXp} XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">平均セッション時間</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {stats.totalSessions > 0 ? formatTime(Math.round(stats.totalStudyTime / stats.totalSessions)) : '0分'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsView