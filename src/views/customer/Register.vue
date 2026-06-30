<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1> 鲜果优选</h1>
        <p>用户注册</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label>用户名:</label>
          <input 
            v-model="formData.name" 
            type="text" 
            placeholder="请输入用户名（用于登录）" 
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>手机号:</label>
          <input 
            v-model="formData.phone" 
            type="tel" 
            placeholder="请输入手机号" 
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>密码:</label>
          <input 
            v-model="formData.password" 
            type="password" 
            placeholder="请设置密码（至少6位）" 
            required
            minlength="6"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>确认密码:</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="请再次输入密码" 
            required
            minlength="6"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>性别:</label>
          <select v-model="formData.gender" class="form-input">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>

        <div class="form-group">
          <label>收货地址:</label>
          <input 
            v-model="formData.address" 
            type="text" 
            placeholder="请输入收货地址" 
            required
            class="form-input"
          />
        </div>

        <button type="submit" class="btn btn-register" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>

        <div class="login-links">
          <span>已有账号？</span>
          <router-link to="/login" class="link">立即登录</router-link>
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
import { register } from '@/api/customer'

export default {
  name: 'CustomerRegister',
  data() {
    return {
      formData: {
        name: '',
        phone: '',
        password: '',
        gender: '男',
        address: ''
      },
      confirmPassword: '',
      loading: false,
      errorMsg: ''
    }
  },
  methods: {
    async handleRegister() {
      this.errorMsg = ''
      
      // 验证密码
      if (this.formData.password !== this.confirmPassword) {
        this.errorMsg = '两次输入的密码不一致'
        return
      }
      
      if (this.formData.password.length < 6) {
        this.errorMsg = '密码长度至少6位'
        return
      }

      this.loading = true
      
      try {
        await register(this.formData)
        alert('注册成功！请登录')
        this.$router.push('/login')
      } catch (e) {
        this.errorMsg = e.message || '注册失败，请稍后重试'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
  padding: 20px;
}

.register-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  font-size: 28px;
  color: #43a047;
  margin: 0 0 8px;
}

.register-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.btn-register {
  padding: 14px;
  background: linear-gradient(135deg, #43a047, #66bb6a);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;
  margin-top: 10px;
}

.btn-register:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-links {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 10px;
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
