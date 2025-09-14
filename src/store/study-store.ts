import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface StudySession {
  id: string
  title: string
  subject: string
  startTime: Date
  endTime: Date
  duration: number // in minutes
  notes?: string
  date: string // YYYY-MM-DD format
  xp: number // experience points earned
  level: number // current level when session was completed
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  totalXp: number
  level: number
  streak: number
  lastStudiedDate?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  requirement: {
    type: 'sessions' | 'time' | 'streak' | 'level'
    value: number
    subject?: string
  }
}

export interface StudyStats {
  totalStudyTime: number
  todayStudyTime: number
  weeklyStudyTime: number
  monthlyStudyTime: number
  totalSessions: number
  currentStreak: number
  longestStreak: number
  totalXp: number
  currentLevel: number
  categoryStats: Record<string, {
    time: number
    sessions: number
    xp: number
    level: number
    streak: number
  }>
}

interface StudyStore {
  sessions: StudySession[]
  categories: Category[]
  achievements: Achievement[]
  userLevel: number
  userXp: number
  addSession: (session: Omit<StudySession, 'id' | 'duration' | 'xp' | 'level'>) => void
  updateSession: (id: string, session: Partial<StudySession>) => void
  deleteSession: (id: string) => void
  addCategory: (category: Omit<Category, 'id' | 'totalXp' | 'level' | 'streak'>) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  getStats: () => StudyStats
  getSessionsByDate: (date: string) => StudySession[]
  unlockAchievement: (achievementId: string) => void
  calculateXp: (duration: number, subject: string) => number
}

const defaultCategories: Category[] = [
  {
    id: '1',
    name: '英語',
    color: '#3B82F6',
    icon: '🇬🇧',
    totalXp: 0,
    level: 1,
    streak: 0
  },
  {
    id: '2',
    name: '数学',
    color: '#10B981',
    icon: '📊',
    totalXp: 0,
    level: 1,
    streak: 0
  },
  {
    id: '3',
    name: 'プログラミング',
    color: '#8B5CF6',
    icon: '💻',
    totalXp: 0,
    level: 1,
    streak: 0
  },
  {
    id: '4',
    name: '資格試験',
    color: '#F59E0B',
    icon: '🏆',
    totalXp: 0,
    level: 1,
    streak: 0
  },
]

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: '初回学習',
    description: '最初の勉強セッションを完了しました',
    icon: '🎯',
    requirement: { type: 'sessions', value: 1 }
  },
  {
    id: '2',
    title: '習慣の始まり',
    description: '3日連続で勉強しました',
    icon: '🔥',
    requirement: { type: 'streak', value: 3 }
  },
  {
    id: '3',
    title: '集中力マスター',
    description: '1日で3時間勉強しました',
    icon: '⚡',
    requirement: { type: 'time', value: 180 }
  },
  {
    id: '4',
    title: 'レベルアップ！',
    description: 'レベル5に到達しました',
    icon: '⭐',
    requirement: { type: 'level', value: 5 }
  },
]

