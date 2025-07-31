<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'

const route = useRoute()
const isScrolled = ref(false)

onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }
  
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div id="app">
    <!-- 主题切换器 -->
    <ThemeSwitcher />
    
    <!-- Header inspired by Medium -->
    <header class="site-header" :class="{ scrolled: isScrolled }">
      <div class="header-container">
        <div class="header-left">
          <router-link to="/" class="site-logo">
            <h1>Volcano Blog</h1>
          </router-link>
        </div>
        
        <nav class="header-nav">
          <router-link to="/" class="nav-link" exact-active-class="active">
            Home
          </router-link>
          <router-link to="/posts" class="nav-link" active-class="active">
            Posts
          </router-link>
          <router-link to="/about" class="nav-link" active-class="active">
            About
          </router-link>
        </nav>
        
        <div class="header-right">
          <router-link to="/admin/login" class="btn btn-primary">
            Writing
          </router-link>
        </div>
      </div>
    </header>
    
    <!-- Main content area -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- Footer with Medium-style minimal design -->
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>Volcano Blog</h3>
            <p>Focus on technology sharing and thinking</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-section">
              <h4>Navigation</h4>
              <router-link to="/">Home</router-link>
              <router-link to="/posts">Posts</router-link>
              <router-link to="/about">About</router-link>
            </div>
            
            <div class="footer-section">
              <h4>Contact</h4>
              <a href="mailto:bernardyao624@gmail.com">Mail</a>
              <a href="https://github.com/bernardyao" target="_blank">GitHub</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 Volcano Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header styles - Medium inspired */
.site-header {
  position: sticky;
  top: 0;
  background: var(--volcano-bg-primary);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--volcano-border-light);
  z-index: 100;
  transition: all 0.3s ease;
}

.site-header.scrolled {
  box-shadow: var(--volcano-shadow-sm);
}

.header-container {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.site-logo {
  text-decoration: none;
}

.site-logo h1 {
  font-size: 20px;
  font-weight: 700;
  color: var(--volcano-text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.nav-link {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--volcano-text-secondary);
  font-weight: 500;
  font-size: 15px;
  transition: color 0.2s ease;
  text-decoration: none;
}

.nav-link:hover {
  color: var(--volcano-text-primary);
}

.nav-link.active {
  color: var(--volcano-text-primary);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: var(--volcano-primary);
  border-radius: 50%;
}

.header-right {
  display: flex;
  align-items: center;
}

/* Main content */
.main-content {
  flex: 1;
  min-height: calc(100vh - 64px);
}

/* Footer styles */
.site-footer {
  background: var(--volcano-bg-secondary);
  border-top: 1px solid var(--volcano-border-light);
  margin-top: auto;
}

.footer-container {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-lg) var(--spacing-lg);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-xl);
}

.footer-brand h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--volcano-text-primary);
}

.footer-brand p {
  color: var(--volcano-text-tertiary);
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: var(--spacing-3xl);
}

.footer-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--volcano-text-primary);
  margin-bottom: var(--spacing-md);
}

.footer-section a {
  display: block;
  color: var(--volcano-text-secondary);
  font-size: 14px;
  margin-bottom: var(--spacing-sm);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section a:hover {
  color: var(--volcano-primary);
}

.footer-bottom {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--volcano-border-light);
  text-align: center;
}

.footer-bottom p {
  color: var(--volcano-text-tertiary);
  font-size: 14px;
  margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-container {
    padding: 0 var(--spacing-md);
    height: 56px;
  }
  
  .site-logo h1 {
    font-size: 18px;
  }
  
  .header-nav {
    gap: var(--spacing-sm);
  }
  
  .nav-link {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 14px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
  
  .footer-links {
    gap: var(--spacing-xl);
  }
}

@media (max-width: 480px) {
  .header-nav {
    display: none;
  }
  
  .header-container {
    justify-content: space-between;
  }
}
</style>
