<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="logo-icon">🍊</span>
        <span class="logo-text">管理后台</span>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item">
          <span class="nav-icon">📊</span>
          <span>仪表盘</span>
        </router-link>
        <router-link to="/admin/fruit" class="nav-item">
          <span class="nav-icon">🍎</span>
          <span>水果管理</span>
        </router-link>
        <router-link to="/admin/customer" class="nav-item">
          <span class="nav-icon">👥</span>
          <span>顾客管理</span>
        </router-link>
        <router-link to="/admin/order" class="nav-item">
          <span class="nav-icon">📦</span>
          <span>订单管理</span>
        </router-link>
        <router-link to="/admin/supplier" class="nav-item">
          <span class="nav-icon">🏭</span>
          <span>供应商管理</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <router-link to="/" class="back-link">← 返回前台</router-link>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="main-wrapper">
      <header class="admin-header">
        <h2 class="page-title">{{ $route.meta.title || '管理后台' }}</h2>
      </header>
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout'
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}

.sidebar {
  width: 220px;
  background: #001529;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header .logo-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.sidebar-header .logo-text {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: all 0.3s;
  font-size: 14px;
}

.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.08);
}

.nav-item.router-link-active {
  color: white;
  background: #1890ff;
}

.nav-icon {
  font-size: 18px;
}

.sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.back-link {
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 13px;
}

.back-link:hover {
  color: white;
}

.main-wrapper {
  flex: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: white;
  padding: 16px 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.admin-content {
  flex: 1;
  padding: 24px;
}
</style>
