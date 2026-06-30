<template>
  <div class="my-orders-page">
    <h2 class="page-title">📋 我的订单</h2>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 订单列表 -->
    <div v-else-if="orders.length > 0" class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-no">
            <span class="label">订单号:</span>
            <span class="value">{{ order.orderNo }}</span>
          </div>
          <span :class="['status-tag', getStatusClass(order.status)]">{{ order.status }}</span>
        </div>

        <div class="order-body">
          <div class="order-info">
            <p>💰 订单金额: <strong class="amount">¥{{ order.totalAmount }}</strong></p>
            <p v-if="order.paymentMethod">💳 支付方式: {{ order.paymentMethod }}</p>
            <p>📍 配送地址: {{ order.deliveryAddress || '未填写' }}</p>
            <p>🕐 下单时间: {{ formatTime(order.createdAt) }}</p>
          </div>
        </div>

        <div class="order-actions">
          <button class="btn btn-detail" @click="viewItems(order)">查看明细</button>
          <button
            v-if="order.status === '待支付'"
            class="btn btn-pay"
            @click="updateStatus(order.id, '已支付')"
          >
            确认支付
          </button>
          <button
            v-if="order.status === '配送中'"
            class="btn btn-receive"
            @click="updateStatus(order.id, '已完成')"
          >
            确认收货
          </button>
          <button
            v-if="order.status === '待支付'"
            class="btn btn-cancel"
            @click="updateStatus(order.id, '已取消')"
          >
            取消订单
          </button>
        </div>

        <!-- 订单明细展开 -->
        <div v-if="expandedOrder === order.id" class="order-items">
          <div v-if="itemsLoading" class="items-loading">加载中...</div>
          <table v-else-if="orderItems.length > 0" class="items-table">
            <thead>
              <tr>
                <th>水果名称</th>
                <th>单价</th>
                <th>数量(斤)</th>
                <th>小计</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderItems" :key="item.id">
                <td>{{ item.fruitName }}</td>
                <td>¥{{ item.unitPrice }}</td>
                <td>{{ item.quantity }}</td>
                <td class="price">¥{{ item.subtotal }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty">
      <p>暂无订单</p>
    </div>
  </div>
</template>

<script>
import { getOrdersByCustomerId, getOrderItems, updateOrderStatus } from '@/api/order'

export default {
  name: 'MyOrders',
  data() {
    return {
      currentUser: null,
      orders: [],
      loading: false,
      expandedOrder: null,
      orderItems: [],
      itemsLoading: false
    }
  },
  created() {
    // 检查登录状态
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!user) {
      alert('请先登录')
      this.$router.push('/login')
      return
    }
    this.currentUser = user
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      if (!this.currentUser) return
      this.loading = true
      this.expandedOrder = null
      try {
        const res = await getOrdersByCustomerId(this.currentUser.id)
        this.orders = res.data || []
      } catch (e) {
        console.error('加载订单失败:', e)
      } finally {
        this.loading = false
      }
    },
    async viewItems(order) {
      if (this.expandedOrder === order.id) {
        this.expandedOrder = null
        return
      }
      this.expandedOrder = order.id
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
    async updateStatus(orderId, status) {
      const actionText = status === '已支付' ? '确认支付' : 
                        status === '已完成' ? '确认收货' : 
                        status === '已取消' ? '取消' : '修改状态'
      if (!confirm(`确定要${actionText}该订单吗？`)) return
      try {
        await updateOrderStatus(orderId, status)
        alert('操作成功')
        this.loadOrders()
      } catch (e) {
        alert('操作失败: ' + e.message)
      }
    },
    getStatusClass(status) {
      const map = {
        '待支付': 'pending',
        '已支付': 'paid',
        '配送中': 'delivering',
        '已完成': 'completed',
        '已取消': 'cancelled'
      }
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
.page-title {
  margin: 0 0 20px;
  font-size: 22px;
  color: #333;
}

.loading, .empty {
  text-align: center;
  padding: 60px;
  color: #999;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.order-no .label {
  font-size: 12px;
  color: #999;
  margin-right: 6px;
}

.order-no .value {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.pending {
  background: #fff3e0;
  color: #ef6c00;
}

.status-tag.paid {
  background: #e3f2fd;
  color: #1565c0;
}

.status-tag.delivering {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-tag.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-tag.cancelled {
  background: #fce4ec;
  color: #c62828;
}

.order-body {
  padding: 16px 20px;
}

.order-info p {
  margin: 6px 0;
  font-size: 13px;
  color: #555;
}

.amount {
  color: #e53935;
  font-size: 16px;
}

.order-actions {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.85;
}

.btn-detail {
  background: #f5f5f5;
  color: #555;
}

.btn-pay {
  background: #43a047;
  color: white;
}

.btn-cancel {
  background: #e53935;
  color: white;
}

.btn-receive {
  background: #43a047;
  color: white;
}

.order-items {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.items-loading {
  text-align: center;
  color: #999;
  padding: 12px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.items-table th {
  background: #eee;
  padding: 8px 12px;
  text-align: left;
}

.items-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
}

.items-table .price {
  color: #e53935;
  font-weight: bold;
}
</style>
