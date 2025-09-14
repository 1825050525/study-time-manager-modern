'use client'

import { useState, useEffect } from 'react'
import {
  Clock,
  BookOpen,
  Target,
  TrendingUp,
  Flame,
  Plus,
  Calendar,
  BarChart3,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStudyStore } from '@/store/study-store'
import DailyQuote from '@/components/daily-quote'

interface DashboardProps {
  onTabChange: (tab: string) => void
}

const Dashboard = ({ onTabChange }: DashboardProps) => {
  const { getStats, categories } = useStudyStore()
  const [isClient, setIsClient] = useState(false)
  const stats = getStats()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ダッシュボード
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          今日も学習を続けましょう。進捗を確認できます。
        </p>
      </div>

      {/* Daily Quote */}
      <DailyQuote />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">今日</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isClient ? formatTime(stats.todayStudyTime) : '読み込み中...'}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">今週</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isClient ? formatTime(stats.weeklyStudyTime) : '読み込み中...'}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">連続日数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isClient ? `${stats.currentStreak}日` : '読み込み中...'}
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">合計勉強時間</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isClient ? formatTime(stats.totalStudyTime) : '読み込み中...'}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">カテゴリー別進捗</CardTitle>
            </CardHeader>
            <CardContent>
              {!isClient ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
                </div>
              ) : Object.keys(stats.categoryStats).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(stats.categoryStats).map(([categoryName, categoryStat]) => {
                    const category = categories.find(c => c.name === categoryName)
                    const progressPercentage = Math.min((categoryStat.level / 10) * 100, 100)

                    return (
                      <div key={categoryName} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{category?.icon || '📚'}</span>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {categoryName}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatTime(categoryStat.time)} • {categoryStat.sessions}回
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Level {categoryStat.level}
                            </p>
                            <p className="text-xs text-gray-500">
                              {categoryStat.streak}日連続
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: category?.color || '#6B7280',
                              width: `${progressPercentage}%`
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    勉強を始めましょう
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    最初の勉強セッションを記録して、進捗を追跡しましょう。
                  </p>
                  <Button onClick={() => onTabChange('add')}>
                    <Plus className="w-4 h-4 mr-2" />
                    勉強を開始
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">最近のアクティビティ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    アプリケーションを初期化しました
                  </span>
                </div>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  勉強記録を追加すると、ここにアクティビティが表示されます
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">クイックアクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="default"
                onClick={() => onTabChange('add')}
              >
                <Plus className="w-4 h-4 mr-2" />
                勉強記録を追加
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onTabChange('calendar')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                カレンダーを表示
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onTabChange('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                分析を表示
              </Button>
            </CardContent>
          </Card>

          {/* Study Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">今日の目標</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      学習時間
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {isClient ? `${formatTime(stats.todayStudyTime)} / 2時間` : '読み込み中...'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: isClient ? `${Math.min((stats.todayStudyTime / 120) * 100, 100)}%` : '0%' }}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  目標を設定して、毎日の学習を継続しましょう。
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">💡 学習のヒント</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>• 25分間の集中学習（ポモドーロ・テクニック）を試してみましょう</p>
                <p>• 定期的な復習で記憶を定着させます</p>
                <p>• 小さな目標を設定して達成感を味わいましょう</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard