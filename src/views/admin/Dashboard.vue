<template>
  <div class="dashboard-page">
    <h2 class="page-title">📊 数据概览</h2>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card fruit-card">
        <div class="stat-icon">🍎</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.fruits }}</div>
          <div class="stat-label">水果种类</div>
        </div>
      </div>
      <div class="stat-card customer-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.customers }}</div>
          <div class="stat-label">顾客数量</div>
        </div>
      </div>
      <div class="stat-card order-card">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.orders }}</div>
          <div class="stat-label">订单总数</div>
        </div>
      </div>
      <div class="stat-card supplier-card">
        <div class="stat-icon">🏭</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.suppliers }}</div>
          <div class="stat-label">供应商数量</div>
        </div>
      </div>
    </div>

    <!-- 订单状态分布 -->
    <div class="card">
      <h3>订单状态分布</h3>
      <div class="status-list">
        <div v-for="item in statusStats" :key="item.label" class="status-item">
          <span class="status-label">{{ item.label }}</span>
          <div class="status-bar-wrapper">
            <div class="status-bar" :style="{ width: item.percent + '%', background: item.color }"></div>
          </div>
          <span class="status-count">{{ item.count }}单</span>
        </div>
      </div>
    </div>

    <!-- 最新订单 -->
    <div class="card">
      <h3>最新订单</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>顾客ID</th>
            <th>金额</th>
            <th>状态</th>
            <th>下单时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in latestOrders" :key="order.id">
            <td>{{ order.orderNo }}</td>
            <td>{{ order.customerId }}</td>
            <td class="amount">¥{{ order.totalAmount }}</td>
            <td>
              <span :class="['status-tag', getStatusClass(order.status)]">{{ order.status }}</span>
            </td>
            <td>{{ formatTime(order.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getFruitList } from '@/api/fruit'
import { getCustomerList } from '@/api/customer'
import { getOrderList } from '@/api/order'
import { getSupplierList } from '@/api/supplier'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: { fruits: 0, customers: 0, orders: 0, suppliers: 0 },
      orders: [],
      statusStats: []
    }
  },
  computed: {
    latestOrders() {
      // 按下单时间降序排序，取最新5条
      return [...this.orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    }
  },
  created() {
    this.loadAll()
  },
  methods: {
    async loadAll() {
      try {
        const [fruitRes, custRes, orderRes, supRes] = await Promise.all([
          getFruitList(),
          getCustomerList(),
          getOrderList(),
          getSupplierList()
        ])
        this.stats.fruits = (fruitRes.data || []).length
        this.stats.customers = (custRes.data || []).length
        this.stats.orders = (orderRes.data || []).length
        this.stats.suppliers = (supRes.data || []).length
        this.orders = orderRes.data || []
        this.calcStatusStats()
      } catch (e) {
        console.error('加载数据失败:', e)
      }
    },
    calcStatusStats() {
      const statusMap = {
        '待支付': { color: '#ef6c00', count: 0 },
        '已支付': { color: '#1565c0', count: 0 },
        '配送中': { color: '#7b1fa2', count: 0 },
        '已完成': { color: '#2e7d32', count: 0 },
        '已取消': { color: '#c62828', count: 0 }
      }
      this.orders.forEach(o => {
        if (statusMap[o.status]) statusMap[o.status].count++
      })
      const total = this.orders.length || 1
      this.statusStats = Object.entries(statusMap).map(([label, info]) => ({
        label,
        count: info.count,
        color: info.color,
        percent: (info.count / total) * 100
      }))
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
.page-title {
  margin: 0 0 24px;
  font-size: 20px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 40px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.card h3 {
  margin: 0 0 16px;
  font-size: 15px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-label {
  width: 60px;
  font-size: 13px;
  color: #555;
}

.status-bar-wrapper {
  flex: 1;
  height: 20px;
  background: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
}

.status-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s;
  min-width: 2px;
}

.status-count {
  width: 50px;
  text-align: right;
  font-size: 13px;
  color: #666;
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

.amount {
  color: #e53935;
  font-weight: bold;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 11px;
}

.status-tag.pending { background: #fff3e0; color: #ef6c00; }
.status-tag.paid { background: #e3f2fd; color: #1565c0; }
.status-tag.delivering { background: #f3e5f5; color: #7b1fa2; }
.status-tag.completed { background: #e8f5e9; color: #2e7d32; }
.status-tag.cancelled { background: #fce4ec; color: #c62828; }
</style>