export const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      categories: defaultCategories,
      achievements: defaultAchievements,
      userLevel: 1,
      userXp: 0,

      addSession: (sessionData) => {
        const startTime = new Date(sessionData.startTime)
        const endTime = new Date(sessionData.endTime)
        const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
        const xp = get().calculateXp(duration, sessionData.subject)

        const newSession: StudySession = {
          ...sessionData,
          id: crypto.randomUUID(),
          duration,
          xp,
          level: get().userLevel,
        }

        set((state) => {
          const newSessions = [...state.sessions, newSession]
          const updatedCategories = state.categories.map(category => {
            if (category.name === sessionData.subject) {
              const newXp = category.totalXp + xp
              const newLevel = Math.floor(newXp / 100) + 1

              // Check streak
              const today = sessionData.date
              const yesterday = new Date(Date.parse(today) - 86400000).toISOString().split('T')[0]
              const newStreak = category.lastStudiedDate === yesterday ? category.streak + 1 : 1

              return {
                ...category,
                totalXp: newXp,
                level: newLevel,
                streak: newStreak,
                lastStudiedDate: today
              }
            }
            return category
          })

          // Update user XP and level
          const newUserXp = state.userXp + xp
          const newUserLevel = Math.floor(newUserXp / 500) + 1

          return {
            sessions: newSessions,
            categories: updatedCategories,
            userXp: newUserXp,
            userLevel: newUserLevel,
          }
        })
      },

      updateSession: (id, sessionData) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === id ? { ...session, ...sessionData } : session
          )
        }))
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter(session => session.id !== id)
        }))
      },

      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: crypto.randomUUID(),
          totalXp: 0,
          level: 1,
          streak: 0,
        }
        set((state) => ({
          categories: [...state.categories, newCategory]
        }))
      },

      updateCategory: (id, categoryData) => {
        set((state) => ({
          categories: state.categories.map(category =>
            category.id === id ? { ...category, ...categoryData } : category
          )
        }))
      },

      deleteCategory: (id) => {
        set((state) => {
          const categoryToDelete = state.categories.find(cat => cat.id === id)
          if (!categoryToDelete) return state

          // Remove sessions related to this category
          const filteredSessions = state.sessions.filter(
            session => session.subject !== categoryToDelete.name
          )

          return {
            categories: state.categories.filter(category => category.id !== id),
            sessions: filteredSessions
          }
        })
      },

      getStats: (): StudyStats => {
        const { sessions, categories, userXp, userLevel } = get()
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

        const totalStudyTime = sessions.reduce((total, session) => total + session.duration, 0)
        const totalSessions = sessions.length

        const todayStudyTime = sessions
          .filter(session => session.date === today)
          .reduce((total, session) => total + session.duration, 0)

        const weeklyStudyTime = sessions
          .filter(session => new Date(session.date) >= weekStart)
          .reduce((total, session) => total + session.duration, 0)

        const monthlyStudyTime = sessions
          .filter(session => new Date(session.date) >= monthStart)
          .reduce((total, session) => total + session.duration, 0)

        const categoryStats: Record<string, any> = {}
        categories.forEach(category => {
          const categorySessions = sessions.filter(s => s.subject === category.name)
          categoryStats[category.name] = {
            time: categorySessions.reduce((total, session) => total + session.duration, 0),
            sessions: categorySessions.length,
            xp: category.totalXp,
            level: category.level,
            streak: category.streak,
          }
        })

        // Calculate streaks
        const sortedDates = [...new Set(sessions.map(s => s.date))].sort()
        let currentStreak = 0
        let longestStreak = 0
        let tempStreak = 0

        for (let i = sortedDates.length - 1; i >= 0; i--) {
          const date = new Date(sortedDates[i])
          const expectedDate = new Date()
          expectedDate.setDate(expectedDate.getDate() - (sortedDates.length - 1 - i))

          if (date.toDateString() === expectedDate.toDateString()) {
            tempStreak++
            if (i === sortedDates.length - 1) currentStreak = tempStreak
          } else {
            longestStreak = Math.max(longestStreak, tempStreak)
            tempStreak = 0
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak, currentStreak)

        return {
          totalStudyTime,
          todayStudyTime,
          weeklyStudyTime,
          monthlyStudyTime,
          totalSessions,
          currentStreak,
          longestStreak,
          totalXp: userXp,
          currentLevel: userLevel,
          categoryStats,
        }
      },

      getSessionsByDate: (date) => {
        return get().sessions.filter(session => session.date === date)
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          achievements: state.achievements.map(achievement =>
            achievement.id === achievementId
              ? { ...achievement, unlockedAt: new Date() }
              : achievement
          )
        }))
      },

      calculateXp: (duration, subject) => {
        // Base XP: 1 XP per minute
        let xp = duration

        // Bonus XP for longer sessions
        if (duration >= 120) xp += 50 // 2 hours bonus
        if (duration >= 180) xp += 100 // 3 hours bonus

        // Subject multipliers could be added here

        return Math.round(xp)
      },
    }),
    {
      name: 'study-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        categories: state.categories,
        achievements: state.achievements,
        userLevel: state.userLevel,
        userXp: state.userXp,
      }),
    }
  )
)