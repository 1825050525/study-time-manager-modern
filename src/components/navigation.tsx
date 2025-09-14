'use client'

import { useState } from 'react'
import {
  Calendar,
  BarChart3,
  Plus,
  Home,
  Trophy,
  Settings,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs = [
    { id: 'dashboard', label: 'ダッシュボード', icon: Home },
    { id: 'add', label: '勉強記録', icon: Plus },
    { id: 'calendar', label: 'カレンダー', icon: Calendar },
    { id: 'analytics', label: '分析', icon: BarChart3 },
    { id: 'achievements', label: '実績', icon: Trophy },
  ]

  return (
    <>
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-gray-900 font-bold text-sm">学</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                学習時間管理アプリ
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                  onClick={() => onTabChange(tab.id)}
                  size="sm"
                  className={`px-3 py-2 text-sm ${
                    activeTab === tab.id
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Settings className="w-4 h-4" />
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="px-6 py-3 space-y-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                  onClick={() => {
                    onTabChange(tab.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full justify-start ${
                    activeTab === tab.id
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 mt-3">
                <Button variant="ghost" className="w-full justify-start text-gray-600 dark:text-gray-400">
                  <Settings className="w-4 h-4 mr-2" />
                  設定
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navigation