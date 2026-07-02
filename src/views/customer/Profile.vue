<template>
  <div class="profile-page">
    <h2 class="page-title">👤 个人中心</h2>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <template v-else>
      <!-- 订单统计卡片 -->
      <div class="stats-card">
        <h3 class="card-title">📊 订单概览</h3>
        <div class="stats-grid">
          <div class="stat-item" @click="$router.push('/my-orders')">
            <div class="stat-number total">{{ orderStats.total || 0 }}</div>
            <div class="stat-label">全部订单</div>
          </div>
          <div class="stat-item">
            <div class="stat-number pending">{{ orderStats['待支付'] || 0 }}</div>
            <div class="stat-label">待支付</div>
          </div>
          <div class="stat-item">
            <div class="stat-number paid">{{ orderStats['已支付'] || 0 }}</div>
            <div class="stat-label">已支付</div>
          </div>
          <div class="stat-item">
            <div class="stat-number delivering">{{ orderStats['配送中'] || 0 }}</div>
            <div class="stat-label">配送中</div>
          </div>
          <div class="stat-item">
            <div class="stat-number completed">{{ orderStats['已完成'] || 0 }}</div>
            <div class="stat-label">已完成</div>
          </div>
          <div class="stat-item">
            <div class="stat-number cancelled">{{ orderStats['已取消'] || 0 }}</div>
            <div class="stat-label">已取消</div>
          </div>
        </div>
      </div>

      <!-- 个人信息卡片 -->
      <div class="info-card">
        <div class="card-header">
          <h3 class="card-title">📝 个人信息</h3>
          <button v-if="!editing" class="btn btn-edit" @click="startEdit">✏️ 编辑</button>
          <template v-else>
            <button class="btn btn-save" @click="saveProfile">💾 保存</button>
            <button class="btn btn-cancel-edit" @click="cancelEdit">取消</button>
          </template>
        </div>

        <div class="info-grid">
          <!-- 只读模式 -->
          <template v-if="!editing">
            <div class="info-item">
              <span class="info-label">👤 用户名</span>
              <span class="info-value">{{ customer.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📱 手机号</span>
              <span class="info-value">{{ customer.phone || '未填写' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">⚧ 性别</span>
              <span class="info-value">{{ customer.gender || '未填写' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📍 地址</span>
              <span class="info-value">{{ customer.address || '未填写' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🕐 注册时间</span>
              <span class="info-value">{{ formatTime(customer.createdAt) }}</span>
            </div>
          </template>

          <!-- 编辑模式 -->
          <template v-else>
            <div class="info-item">
              <span class="info-label">👤 用户名</span>
              <input v-model="editForm.name" class="input" placeholder="请输入用户名" />
            </div>
            <div class="info-item">
              <span class="info-label">📱 手机号</span>
              <input v-model="editForm.phone" class="input" placeholder="请输入手机号" />
            </div>
            <div class="info-item">
              <span class="info-label">⚧ 性别</span>
              <select v-model="editForm.gender" class="input">
                <option value="">请选择</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="info-item">
              <span class="info-label">📍 地址</span>
              <input v-model="editForm.address" class="input" placeholder="请输入地址" />
            </div>
          </template>
        </div>
      </div>

      <!-- 修改密码卡片 -->
      <div class="info-card">
        <h3 class="card-title">🔒 修改密码</h3>
        <div class="password-form">
          <div class="form-row">
            <label class="form-label">旧密码</label>
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              class="input"
              placeholder="请输入旧密码"
            />
          </div>
          <div class="form-row">
            <label class="form-label">新密码</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="input"
              placeholder="请输入新密码（至少6位）"
            />
          </div>
          <div class="form-row">
            <label class="form-label">确认新密码</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="input"
              placeholder="请再次输入新密码"
            />
          </div>
          <button class="btn btn-password" @click="changePassword" :disabled="changingPassword">
            {{ changingPassword ? '提交中...' : '修改密码' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getCustomerById, updateCustomer, updateCustomerPassword } from '@/api/customer'
import { getOrderStats } from '@/api/order'

export default {
  name: 'CustomerProfile',
  data() {
    return {
      currentUser: null,
      customer: {},
      loading: false,
      editing: false,
      editForm: { name: '', phone: '', gender: '', address: '' },
      orderStats: {},
      passwordForm: { oldPassword: '', newPassword: '', confirmPassword: '' },
      changingPassword: false
    }
  },
  created() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user) {
      alert('请先登录')
      this.$router.push('/login')
      return
    }
    this.currentUser = user
    this.loadCustomer()
    this.loadOrderStats()
  },
  methods: {
    async loadCustomer() {
      this.loading = true
      try {
        const res = await getCustomerById(this.currentUser.id)
        this.customer = res.data || {}
      } catch (e) {
        console.error('加载个人信息失败:', e)
      } finally {
        this.loading = false
      }
    },
    async loadOrderStats() {
      try {
        const res = await getOrderStats(this.currentUser.id)
        this.orderStats = res.data || {}
      } catch (e) {
        console.error('加载订单统计失败:', e)
      }
    },
    startEdit() {
      this.editForm = {
        name: this.customer.name || '',
        phone: this.customer.phone || '',
        gender: this.customer.gender || '',
        address: this.customer.address || ''
      }
      this.editing = true
    },
    cancelEdit() {
      this.editing = false
    },
    async saveProfile() {
      if (!this.editForm.name || !this.editForm.name.trim()) {
        return alert('用户名不能为空')
      }
      try {
        const data = {
          ...this.customer,
          name: this.editForm.name.trim(),
          phone: this.editForm.phone.trim(),
          gender: this.editForm.gender,
          address: this.editForm.address.trim()
        }
        await updateCustomer(this.currentUser.id, data)
        alert('个人信息更新成功')
        // 更新 localStorage 中的用户名
        const stored = JSON.parse(localStorage.getItem('currentUser') || '{}')
        stored.name = data.name
        localStorage.setItem('currentUser', JSON.stringify(stored))
        this.editing = false
        this.loadCustomer()
      } catch (e) {
        alert('更新失败: ' + (e.response?.data?.message || e.message))
      }
    },
    async changePassword() {
      const { oldPassword, newPassword, confirmPassword } = this.passwordForm
      if (!oldPassword) return alert('请输入旧密码')
      if (!newPassword || newPassword.length < 6) return alert('新密码至少6位')
      if (newPassword !== confirmPassword) return alert('两次输入的密码不一致')

      this.changingPassword = true
      try {
        await updateCustomerPassword(this.currentUser.id, {
          oldPassword,
          newPassword
        })
        alert('密码修改成功，请重新登录')
        localStorage.removeItem('currentUser')
        this.$router.push('/login')
      } catch (e) {
        const msg = e.response?.data?.message || e.message || '修改失败'
        alert('密码修改失败: ' + msg)
      } finally {
        this.changingPassword = false
      }
    },
    formatTime(time) {
      if (!time) return '-'
      return new Date(time).toLocaleString('zh-CN')
    }
  }
}
</script>

<style scoped>
.page-title {
  margin: 0 0 20px;
  font-size: 22px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #999;
}

/* 统计卡片 */
.stats-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.stat-item {
  text-align: center;
  padding: 16px 8px;
  border-radius: 8px;
  background: #f9f9f9;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-number.total { color: #333; }
.stat-number.pending { color: #ef6c00; }
.stat-number.paid { color: #1565c0; }
.stat-number.delivering { color: #7b1fa2; }
.stat-number.completed { color: #2e7d32; }
.stat-number.cancelled { color: #c62828; }

.stat-label {
  font-size: 12px;
  color: #888;
}

/* 信息卡片 */
.info-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  margin: 0 0 16px;
  font-size: 16px;
  color: #333;
}

.card-header .card-title {
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 12px;
  color: #888;
}

.info-value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

/* 输入框 */
.input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.input:focus {
  border-color: #43a047;
}

/* 按钮 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.85;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-edit {
  background: #e3f2fd;
  color: #1565c0;
}

.btn-save {
  background: #43a047;
  color: white;
}

.btn-cancel-edit {
  background: #f5f5f5;
  color: #666;
  margin-left: 8px;
}

.btn-password {
  background: #43a047;
  color: white;
  padding: 10px 24px;
  font-size: 14px;
  margin-top: 8px;
}

/* 密码表单 */
.password-form {
  max-width: 400px;
}

.form-row {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
