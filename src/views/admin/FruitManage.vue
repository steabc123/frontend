<template>
  <div class="fruit-manage-page">
    <div class="page-header">
      <h2>🍎 水果管理</h2>
      <button class="btn btn-primary" @click="openDialog(null)">+ 新增水果</button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>分类</th>
            <th>单价(元/斤)</th>
            <th>库存(斤)</th>
            <th>供应商</th>
            <th>产地</th>
            <th>保质期(天)</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fruit in fruits" :key="fruit.id">
            <td>{{ fruit.id }}</td>
            <td>{{ fruit.name }}</td>
            <td><span class="tag">{{ fruit.category }}</span></td>
            <td class="price">¥{{ fruit.price }}</td>
            <td>{{ fruit.stockQuantity }}</td>
            <td>{{ getSupplierName(fruit.supplierId) }}</td>
            <td>{{ fruit.origin }}</td>
            <td>{{ fruit.shelfLifeDays }}</td>
            <td>
              <button class="btn-link edit" @click="openDialog(fruit)">编辑</button>
              <button class="btn-link delete" @click="handleDelete(fruit.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="fruits.length === 0" class="empty">暂无数据</div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="showDialog" class="modal-overlay" @click="closeDialog">
      <div class="modal-box" @click.stop>
        <h3>{{ isEdit ? '编辑水果' : '新增水果' }}</h3>
        <div class="form-group">
          <label>名称:</label>
          <input v-model="form.name" type="text" class="form-input" placeholder="如: 红富士苹果" />
        </div>
        <div class="form-group">
          <label>分类:</label>
          <input v-model="form.category" type="text" class="form-input" placeholder="如: 苹果类" />
        </div>
        <div class="form-group">
          <label>单价(元/斤):</label>
          <input v-model.number="form.price" type="number" step="0.01" class="form-input" />
        </div>
        <div class="form-group">
          <label>库存(斤):</label>
          <input v-model.number="form.stockQuantity" type="number" class="form-input" />
        </div>
        <div class="form-group">
          <label>供应商:</label>
          <select v-model.number="form.supplierId" class="form-input">
            <option :value="null">请选择供应商</option>
            <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.companyName }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>产地:</label>
          <input v-model="form.origin" type="text" class="form-input" placeholder="如: 山东烟台" />
        </div>
        <div class="form-group">
          <label>保质期(天):</label>
          <input v-model.number="form.shelfLifeDays" type="number" class="form-input" />
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
import { getFruitList, addFruit, updateFruit, deleteFruit } from '@/api/fruit'
import { getSupplierList } from '@/api/supplier'

export default {
  name: 'FruitManage',
  data() {
    return {
      fruits: [],
      suppliers: [],
      loading: true,
      showDialog: false,
      isEdit: false,
      editId: null,
      submitting: false,
      form: { name: '', category: '', price: '', stockQuantity: '', supplierId: '', origin: '', shelfLifeDays: '' }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const [fruitRes, supplierRes] = await Promise.all([
          getFruitList().catch(e => { console.error('加载水果失败:', e); return null }),
          getSupplierList().catch(e => { console.error('加载供应商失败:', e); return null })
        ])
        this.fruits = (fruitRes && fruitRes.data) || []
        this.suppliers = (supplierRes && supplierRes.data) || []
      } catch (e) {
        console.error('加载失败:', e)
      } finally {
        this.loading = false
      }
    },
    getSupplierName(supplierId) {
      if (supplierId === null || supplierId === undefined || supplierId === '') return '-'
      const s = this.suppliers.find(item => item.id == supplierId)
      return s ? s.companyName : '-'
    },
    openDialog(fruit) {
      if (fruit) {
        this.isEdit = true
        this.editId = fruit.id
        this.form = { ...fruit }
      } else {
        this.isEdit = false
        this.editId = null
        this.form = { name: '', category: '', price: '', stockQuantity: '', supplierId: '', origin: '', shelfLifeDays: '' }
      }
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
    },
    async handleSubmit() {
      if (!this.form.name || !this.form.category) return alert('请填写必填项')
      this.submitting = true
      try {
        if (this.isEdit) {
          await updateFruit(this.editId, this.form)
        } else {
          await addFruit(this.form)
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
      if (!confirm('确定删除该水果吗？')) return
      try {
        await deleteFruit(id)
        this.loadData()
      } catch (e) {
        alert('删除失败: ' + e.message)
      }
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

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #999;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  background: #f5f5f5;
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
}

.data-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.price { color: #e53935; font-weight: bold; }
.tag { background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 10px; font-size: 12px; }

.btn-link {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;
}

.btn-link.edit { color: #1890ff; }
.btn-link.delete { color: #e53935; }

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.btn-primary { background: #1890ff; color: white; }
.btn-cancel { background: #f5f5f5; color: #666; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-box {
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-box h3 {
  margin: 0 0 16px;
  font-size: 16px;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.form-group label {
  min-width: 90px;
  font-size: 13px;
  color: #555;
  text-align: right;
}

.form-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
