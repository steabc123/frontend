<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>🍉 鲜果优选</h1>
        <p>用户登录</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>用户名:</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="请输入用户名（如：张三）" 
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>密码:</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="请输入密码" 
            required
            class="form-input"
          />
        </div>

        <button type="submit" class="btn btn-login" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <div class="login-links">
          <span>还没有账号？</span>
          <router-link to="/register" class="link">立即注册</router-link>
        </div>

        <div class="admin-hint">
          <small>管理员请使用 root账号 登录</small>
        </div>
      </form>

      <!-- 错误提示 -->
      <div v-if="errorMsg" class="error-msg">
         {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/customer'

export default {
  name: 'CustomerLogin',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      errorMsg: ''
    }
  },
  methods: {
    async handleLogin() {
      this.errorMsg = ''
      this.loading = true
      
      try {
        const res = await login({
          name: this.username,
          password: this.password
        })
        
        // 保存用户信息到 localStorage
        const user = res.data
        localStorage.setItem('currentUser', JSON.stringify(user))
        
        // 根据角色跳转
        if (user.role === 'admin') {
          this.$router.push('/admin/dashboard')
        } else {
          this.$router.push('/home')
        }
        
        alert('登录成功！')
      } catch (e) {
        this.errorMsg = e.message || '登录失败，请检查用户名和密码'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 28px;
  color: #43a047;
  margin: 0 0 8px;
}

.login-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #43a047;
}

.btn-login {
  padding: 14px;
  background: linear-gradient(135deg, #43a047, #66bb6a);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-login:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-links {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.link {
  color: #43a047;
  text-decoration: none;
  font-weight: bold;
  margin-left: 4px;
}

.link:hover {
  text-decoration: underline;
}

.admin-hint {
  text-align: center;
  margin-top: 10px;
}

.admin-hint small {
  color: #999;
  font-size: 12px;
}

.error-msg {
  margin-top: 20px;
  padding: 12px;
  background: #ffebee;
  color: #c62828;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}
</style>
