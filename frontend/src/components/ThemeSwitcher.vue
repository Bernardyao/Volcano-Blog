<template>
  <div class="theme-switcher">
    <button @click="toggleTheme" class="theme-toggle" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
      <div class="theme-icon">
        <!-- 太阳图标 (亮色模式) -->
        <svg v-if="!isDark" class="sun-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41" stroke="currentColor" stroke-width="2"/>
        </svg>
        
        <!-- 月亮图标 (暗色模式) -->
        <svg v-else class="moon-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" fill="currentColor"/>
        </svg>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark-theme', isDark.value)
  localStorage.setItem('volcano-dark', isDark.value.toString())
}

onMounted(() => {
  const savedDark = localStorage.getItem('volcano-dark')
  if (savedDark) {
    isDark.value = savedDark === 'true'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  document.documentElement.classList.toggle('dark-theme', isDark.value)
})
</script>

<style scoped>
.theme-switcher {
  position: fixed;
  top: 10px;
  right: 20px;
  z-index: 1000;
}

.theme-toggle {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  border: 1px solid var(--volcano-border-light);
  background: var(--volcano-bg-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  outline: none;
  box-shadow: var(--volcano-shadow-sm);
  color: var(--volcano-text-primary);
}

.theme-toggle:hover {
  transform: translateY(-2px);
  box-shadow: var(--volcano-shadow-md);
  border-color: var(--volcano-primary);
  background: var(--volcano-bg-secondary);
}

.theme-toggle:active {
  transform: translateY(0);
}

.theme-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.sun-icon, .moon-icon {
  width: 20px;
  height: 20px;
  color: var(--volcano-primary);
  transition: all 0.3s ease;
}

.theme-toggle:hover .sun-icon,
.theme-toggle:hover .moon-icon {
  color: var(--volcano-primary-dark);
  transform: scale(1.1);
}

/* 图标切换动画 */
.sun-icon {
  animation: rotate 0.5s ease-in-out;
}

.moon-icon {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes rotate {
  0% {
    transform: rotate(-180deg) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-switcher {
    top: 15px;
    right: 15px;
  }
  
  .theme-toggle {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
  
  .theme-icon {
    width: 18px;
    height: 18px;
  }
  
  .sun-icon, .moon-icon {
    width: 18px;
    height: 18px;
  }
}

/* 暗色模式下的特殊样式 */
.dark-theme .theme-toggle {
  background: var(--volcano-bg-secondary);
  border-color: var(--volcano-border-medium);
}

.dark-theme .theme-toggle:hover {
  background: var(--volcano-bg-tertiary);
  border-color: var(--volcano-primary);
}
</style>