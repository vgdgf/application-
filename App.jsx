import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Search, MessageCircle, Star, MapPin, Clock, User, Plus, Home, Heart, Bell } from 'lucide-react'
import './App.css'

// خدمة API
const API_BASE_URL = 'https://kkh7ikcgy6jm.manus.space/api'

const api = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    return response.json()
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },
  
  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }
}

// مكون الشاشة الرئيسية
function MainScreen({ onNavigate, currentUser }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await api.get('/posts')
      setPosts(data.slice(0, 3)) // عرض آخر 3 منشورات
    } catch (error) {
      console.error('خطأ في تحميل المنشورات:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* الهيدر */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">خدّمني</h1>
        <p className="text-green-100">شغلك جاي لعندك</p>
      </div>

      {/* الأزرار الرئيسية */}
      <div className="p-6 space-y-4">
        <Button 
          onClick={() => onNavigate('browse')}
          className="w-full h-16 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          أبحث عن شخص للعمل
        </Button>
        <Button 
          onClick={() => onNavigate('create-post')}
          variant="outline"
          className="w-full h-16 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          أبحث عن عمل
        </Button>
      </div>

      {/* آخر المنشورات */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">آخر المنشورات</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{post.user?.username} - {post.service_type}</h4>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="w-4 h-4 ml-1" />
                        {post.city}
                        <Clock className="w-4 h-4 mr-2 ml-1" />
                        منذ ساعتين
                      </p>
                    </div>
                    <Badge variant="secondary">{post.work_schedule}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* شريط التنقل السفلي */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex-col h-auto p-2 text-green-600">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">الرئيسية</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto p-2" onClick={() => onNavigate('browse')}>
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs">البحث</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto p-2" onClick={() => onNavigate('chat')}>
            <MessageCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">الرسائل</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto p-2" onClick={() => onNavigate('profile')}>
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">الملف الشخصي</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

// مكون تسجيل الدخول
function LoginScreen({ onLogin, onNavigate }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await api.post('/users/login', formData)
      if (result.success) {
        onLogin(result.user)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">خدّمني</CardTitle>
          <CardDescription>تسجيل الدخول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
            <div className="text-center">
              <Button variant="link" onClick={() => onNavigate('register')}>
                إنشاء حساب جديد
              </Button>
            </div>
            <div className="text-center">
              <Button variant="link" onClick={() => onNavigate('demo')}>
                تجربة التطبيق (بدون تسجيل)
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// مكون عرض المنشورات
function BrowseScreen({ onNavigate, currentUser }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    city: '',
    service_type: '',
    work_schedule: ''
  })

  useEffect(() => {
    loadPosts()
  }, [filters])

  const loadPosts = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (filters.city) queryParams.append('city', filters.city)
      if (filters.service_type) queryParams.append('service_type', filters.service_type)
      if (filters.work_schedule) queryParams.append('work_schedule', filters.work_schedule)
      
      const data = await api.get(`/posts?${queryParams}`)
      setPosts(data)
    } catch (error) {
      console.error('خطأ في تحميل المنشورات:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الهيدر */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => onNavigate('main')}>
            ←
          </Button>
          <h2 className="text-xl font-semibold">البحث عن عمال</h2>
          <div></div>
        </div>
        
        {/* شريط البحث */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ابحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        {/* أزرار الفلترة */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="المدينة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع المدن</SelectItem>
              <SelectItem value="طرابلس">طرابلس</SelectItem>
              <SelectItem value="بنغازي">بنغازي</SelectItem>
              <SelectItem value="مصراتة">مصراتة</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.service_type} onValueChange={(value) => setFilters({...filters, service_type: value})}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="نوع العمل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الأعمال</SelectItem>
              <SelectItem value="كهربائي">كهربائي</SelectItem>
              <SelectItem value="طباخة">طباخة</SelectItem>
              <SelectItem value="بحار">بحار</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* قائمة المنشورات */}
      <div className="p-4 pb-20">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <Avatar>
                        <AvatarFallback>{post.user?.username?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{post.user?.username}</h4>
                        <p className="text-sm text-gray-600">{post.service_type}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4 ml-1" />
                          <span>{post.city}</span>
                          {post.salary && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{post.salary}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 mr-1">
                            {post.user?.average_rating?.toFixed(1) || '0.0'} ({post.user?.total_ratings || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => onNavigate('chat')}>
                      تواصل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// مكون إنشاء منشور
function CreatePostScreen({ onNavigate, currentUser }) {
  const [formData, setFormData] = useState({
    title: '',
    service_type: '',
    salary: '',
    work_schedule: '',
    city: '',
    area: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/posts', {
        ...formData,
        user_id: currentUser?.id || 1 // استخدام مستخدم تجريبي
      })
      onNavigate('main')
    } catch (error) {
      console.error('خطأ في إنشاء المنشور:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => onNavigate('main')}>
            ←
          </Button>
          <h2 className="text-xl font-semibold">إنشاء منشور</h2>
          <div></div>
        </div>
      </div>

      <div className="p-4 pb-20">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان المنشور</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="مثال: كهربائي محترف - أعمال التمديدات والصيانة"
                  required
                />
              </div>

              <div>
                <Label htmlFor="service_type">نوع الخدمة</Label>
                <Select value={formData.service_type} onValueChange={(value) => setFormData({...formData, service_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="كهربائي">كهربائي</SelectItem>
                    <SelectItem value="سباك">سباك</SelectItem>
                    <SelectItem value="طباخ">طباخ</SelectItem>
                    <SelectItem value="طباخة">طباخة</SelectItem>
                    <SelectItem value="سائق">سائق</SelectItem>
                    <SelectItem value="مصمم">مصمم</SelectItem>
                    <SelectItem value="بحار">بحار</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salary">الراتب المطلوب</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  placeholder="مثال: 1500 دينار"
                />
              </div>

              <div>
                <Label htmlFor="work_schedule">نوع الدوام</Label>
                <Select value={formData.work_schedule} onValueChange={(value) => setFormData({...formData, work_schedule: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الدوام" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="كامل">كامل</SelectItem>
                    <SelectItem value="جزئي">جزئي</SelectItem>
                    <SelectItem value="مرن">مرن</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">المدينة</Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({...formData, city: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="طرابلس">طرابلس</SelectItem>
                    <SelectItem value="بنغازي">بنغازي</SelectItem>
                    <SelectItem value="مصراتة">مصراتة</SelectItem>
                    <SelectItem value="الزاوية">الزاوية</SelectItem>
                    <SelectItem value="صبراتة">صبراتة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="area">المنطقة</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder="مثال: الدهماني، المنطقة الشرقية"
                />
              </div>

              <div>
                <Label htmlFor="description">وصف تفصيلي للخدمة</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="اكتب وصفاً تفصيلياً عن خدماتك وخبراتك..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'جاري النشر...' : 'نشر'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// التطبيق الرئيسي
function App() {
  const [currentScreen, setCurrentScreen] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)

  const handleLogin = (user) => {
    setCurrentUser(user)
    setCurrentScreen('main')
  }

  const handleNavigate = (screen) => {
    setCurrentScreen(screen)
  }

  const handleDemo = () => {
    setCurrentUser({ id: 1, username: 'مستخدم تجريبي', email: 'demo@example.com' })
    setCurrentScreen('main')
  }

  return (
    <div className="app-container">
      {currentScreen === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          onNavigate={handleNavigate}
        />
      )}
      {currentScreen === 'demo' && (
        <div>
          {handleDemo()}
        </div>
      )}
      {currentScreen === 'main' && (
        <MainScreen 
          onNavigate={handleNavigate}
          currentUser={currentUser}
        />
      )}
      {currentScreen === 'browse' && (
        <BrowseScreen 
          onNavigate={handleNavigate}
          currentUser={currentUser}
        />
      )}
      {currentScreen === 'create-post' && (
        <CreatePostScreen 
          onNavigate={handleNavigate}
          currentUser={currentUser}
        />
      )}
      {currentScreen === 'chat' && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">الدردشة</h3>
              <p className="text-gray-600 mb-4">ميزة الدردشة قيد التطوير</p>
              <Button onClick={() => handleNavigate('main')}>العودة للرئيسية</Button>
            </CardContent>
          </Card>
        </div>
      )}
      {currentScreen === 'profile' && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card>
            <CardContent className="p-6 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">الملف الشخصي</h3>
              <p className="text-gray-600 mb-4">ميزة الملف الشخصي قيد التطوير</p>
              <Button onClick={() => handleNavigate('main')}>العودة للرئيسية</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default App

