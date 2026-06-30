<template>
  <div class="customer-manage-page">
    <div class="page-header">
      <h2>👥 顾客管理</h2>
      <button class="btn btn-primary" @click="openDialog(null)">+ 新增顾客</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>手机号</th>
            <th>性别</th>
            <th>地址</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in customers" :key="c.id">
            <td>{{ c.id }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.phone }}</td>
            <td>{{ c.gender }}</td>
            <td class="addr">{{ c.address }}</td>
            <td>{{ formatTime(c.createdAt) }}</td>
            <td>
              <button class="btn-link edit" @click="openDialog(c)">编辑</button>
              <button class="btn-link delete" @click="handleDelete(c.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="customers.length === 0" class="empty">暂无数据</div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="showDialog" class="modal-overlay" @click="closeDialog">
      <div class="modal-box" @click.stop>
        <h3>{{ isEdit ? '编辑顾客' : '新增顾客' }}</h3>
        <div class="form-group">
          <label>姓名:</label>
          <input v-model="form.name" type="text" class="form-input" placeholder="请输入姓名" />
        </div>
        <div class="form-group">
          <label>手机号:</label>
          <input v-model="form.phone" type="text" class="form-input" placeholder="请输入手机号" />
        </div>
        <div class="form-group">
          <label>性别:</label>
          <select v-model="form.gender" class="form-input">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div class="form-group">
          <label>地址:</label>
          <input v-model="form.address" type="text" class="form-input" placeholder="请输入地址" />
        </div>
        <div v-if="isEdit" class="form-group">
          <label>修改密码:</label>
          <input v-model="form.password" type="text" class="form-input" placeholder="留空则不修改密码" />
        </div>
        <div class="dialog-actions">
          <button class="btn btn-cancel" @click="closeDialog">取消</button>
          <button class="btn btn-primary" :disabled="submitting" @click="handleSubmit">
            {{ submitting ? '提交中...' : '确定' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCustomerList, addCustomer, updateCustomer, deleteCustomer, updateCustomerPassword } from '@/api/customer'

export default {
  name: 'CustomerManage',
  data() {
    return {
      customers: [],
      loading: true,
      showDialog: false,
      isEdit: false,
      editId: null,
      submitting: false,
      form: { name: '', phone: '', gender: '男', address: '', password: '' }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const res = await getCustomerList()
        this.customers = res.data || []
      } catch (e) {
        console.error('加载失败:', e)
      } finally {
        this.loading = false
      }
    },
    openDialog(customer) {
      if (customer) {
        this.isEdit = true
        this.editId = customer.id
        this.form = { ...customer }
      } else {
        this.isEdit = false
        this.editId = null
        this.form = { name: '', phone: '', gender: '男', address: '', password: '' }
      }
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
    },
    async handleSubmit() {
      if (!this.form.name || !this.form.phone) return alert('请填写姓名和手机号')
      this.submitting = true
      try {
        if (this.isEdit) {
          // 先更新基本信息
          const { password, ...basicInfo } = this.form
          await updateCustomer(this.editId, basicInfo)
          
          // 如果填写了密码，则更新密码
          if (password && password.trim()) {
            await updateCustomerPassword(this.editId, password)
          }
        } else {
          await addCustomer(this.form)
        }
        this.closeDialog()
        this.loadData()
      } catch (e) {
        alert('操作失败: ' + e.message)
      } finally {
        this.submitting = false
      }
    },
    async handleDelete(id) {
      if (!confirm('确定删除该顾客吗？')) return
      try {
        await deleteCustomer(id)
        this.loadData()
      } catch (e) {
        alert('删除失败: ' + e.message)
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
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 { margin: 0; font-size: 20px; color: #333; }

.loading, .empty { text-align: center; padding: 40px; color: #999; }

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { background: #f5f5f5; padding: 10px 12px; text-align: left; font-weight: 600; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; }
.addr { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.btn-link { background: none; border: none; cursor: pointer; font-size: 12px; margin-right: 8px; }
.btn-link.edit { color: #1890ff; }
.btn-link.delete { color: #e53935; }

.btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-primary { background: #1890ff; color: white; }
.btn-cancel { background: #f5f5f5; color: #666; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}

.modal-box {
  background: white; border-radius: 12px; padding: 24px; min-width: 400px;
}

.modal-box h3 { margin: 0 0 16px; font-size: 16px; }

.form-group { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.form-group label { min-width: 70px; font-size: 13px; color: #555; text-align: right; }
.form-input { flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; }

.dialog-actions {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0f0f0;
}
</style>
