<template>
  <div class="medium-login">
    <div class="login-wrapper">
      <div class="login-header">
        <router-link to="/" class="site-logo">
          <h1>Volcano</h1>
        </router-link>
        <h2>Welcome back.</h2>
        <p>Sign in to your account</p>
      </div>
      
      <div class="login-container">
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              :disabled="loading"
              placeholder="Enter your email"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              :disabled="loading"
              placeholder="Enter your password"
              class="form-input"
            />
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button type="submit" class="sign-in-btn" :disabled="loading">
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </form>
        
        <div class="login-footer">
          <router-link to="/" class="back-home">
            ← Back to Volcano
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { blogApi } from '../../api'

const router = useRouter()

const loginForm = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // 调用真实的登录API
    const response = await blogApi.auth.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    })
    
    console.log('登录响应:', response)
    
    // 保存真实的token和用户信息
    if (response.token) {
      localStorage.setItem('admin_token', response.token)
      localStorage.setItem('admin_user', JSON.stringify(response.user))
      
      // 跳转到管理后台
      router.push('/admin')
    } else {
      error.value = '登录失败：未获取到认证token'
    }
  } catch (err: any) {
    console.error('登录失败:', err)
    
    // 更详细的错误信息
    if (err.response?.status === 401) {
      error.value = '邮箱或密码错误'
    } else if (err.response?.status === 404) {
      error.value = '用户不存在'
    } else if (err.code === 'ECONNREFUSED') {
      error.value = '无法连接到服务器，请检查后端是否运行'
    } else {
      error.value = err.response?.data?.message || err.message || '登录失败，请重试'
    }
  } finally {
    loading.value = false
  }
}

// 检查是否已登录
onMounted(() => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    router.push('/admin')
  }
})
</script>

<style scoped>
.medium-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  padding: var(--spacing-lg);
  font-family: var(--font-family);
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.site-logo {
  display: inline-block;
  text-decoration: none;
  margin-bottom: var(--spacing-lg);
}

.site-logo h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.login-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.2;
}

.login-header p {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0;
}

.login-container {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius);
  padding: var(--spacing-3xl) var(--spacing-2xl);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-input {
  height: 48px;
  padding: 0 var(--spacing-md);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--border-radius);
  font-size: 16px;
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(26, 137, 23, 0.1);
}

.form-input:disabled {
  background: var(--color-bg-tertiary);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

.error-message {
  background: #fdf2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  font-size: 14px;
  margin: calc(-1 * var(--spacing-sm)) 0 var(--spacing-sm) 0;
}

.sign-in-btn {
  height: 48px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  margin-top: var(--spacing-sm);
}

.sign-in-btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.sign-in-btn:active:not(:disabled) {
  transform: translateY(0);
}

.sign-in-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  margin-top: var(--spacing-2xl);
  text-align: center;
}

.back-home {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-home:hover {
  color: var(--color-text-primary);
}

/* Responsive design */
@media (max-width: 480px) {
  .medium-login {
    padding: var(--spacing-md);
  }
  
  .login-container {
    padding: var(--spacing-2xl) var(--spacing-lg);
  }
  
  .login-header h2 {
    font-size: 24px;
  }
  
  .site-logo h1 {
    font-size: 28px;
  }
}

@media (max-width: 360px) {
  .login-container {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}
</style>
