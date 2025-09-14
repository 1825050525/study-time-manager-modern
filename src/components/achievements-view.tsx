'use client'

import { useMemo } from 'react'
import { Trophy, Star, Target, Flame, Clock, BookOpen, Award, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useStudyStore } from '@/store/study-store'

const AchievementsView = () => {
  const { achievements, sessions, categories, getStats, unlockAchievement } = useStudyStore()
  const stats = getStats()

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`
  }

  // Check achievement progress
  const achievementProgress = useMemo(() => {
    return achievements.map(achievement => {
      let currentValue = 0
      let isUnlocked = !!achievement.unlockedAt
      let progress = 0

      switch (achievement.requirement.type) {
        case 'sessions':
          currentValue = stats.totalSessions
          break
        case 'time':
          if (achievement.requirement.subject) {
            currentValue = stats.categoryStats[achievement.requirement.subject]?.time || 0
          } else {
            currentValue = stats.todayStudyTime // For daily time achievements
          }
          break
        case 'streak':
          currentValue = stats.currentStreak
          break
        case 'level':
          currentValue = stats.currentLevel
          break
      }

      progress = Math.min((currentValue / achievement.requirement.value) * 100, 100)

      // Auto-unlock achievements if requirements are met
      if (!isUnlocked && currentValue >= achievement.requirement.value) {
        unlockAchievement(achievement.id)
        isUnlocked = true
      }

      return {
        ...achievement,
        currentValue,
        progress,
        isUnlocked
      }
    })
  }, [achievements, stats, unlockAchievement])

  // Separate unlocked and locked achievements
  const unlockedAchievements = achievementProgress.filter(a => a.isUnlocked)
  const lockedAchievements = achievementProgress.filter(a => !a.isUnlocked)

  // Additional custom achievements based on current data
  const customAchievements = [
    {
      id: 'early_bird',
      title: '早起き勉強家',
      description: '朝6時から9時の間に勉強セッションを完了',
      icon: '🌅',
      requirement: { type: 'custom', value: 1 },
      isUnlocked: sessions.some(session => {
        const hour = new Date(session.startTime).getHours()
        return hour >= 6 && hour < 9
      })
    },
    {
      id: 'night_owl',
      title: '夜型学習者',
      description: '夜21時以降に勉強セッションを完了',
      icon: '🦉',
      requirement: { type: 'custom', value: 1 },
      isUnlocked: sessions.some(session => {
        const hour = new Date(session.startTime).getHours()
        return hour >= 21
      })
    },
    {
      id: 'marathon_student',
      title: 'マラソン学習者',
      description: '一回のセッションで4時間以上勉強',
      icon: '🏃‍♂️',
      requirement: { type: 'custom', value: 1 },
      isUnlocked: sessions.some(session => session.duration >= 240)
    },
    {
      id: 'variety_seeker',
      title: '多様性の探求者',
      description: '3つ以上のカテゴリーで勉強',
      icon: '🌈',
      requirement: { type: 'custom', value: 3 },
      isUnlocked: Object.keys(stats.categoryStats).length >= 3
    }
  ]

  // Calculate overall achievement statistics
  const totalAchievements = achievementProgress.length + customAchievements.length
  const totalUnlocked = unlockedAchievements.length + customAchievements.filter(a => a.isUnlocked).length
  const completionPercentage = (totalUnlocked / totalAchievements) * 100

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          実績
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          学習の成果を実績として確認し、モチベーションを維持しましょう。
        </p>
      </div>

      {/* Achievement Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span>実績サマリー</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">達成度</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalUnlocked} / {totalAchievements}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">完了率</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {Math.round(completionPercentage)}%
                </p>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unlocked Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <span>獲得済み実績</span>
              <Badge variant="secondary">{totalUnlocked}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalUnlocked > 0 ? (
              <div className="space-y-4">
                {/* Built-in achievements */}
                {unlockedAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-lg"
                  >
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                          {new Date(achievement.unlockedAt).toLocaleDateString('ja-JP')} 獲得
                        </p>
                      )}
                    </div>
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                ))}

                {/* Custom achievements */}
                {customAchievements.filter(a => a.isUnlocked).map(achievement => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg"
                  >
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                        特別実績
                      </p>
                    </div>
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  まだ実績を獲得していません
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Locked Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gray-600" />
              <span>未達成実績</span>
              <Badge variant="outline">{totalAchievements - totalUnlocked}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalAchievements - totalUnlocked > 0 ? (
              <div className="space-y-4">
                {/* Built-in achievements */}
                {lockedAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg opacity-75"
                  >
                    <div className="text-3xl grayscale">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>進捗</span>
                          <span>
                            {achievement.requirement.type === 'time'
                              ? `${formatTime(achievement.currentValue)} / ${formatTime(achievement.requirement.value)}`
                              : `${achievement.currentValue} / ${achievement.requirement.value}`
                            }
                          </span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    </div>
                    <Lock className="w-6 h-6 text-gray-400" />
                  </div>
                ))}

                {/* Custom achievements */}
                {customAchievements.filter(a => !a.isUnlocked).map(achievement => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg opacity-75"
                  >
                    <div className="text-3xl grayscale">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        特別実績 - 隠し条件
                      </p>
                    </div>
                    <Lock className="w-6 h-6 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  すべての実績を達成しました！
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  おめでとうございます。新しい実績は継続的に追加されます。
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievement Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <span>実績獲得のヒント</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">基本的な実績</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>継続して勉強記録を追加しましょう</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Flame className="w-4 h-4" />
                  <span>毎日勉強してストリークを維持しましょう</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>長時間の勉強セッションに挑戦しましょう</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">特別な実績</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>様々な時間帯に勉強してみましょう</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>複数のカテゴリーに取り組みましょう</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>レベルアップを目指しましょう</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AchievementsView