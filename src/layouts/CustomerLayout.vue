<template>
  <div class="customer-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/home')">
          <span class="logo-icon">🍉</span>
          <span class="logo-text">鲜果优选</span>
        </div>
        <nav class="nav">
          <router-link to="/home" class="nav-link">
            <span>🏠</span> 首页
          </router-link>
          <router-link to="/order/create" class="nav-link">
            <span>🛒</span> 下单
          </router-link>
          <router-link to="/my-orders" class="nav-link">
            <span>📋</span> 我的订单
          </router-link>
          <router-link to="/admin" class="nav-link admin-link">
            <span>⚙️</span> 后台管理
          </router-link>
        </nav>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <p>© 2026 鲜果优选 - 新鲜水果，每日送达</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'CustomerLayout'
}
</script>

<style scoped>
.customer-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #43a047, #66bb6a);
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
}

.logo-icon {
  font-size: 28px;
}

.nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
  font-size: 14px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: bold;
}

.admin-link {
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  width: 100%;
  box-sizing: border-box;
}

.footer {
  background: #333;
  color: #aaa;
  text-align: center;
  padding: 16px;
  font-size: 13px;
}
</style>
