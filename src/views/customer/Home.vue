<template>
  <div class="home-page">
    <!-- 横幅 -->
    <div class="banner">
      <h1>🍓 新鲜水果，每日直达</h1>
      <p>精选产地直供，品质保证，新鲜到家</p>
    </div>

    <!-- 分类筛选 -->
    <div class="filter-bar">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['filter-btn', { active: selectedCategory === cat }]"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 水果卡片列表 -->
    <div v-else class="fruit-grid">
      <div
        v-for="fruit in filteredFruits"
        :key="fruit.id"
        class="fruit-card"
      >
        <div class="fruit-emoji">{{ getCategoryEmoji(fruit.category) }}</div>
        <div class="fruit-info">
          <h3 class="fruit-name">{{ fruit.name }}</h3>
          <p class="fruit-category">{{ fruit.category }}</p>
          <p class="fruit-origin">📍 {{ fruit.origin }}</p>
          <div class="fruit-bottom">
            <span class="fruit-price">¥{{ fruit.price }}<small>/斤</small></span>
            <span class="fruit-stock">库存: {{ fruit.stockQuantity }}斤</span>
          </div>
          <button class="buy-btn" @click="goToOrder(fruit)">立即购买</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && filteredFruits.length === 0" class="empty">
      <p>暂无该分类的水果</p>
    </div>
  </div>
</template>

<script>
import { getFruitList } from '@/api/fruit'

export default {
  name: 'CustomerHome',
  data() {
    return {
      fruits: [],
      loading: true,
      selectedCategory: '全部'
    }
  },
  computed: {
    categories() {
      const cats = [...new Set(this.fruits.map(f => f.category))]
      return ['全部', ...cats]
    },
    filteredFruits() {
      if (this.selectedCategory === '全部') return this.fruits
      return this.fruits.filter(f => f.category === this.selectedCategory)
    }
  },
  created() {
    this.loadFruits()
  },
  methods: {
    async loadFruits() {
      try {
        this.loading = true
        const res = await getFruitList()
        this.fruits = res.data || []
      } catch (e) {
        console.error('加载水果列表失败:', e)
      } finally {
        this.loading = false
      }
    },
    getCategoryEmoji(category) {
      const map = {
        '苹果类': '🍎',
        '热带水果': '🥭',
        '葡萄类': '🍇',
        '柑橘类': '🍊',
        '瓜类': '🍈',
        '梨类': '🍐',
        '香蕉': '🍌'
      }
      return map[category] || '🍉'
    },
    goToOrder(fruit) {
      this.$router.push({ path: '/order/create', query: { fruitId: fruit.id } })
    }
  }
}
</script>

<style scoped>
.banner {
  background: linear-gradient(135deg, #43a047, #81c784);
  color: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 24px;
}

.banner h1 {
  margin: 0 0 8px;
  font-size: 28px;
}

.banner p {
  margin: 0;
  opacity: 0.9;
  font-size: 15px;
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 18px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #43a047;
  color: #43a047;
}

.filter-btn.active {
  background: #43a047;
  color: white;
  border-color: #43a047;
}

.loading, .empty {
  text-align: center;
  padding: 60px;
  color: #999;
  font-size: 16px;
}

.fruit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.fruit-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.fruit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.fruit-emoji {
  font-size: 64px;
  text-align: center;
  padding: 24px 0 8px;
  background: #f8fdf8;
}

.fruit-info {
  padding: 16px 20px 20px;
}

.fruit-name {
  margin: 0 0 6px;
  font-size: 17px;
  color: #333;
}

.fruit-category {
  margin: 0 0 4px;
  font-size: 12px;
  color: #43a047;
  background: #e8f5e9;
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
}

.fruit-origin {
  margin: 6px 0 12px;
  font-size: 13px;
  color: #888;
}

.fruit-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.fruit-price {
  color: #e53935;
  font-size: 22px;
  font-weight: bold;
}

.fruit-price small {
  font-size: 12px;
  font-weight: normal;
  color: #999;
}

.fruit-stock {
  font-size: 12px;
  color: #999;
}

.buy-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #43a047, #66bb6a);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.buy-btn:hover {
  opacity: 0.9;
}
</style>
