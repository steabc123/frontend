<template>
  <div class="order-manage-page">
    <div class="page-header">
      <h2>📦 订单管理</h2>
      <div class="filter-row">
        <select v-model="filterStatus" class="form-select" @change="loadData">
          <option value="">全部状态</option>
          <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>订单号</th>
            <th>顾客ID</th>
            <th>金额</th>
            <th>状态</th>
            <th>支付方式</th>
            <th>配送地址</th>
            <th>下单时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.orderNo }}</td>
            <td>{{ order.customerId }}</td>
            <td class="amount">¥{{ order.totalAmount }}</td>
            <td>
              <span :class="['status-tag', getStatusClass(order.status)]">{{ order.status }}</span>
            </td>
            <td>{{ order.paymentMethod || '-' }}</td>
            <td class="addr">{{ order.deliveryAddress }}</td>
            <td>{{ formatTime(order.createdAt) }}</td>
            <td class="actions-cell">
              <button class="btn-link edit" @click="openStatusDialog(order)">改状态</button>
              <button class="btn-link detail" @click="viewItems(order)">明细</button>
              <button class="btn-link delete" @click="handleDelete(order.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="orders.length === 0" class="empty">暂无数据</div>
    </div>

    <!-- 修改状态弹窗 -->
    <div v-if="showStatusDialog" class="modal-overlay" @click="showStatusDialog = false">
      <div class="modal-box small" @click.stop>
        <h3>修改订单状态</h3>
        <p class="order-info">订单号: {{ currentOrder?.orderNo }}</p>
        <p class="status-hint">当前状态: <strong>{{ currentOrder?.status }}</strong></p>
        
        <!-- 状态流转提示 -->
        <div class="flow-hint">
          <p><strong>可修改为:</strong></p>
          <ul v-if="currentOrder?.status === '待支付'">
            <li>✅ 已支付 - 顾客已完成付款</li>
            <li>❌ 已取消 - 订单作废，库存恢复</li>
          </ul>
          <ul v-else-if="currentOrder?.status === '已支付'">
            <li>🚚 配送中 - 开始配送流程</li>
            <li>❌ 已取消 - 订单作废，库存恢复</li>
          </ul>
          <ul v-else-if="currentOrder?.status === '配送中'">
            <li>✅ 已完成 - 顾客确认收货</li>
            <li>❌ 已取消 - 订单作废，库存恢复</li>
          </ul>
          <ul v-else-if="currentOrder?.status === '已完成' || currentOrder?.status === '已取消'">
            <li>⚠️ 该状态不可再修改</li>
          </ul>
        </div>
        
        <div class="form-group">
          <label>新状态:</label>
          <select v-model="newStatus" class="form-input">
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="dialog-actions">
          <button class="btn btn-cancel" @click="showStatusDialog = false">取消</button>
          <button class="btn btn-primary" @click="handleUpdateStatus">确定</button>
        </div>
      </div>
    </div>

    <!-- 订单明细弹窗 -->
    <div v-if="showItemsDialog" class="modal-overlay" @click="showItemsDialog = false">
      <div class="modal-box" @click.stop>
        <h3>订单明细</h3>
        <div v-if="itemsLoading" class="loading-sm">加载中...</div>
        <table v-else-if="orderItems.length > 0" class="data-table">
          <thead>
            <tr>
              <th>水果ID</th>
              <th>单价</th>
              <th>数量(斤)</th>
              <th>小计</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orderItems" :key="item.id">
              <td>{{ item.fruitId }}</td>
              <td>¥{{ item.unitPrice }}</td>
              <td>{{ item.quantity }}</td>
              <td class="amount">¥{{ item.subtotal }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-sm">无明细数据</div>
        <div class="dialog-actions">
          <button class="btn btn-cancel" @click="showItemsDialog = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderList, getOrdersByStatus, getOrderItems, updateOrderStatus, deleteOrder } from '@/api/order'

export default {
  name: 'OrderManage',
  data() {
    return {
      orders: [],
      loading: true,
      filterStatus: '',
      statusOptions: ['待支付', '已支付', '配送中', '已完成', '已取消'],
      showStatusDialog: false,
      currentOrder: null,
      newStatus: '',
      showItemsDialog: false,
      orderItems: [],
      itemsLoading: false
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        let res
        if (this.filterStatus) {
          res = await getOrdersByStatus(this.filterStatus)
        } else {
          res = await getOrderList()
        }
        this.orders = res.data || []
      } catch (e) {
        console.error('加载失败:', e)
      } finally {
        this.loading = false
      }
    },
    openStatusDialog(order) {
      this.currentOrder = order
      this.newStatus = order.status
      this.showStatusDialog = true
    },
    async handleUpdateStatus() {
      if (!this.newStatus) return alert('请选择状态')
      if (this.newStatus === this.currentOrder.status) return alert('新状态与当前状态相同')
      try {
        await updateOrderStatus(this.currentOrder.id, this.newStatus)
        this.showStatusDialog = false
        this.loadData()
      } catch (e) {
        alert('更新失败: ' + e.message)
      }
    },
    async viewItems(order) {
      this.showItemsDialog = true
      this.itemsLoading = true
      try {
        const res = await getOrderItems(order.id)
        this.orderItems = res.data || []
      } catch (e) {
        console.error('加载明细失败:', e)
      } finally {
        this.itemsLoading = false
      }
    },
    async handleDelete(id) {
      if (!confirm('确定删除该订单吗？')) return
      try {
        await deleteOrder(id)
        this.loadData()
      } catch (e) {
        alert('删除失败: ' + e.message)
      }
    },
    getStatusClass(status) {
      const map = { '待支付': 'pending', '已支付': 'paid', '配送中': 'delivering', '已完成': 'completed', '已取消': 'cancelled' }
      return map[status] || ''
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

.filter-row { display: flex; gap: 10px; }

.form-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
}

.loading, .empty { text-align: center; padding: 40px; color: #999; }
.loading-sm, .empty-sm { text-align: center; padding: 20px; color: #999; }

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { background: #f5f5f5; padding: 10px 12px; text-align: left; font-weight: 600; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; }

.amount { color: #e53935; font-weight: bold; }
.addr { max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.actions-cell { white-space: nowrap; }

.status-tag { padding: 3px 10px; border-radius: 10px; font-size: 11px; }
.status-tag.pending { background: #fff3e0; color: #ef6c00; }
.status-tag.paid { background: #e3f2fd; color: #1565c0; }
.status-tag.delivering { background: #f3e5f5; color: #7b1fa2; }
.status-tag.completed { background: #e8f5e9; color: #2e7d32; }
.status-tag.cancelled { background: #fce4ec; color: #c62828; }

.btn-link { background: none; border: none; cursor: pointer; font-size: 12px; margin-right: 6px; }
.btn-link.edit { color: #1890ff; }
.btn-link.detail { color: #7b1fa2; }
.btn-link.delete { color: #e53935; }

.btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-primary { background: #1890ff; color: white; }
.btn-cancel { background: #f5f5f5; color: #666; }

.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}

.modal-box {
  background: white; border-radius: 12px; padding: 24px; min-width: 450px; max-height: 80vh; overflow-y: auto;
}

.modal-box.small { min-width: 360px; }

.modal-box h3 { margin: 0 0 16px; font-size: 16px; }

.order-info { font-size: 13px; color: #666; margin: 0 0 8px; }

.status-hint {
  font-size: 13px;
  color: #555;
  margin: 0 0 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.flow-hint {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  padding: 10px 12px;
  background: #fff9e6;
  border-left: 3px solid #ffa726;
  border-radius: 4px;
}

.flow-hint p {
  margin: 0 0 6px;
  font-weight: bold;
}

.flow-hint ul {
  margin: 0;
  padding-left: 18px;
}

.flow-hint li {
  margin: 4px 0;
}

.form-group { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.form-group label { min-width: 70px; font-size: 13px; color: #555; text-align: right; }
.form-input { flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; }

.dialog-actions {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0f0f0;
}
</style>
