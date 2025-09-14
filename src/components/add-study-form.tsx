'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, BookOpen, FileText, Plus, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useStudyStore } from '@/store/study-store'
import { toast } from 'sonner'

const AddStudyForm = () => {
  const { addSession, categories, addCategory, deleteCategory, updateCategory } = useStudyStore()
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    notes: '',
  })
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; color: string } | null>(null)
  const [selectedColors] = useState(['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#14B8A6'])
  const [selectedColor, setSelectedColor] = useState('#3B82F6')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!formData.title || !formData.subject || !formData.startTime || !formData.endTime) {
      toast.error('必須項目を入力してください')
      return
    }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`)
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`)

    if (endDateTime <= startDateTime) {
      toast.error('終了時間は開始時間より後にしてください')
      return
    }

    setIsSubmitting(true)

    try {
      addSession({
        title: formData.title,
        subject: formData.subject,
        startTime: startDateTime,
        endTime: endDateTime,
        date: formData.date,
        notes: formData.notes,
      })

      setFormData({
        title: '',
        subject: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '',
        endTime: '',
        notes: '',
      })

      toast.success('勉強記録を追加しました！')
    } catch (error) {
      toast.error('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCategory = () => {
    if (!newCategory.trim()) return

    const icons = ['📚', '🇬🇧', '📊', '💻', '🏆', '🎯', '⚡', '🔥', '🎨', '🎵', '🔬', '📝']
    const randomIcon = icons[Math.floor(Math.random() * icons.length)]

    addCategory({
      name: newCategory.trim(),
      color: selectedColor,
      icon: randomIcon,
    })

    handleInputChange('subject', newCategory.trim())
    setNewCategory('')
    setShowNewCategoryForm(false)
    setSelectedColor('#3B82F6')
    toast.success('新しいカテゴリーを追加しました')
  }

  const handleEditCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return

    updateCategory(editingCategory.id, {
      name: editingCategory.name.trim(),
      color: editingCategory.color
    })

    setEditingCategory(null)
    toast.success('カテゴリーを更新しました')
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('このカテゴリーを削除しますか？関連する勉強記録も削除されます。')) {
      deleteCategory(id)
      toast.success('カテゴリーを削除しました')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          勉強記録を追加
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          勉強セッションの詳細を記録して、進捗を追跡しましょう。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>新しいセッション</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>勉強内容 <span className="text-red-500">*</span></span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="例: 英単語暗記、数学の問題集"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>カテゴリー <span className="text-red-500">*</span></span>
              </Label>
              <div className="flex gap-2">
                <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="カテゴリーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                >
                  新規追加
                </Button>
              </div>

              {/* New Category Form */}
              {showNewCategoryForm && (
                <div className="space-y-3 mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">カテゴリー名</Label>
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="新しいカテゴリー名"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">カテゴリー色</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColor === color
                              ? 'border-gray-800 dark:border-gray-200 scale-110'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" onClick={handleAddCategory} className="flex-1">
                      追加
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewCategoryForm(false)}
                    >
                      キャンセル
                    </Button>
                  </div>
                </div>
              )}

              {/* Existing Categories List with Delete Option */}
              {categories.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    登録済みカテゴリー
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <div
                        key={category.id}
                        className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1 text-sm"
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="mr-2">{category.icon}</span>
                        <span className="text-gray-900 dark:text-gray-100">{category.name}</span>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCategory({ id: category.id, name: category.name, color: category.color })}
                              className="ml-1 h-auto p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>カテゴリーを編集</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">カテゴリー名</Label>
                                <Input
                                  value={editingCategory?.name || ''}
                                  onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                                  placeholder="カテゴリー名"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium mb-2 block">カテゴリー色</Label>
                                <div className="flex flex-wrap gap-2">
                                  {selectedColors.map(color => (
                                    <button
                                      key={color}
                                      type="button"
                                      onClick={() => setEditingCategory(prev => prev ? { ...prev, color } : null)}
                                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        editingCategory?.color === color
                                          ? 'border-gray-800 dark:border-gray-200 scale-110'
                                          : 'border-gray-300 dark:border-gray-600'
                                      }`}
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  ))}
                                </div>
                              </div>
                              <Button onClick={handleEditCategory} className="w-full">
                                更新
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="ml-1 h-auto p-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>日付 <span className="text-red-500">*</span></span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>開始時間 <span className="text-red-500">*</span></span>
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>終了時間 <span className="text-red-500">*</span></span>
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>メモ（任意）</span>
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="勉強内容の詳細、感想など..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? '追加中...' : '勉強記録を追加'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Study Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">💡 勉強のコツ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>• <strong>集中できる時間帯</strong>を見つけて、その時間に重要な科目を勉強しましょう</p>
            <p>• <strong>25分勉強 + 5分休憩</strong>のポモドーロ・テクニックを試してみてください</p>
            <p>• 勉強後は<strong>振り返りメモ</strong>を書いて、学習内容を整理しましょう</p>
            <p>• 継続は力なり！<strong>毎日少しずつ</strong>でも続けることが大切です</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddStudyForm