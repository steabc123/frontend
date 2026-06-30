<template>
  <div class="supplier-manage-page">
    <div class="page-header">
      <h2>🏭 供应商管理</h2>
      <button class="btn btn-primary" @click="openDialog(null)">+ 新增供应商</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>公司名称</th>
            <th>联系人</th>
            <th>联系电话</th>
            <th>邮箱</th>
            <th>地址</th>
            <th>合作时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in suppliers" :key="s.id">
            <td>{{ s.id }}</td>
            <td>{{ s.companyName }}</td>
            <td>{{ s.contactPerson }}</td>
            <td>{{ s.phone }}</td>
            <td>{{ s.email || '-' }}</td>
            <td class="addr">{{ s.address }}</td>
            <td>{{ formatTime(s.createdAt) }}</td>
            <td>
              <button class="btn-link edit" @click="openDialog(s)">编辑</button>
              <button class="btn-link delete" @click="handleDelete(s.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="suppliers.length === 0" class="empty">暂无数据</div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="showDialog" class="modal-overlay" @click="closeDialog">
      <div class="modal-box" @click.stop>
        <h3>{{ isEdit ? '编辑供应商' : '新增供应商' }}</h3>
        <div class="form-group">
          <label>公司名称:</label>
          <input v-model="form.companyName" type="text" class="form-input" placeholder="请输入公司名称" />
        </div>
        <div class="form-group">
          <label>联系人:</label>
          <input v-model="form.contactPerson" type="text" class="form-input" placeholder="请输入联系人" />
        </div>
        <div class="form-group">
          <label>联系电话:</label>
          <input v-model="form.phone" type="text" class="form-input" placeholder="请输入联系电话" />
        </div>
        <div class="form-group">
          <label>邮箱:</label>
          <input v-model="form.email" type="email" class="form-input" placeholder="请输入邮箱" />
        </div>
        <div class="form-group">
          <label>地址:</label>
          <input v-model="form.address" type="text" class="form-input" placeholder="请输入地址" />
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
import { getSupplierList, addSupplier, updateSupplier, deleteSupplier } from '@/api/supplier'

export default {
  name: 'SupplierManage',
  data() {
    return {
      suppliers: [],
      loading: true,
      showDialog: false,
      isEdit: false,
      editId: null,
      submitting: false,
      form: { companyName: '', contactPerson: '', phone: '', email: '', address: '' }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const res = await getSupplierList()
        this.suppliers = res.data || []
      } catch (e) {
        console.error('加载失败:', e)
      } finally {
        this.loading = false
      }
    },
    openDialog(supplier) {
      if (supplier) {
        this.isEdit = true
        this.editId = supplier.id
        this.form = { ...supplier }
      } else {
        this.isEdit = false
        this.editId = null
        this.form = { companyName: '', contactPerson: '', phone: '', email: '', address: '' }
      }
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
    },
    async handleSubmit() {
      if (!this.form.companyName || !this.form.contactPerson || !this.form.phone) {
        return alert('请填写公司名称、联系人和联系电话')
      }
      this.submitting = true
      try {
        if (this.isEdit) {
          await updateSupplier(this.editId, this.form)
        } else {
          await addSupplier(this.form)
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
      if (!confirm('确定删除该供应商吗？')) return
      try {
        await deleteSupplier(id)
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
.addr { max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

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
  background: white; border-radius: 12px; padding: 24px; min-width: 420px;
}

.modal-box h3 { margin: 0 0 16px; font-size: 16px; }

.form-group { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.form-group label { min-width: 80px; font-size: 13px; color: #555; text-align: right; }
.form-input { flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; }

.dialog-actions {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0f0f0;
}
</style>
