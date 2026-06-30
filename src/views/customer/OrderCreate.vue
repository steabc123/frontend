<template>
  <div class="order-create-page">
    <h2 class="page-title">🛒 创建订单</h2>

    <!-- 步骤提示 -->
    <div class="steps">
      <div class="step active">1. 添加商品</div>
      <div class="step active">2. 确认信息</div>
      <div class="step active">3. 提交下单</div>
    </div>

    <!-- 当前用户信息 -->
    <div class="card">
      <h3>收货信息</h3>
      <div class="customer-info" v-if="currentUser">
        <span>👤 {{ currentUser.name }}</span>
        <span style="margin-left: 16px;">📱 {{ currentUser.phone }}</span>
      </div>
    </div>

    <!-- 添加商品 -->
    <div class="card">
      <h3>添加商品</h3>
      <div class="add-item-row">
        <select v-model="selectedFruitId" class="form-select">
          <option value="">-- 选择水果 --</option>
          <option v-for="f in fruits" :key="f.id" :value="f.id">
            {{ f.name }} - ¥{{ f.price }}/斤 (库存:{{ f.stockQuantity }})
          </option>
        </select>
        <input v-model.number="quantity" type="number" min="0.1" step="0.1" placeholder="数量(斤)" class="form-input qty-input" />
        <button class="btn btn-add" @click="addItem">+ 添加</button>
      </div>

      <!-- 已选商品列表 -->
      <table v-if="orderItems.length > 0" class="items-table">
        <thead>
          <tr>
            <th>水果</th>
            <th>单价</th>
            <th>数量(斤)</th>
            <th>小计</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in orderItems" :key="index">
            <td>{{ item.fruitName }}</td>
            <td>¥{{ item.unitPrice }}</td>
            <td>{{ item.quantity }}</td>
            <td class="price">¥{{ item.subtotal.toFixed(2) }}</td>
            <td><button class="btn-remove" @click="removeItem(index)">删除</button></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="total-label">合计:</td>
            <td class="total-price">¥{{ totalAmount.toFixed(2) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div v-else class="empty-items">还未添加任何商品</div>
    </div>

    <!-- 订单信息 -->
    <div class="card">
      <h3>订单信息</h3>
      <div class="form-row">
        <label>支付方式:</label>
        <select v-model="paymentMethod" class="form-select">
          <option value="">-- 请选择 --</option>
          <option value="微信支付">微信支付</option>
          <option value="支付宝">支付宝</option>
          <option value="银行卡">银行卡</option>
          <option value="现金">现金</option>
        </select>
      </div>
      <div class="form-row">
        <label>配送地址:</label>
        <input v-model="deliveryAddress" type="text" class="form-input" placeholder="请输入配送地址" />
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="submit-row">
      <button class="btn btn-submit" :disabled="submitting" @click="submitOrder">
        {{ submitting ? '提交中...' : '提交订单' }}
      </button>
    </div>

    <!-- 成功弹窗 -->
    <div v-if="showSuccess" class="modal-overlay" @click="closeSuccess">
      <div class="modal-box" @click.stop>
        <div class="success-icon">✅</div>
        <h3>下单成功！</h3>
        <p>订单已提交</p>
        <button class="btn btn-primary" @click="goToMyOrders">查看我的订单</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getFruitList } from '@/api/fruit'
import { createOrder } from '@/api/order'

export default {
  name: 'OrderCreate',
  data() {
    return {
      currentUser: null,
      fruits: [],
      selectedFruitId: '',
      quantity: 1,
      orderItems: [],
      paymentMethod: '',
      deliveryAddress: '',
      submitting: false,
      showSuccess: false
    }
  },
  computed: {
    selectedFruit() {
      return this.fruits.find(f => f.id === Number(this.selectedFruitId))
    },
    totalAmount() {
      return this.orderItems.reduce((sum, item) => sum + item.subtotal, 0)
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
    this.deliveryAddress = user.address || ''
    this.loadData()
    // 从首页跳转过来时预选水果
    if (this.$route.query.fruitId) {
      this.selectedFruitId = this.$route.query.fruitId
    }
  },
  methods: {
    async loadData() {
      try {
        const fruitRes = await getFruitList()
        this.fruits = fruitRes.data || []
      } catch (e) {
        console.error('加载数据失败:', e)
      }
    },
    addItem() {
      if (!this.selectedFruitId) return alert('请选择水果')
      if (!this.quantity || this.quantity <= 0) return alert('请输入有效数量')

      const fruit = this.selectedFruit
      const item = {
        fruitId: fruit.id,
        fruitName: fruit.name,
        unitPrice: Number(fruit.price),
        quantity: this.quantity,
        subtotal: Number(fruit.price) * this.quantity
      }
      this.orderItems.push(item)
      this.selectedFruitId = ''
      this.quantity = 1
    },
    removeItem(index) {
      this.orderItems.splice(index, 1)
    },
    async submitOrder() {
      if (!this.currentUser) return alert('请先登录')
      if (this.orderItems.length === 0) return alert('请添加商品')

      this.submitting = true
      try {
        const orderData = {
          order: {
            customerId: Number(this.currentUser.id),
            totalAmount: String(this.totalAmount.toFixed(2)),
            status: '待支付',
            paymentMethod: this.paymentMethod || null,
            deliveryAddress: this.deliveryAddress || this.currentUser.address || ''
          },
          items: this.orderItems.map(item => ({
            fruitId: item.fruitId,
            quantity: String(item.quantity),
            unitPrice: String(item.unitPrice.toFixed(2)),
            subtotal: String(item.subtotal.toFixed(2))
          }))
        }
        await createOrder(orderData)
        this.showSuccess = true
      } catch (e) {
        alert('下单失败: ' + e.message)
      } finally {
        this.submitting = false
      }
    },
    goToMyOrders() {
      this.$router.push('/my-orders')
    },
    closeSuccess() {
      this.showSuccess = false
    }
  },

}
</script>

<style scoped>
.page-title {
  margin: 0 0 20px;
  font-size: 22px;
  color: #333;
}

.steps {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
}

.step {
  flex: 1;
  text-align: center;
  padding: 10px;
  background: #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
}

.step.active {
  background: #43a047;
  color: white;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.card h3 {
  margin: 0 0 14px;
  font-size: 15px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.form-row label {
  min-width: 80px;
  font-size: 13px;
  color: #666;
}

.form-select {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
}

.qty-input {
  width: 120px;
}

.customer-info {
  background: #f1f8e9;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  color: #555;
}

.add-item-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 14px;
  font-size: 13px;
}

.items-table th {
  background: #f5f5f5;
  padding: 10px;
  text-align: left;
  font-weight: 600;
}

.items-table td {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.price {
  color: #e53935;
  font-weight: bold;
}

.total-label {
  text-align: right;
  font-weight: bold;
}

.total-price {
  color: #e53935;
  font-size: 18px;
  font-weight: bold;
}

.empty-items {
  text-align: center;
  padding: 20px;
  color: #ccc;
  font-size: 13px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.85;
}

.btn-add {
  background: #43a047;
  color: white;
  white-space: nowrap;
}

.btn-remove {
  background: none;
  border: none;
  color: #e53935;
  cursor: pointer;
  font-size: 12px;
}

.btn-submit {
  background: linear-gradient(135deg, #43a047, #66bb6a);
  color: white;
  padding: 14px 48px;
  font-size: 16px;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #43a047;
  color: white;
  margin-top: 12px;
}

.submit-row {
  text-align: center;
  margin: 20px 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-box {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  min-width: 300px;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.modal-box h3 {
  margin: 0 0 8px;
}

.modal-box p {
  color: #666;
  margin: 0 0 16px;
}
</style>
