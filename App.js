import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  Image,
  SafeAreaView,
  StatusBar,
  I18nManager
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// تفعيل دعم RTL للغة العربية
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// خدمة API
const API_BASE_URL = 'https://kkh7ikcgy6jm.manus.space/api';

const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },
  
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  }
};

// شاشة تسجيل الدخول
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      navigation.navigate('MainTabs');
    } else {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
    }
  };

  const handleGuestLogin = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.loginContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>خدّمني</Text>
          <Text style={styles.tagline}>شغلك جاي لعندك</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>تسجيل الدخول إلى حسابك</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="أدخل بريدك الإلكتروني"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>كلمة المرور</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="أدخل كلمة المرور"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>إنشاء حساب جديد</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
            <Text style={styles.guestButtonText}>تجربة التطبيق (بدون تسجيل)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// شاشة الرئيسية
function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = posts.filter(post =>
        post.title.includes(searchQuery) ||
        post.service_type.includes(searchQuery) ||
        post.city.includes(searchQuery)
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const loadPosts = async () => {
    const data = await api.get('/posts');
    setPosts(data);
    setFilteredPosts(data);
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postSalary}>{item.salary}</Text>
      </View>
      
      <Text style={styles.postService}>{item.service_type}</Text>
      <Text style={styles.postLocation}>📍 {item.city}, {item.area}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>
      
      <View style={styles.postFooter}>
        <Text style={styles.postUser}>👤 {item.user.username}</Text>
        <Text style={styles.postSchedule}>⏰ {item.work_schedule}</Text>
      </View>
      
      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactButtonText}>تواصل</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>خدّمني</Text>
        <Text style={styles.headerSubtitle}>اعثر على الخدمة المناسبة</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="ابحث عن خدمة أو مدينة..."
        />
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.jobSeekerButton]}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Text style={styles.actionButtonText}>أبحث عن عمل</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.employerButton]}>
          <Text style={styles.actionButtonText}>أبحث عن شخص للعمل</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>آخر المنشورات</Text>
      
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
      />
    </SafeAreaView>
  );
}

// شاشة إنشاء منشور
function CreatePostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [salary, setSalary] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [workSchedule, setWorkSchedule] = useState('');

  const handleSubmit = async () => {
    if (!title || !serviceType || !salary || !city || !description) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const postData = {
      title,
      service_type: serviceType,
      salary,
      city,
      area,
      description,
      work_schedule: workSchedule,
      user_id: 1 // مؤقت
    };

    const result = await api.post('/posts', postData);
    if (result) {
      Alert.alert('نجح', 'تم إنشاء المنشور بنجاح', [
        { text: 'موافق', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('خطأ', 'حدث خطأ أثناء إنشاء المنشور');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <Text style={styles.formTitle}>إنشاء منشور جديد</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>عنوان المنشور *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="مثال: كهربائي محترف - أعمال التمديدات والصيانة"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>نوع الخدمة *</Text>
          <TextInput
            style={styles.input}
            value={serviceType}
            onChangeText={setServiceType}
            placeholder="مثال: كهربائي، سباك، طباخ..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>الراتب المطلوب *</Text>
          <TextInput
            style={styles.input}
            value={salary}
            onChangeText={setSalary}
            placeholder="مثال: 1500 دينار"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>المدينة *</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="مثال: طرابلس، بنغازي، مصراتة..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>المنطقة</Text>
          <TextInput
            style={styles.input}
            value={area}
            onChangeText={setArea}
            placeholder="مثال: الدهماني، المنطقة الشرقية..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>نوع الدوام</Text>
          <TextInput
            style={styles.input}
            value={workSchedule}
            onChangeText={setWorkSchedule}
            placeholder="مثال: كامل، جزئي، مرن..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>وصف الخدمة *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="اكتب وصفاً مفصلاً عن خدماتك وخبراتك..."
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>نشر المنشور</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// شاشة الملف الشخصي
function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>أ</Text>
          </View>
          <Text style={styles.profileName}>أحمد علي</Text>
          <Text style={styles.profileType}>باحث عن عمل</Text>
        </View>

        <View style={styles.profileStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>التقييم</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>المشاريع</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>سنوات الخبرة</Text>
          </View>
        </View>

        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>نبذة عني</Text>
          <Text style={styles.profileBio}>
            كهربائي محترف مع خبرة 8 سنوات في جميع أنواع الأعمال الكهربائية
          </Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>تعديل الملف الشخصي</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// التنقل السفلي
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'الرئيسية' }}
      />
      <Tab.Screen 
        name="CreatePost" 
        component={CreatePostScreen} 
        options={{ tabBarLabel: 'إنشاء منشور' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'الملف الشخصي' }}
      />
    </Tab.Navigator>
  );
}

// التطبيق الرئيسي
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// الأنماط
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // أنماط تسجيل الدخول
  loginContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    textAlign: 'right',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  loginButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  registerButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: '#6B7280',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  guestButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  // أنماط الشاشة الرئيسية
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    textAlign: 'right',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  jobSeekerButton: {
    backgroundColor: '#10B981',
  },
  employerButton: {
    backgroundColor: '#3B82F6',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postsList: {
    paddingHorizontal: 16,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  postSalary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  postService: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 4,
  },
  postLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  postUser: {
    fontSize: 12,
    color: '#6B7280',
  },
  postSchedule: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactButton: {
    backgroundColor: '#10B981',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // أنماط إنشاء المنشور
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // أنماط الملف الشخصي
  profileContainer: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileType: {
    fontSize: 16,
    color: '#6B7280',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  profileBio: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // أنماط التنقل السفلي
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

