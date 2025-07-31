<template>
  <div class="post-list">
    <div class="container">
      <!-- Page header -->
      <header class="page-header">
        <h1>All Posts</h1>
        <p>Explore the world of technology and thinking</p>
      </header>

      <!-- Filters and controls -->
      <div class="controls">
        <div class="filters">
          <select v-model="selectedCategory" @change="fetchPosts" class="filter-select">
            <option value="">All Categories</option>
            <option 
              v-for="category in categories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="view-options">
          <span class="results-count" v-if="!loading">
            Total {{ totalPosts }} posts
          </span>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading">
        Loading...
      </div>
      
      <!-- Empty state -->
      <div v-else-if="!posts || posts.length === 0" class="empty-state">
        <h3>No posts yet</h3>
        <p>No posts yet, try adjusting the filter conditions.</p>
      </div>
      
      <!-- Posts list -->
      <div v-else class="posts">
        <article 
          v-for="post in posts" 
          :key="post.id" 
          class="post-item"
          @click="navigateToPost(post.id)"
        >
          <div class="post-content">
            <div class="post-meta">
              <img 
                class="author-avatar" 
                :src="`https://ui-avatars.com/api/?name=${typeof post.author === 'string' ? post.author : post.author?.name || '未知'}&size=32&background=1a8917&color=fff`"
                :alt="typeof post.author === 'string' ? post.author : post.author?.name || '未知作者'"
              >
              <div class="meta-info">
                <span class="author">{{ typeof post.author === 'string' ? post.author : post.author?.name || '未知作者' }}</span>
                <div class="meta-details">
                  <time class="date">{{ formatDate(post.createdAt) }}</time>
                  <span class="separator">·</span>
                  <span class="read-time">{{ estimateReadTime(post.content) }} minutes read</span>
                </div>
              </div>
            </div>
            
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-excerpt">{{ getExcerpt(post.content) }}</p>
            
            <div class="post-footer">
              <div class="post-categories">
                <span 
                  v-for="category in (post.categories || [])" 
                  :key="category.id" 
                  class="category-badge"
                  @click.stop="filterByCategory(category.id)"
                >
                  {{ category.name }}
                </span>
              </div>
              
              <div class="post-tags">
                <span 
                  v-for="tag in (post.tags || []).slice(0, 3)" 
                  :key="typeof tag === 'string' ? tag : tag.id" 
                  class="tag"
                >
                  {{ typeof tag === 'string' ? tag : tag.name }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="pagination" aria-label="文章分页">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="page-btn prev"
          aria-label="Previous page"
        >
          ← Previous page
        </button>
        
        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="['page-number', { active: page === currentPage }]"
            :aria-label="`Page ${page}`"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="page-btn next"
          aria-label="Next page"
        >
          Next page →
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { blogApi, type Post, type Category } from '../api'

const router = useRouter()
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalPosts = ref(0)

const totalPages = computed(() => Math.ceil(totalPosts.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const fetchPosts = async () => {
  try {
    loading.value = true
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value,
      published: true
    }
    
    if (selectedCategory.value) {
      params.categoryId = selectedCategory.value
    }
    
    const result = await blogApi.posts.getAll(params)
    posts.value = result.posts || []
    totalPosts.value = result.total || 0
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    posts.value = []
    totalPosts.value = 0
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    categories.value = await blogApi.categories.getAll()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = []
  }
}

const getExcerpt = (content: string) => {
  const plainText = content
    .replace(/[#*`\[\]]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  
  return plainText.length > 160 ? plainText.substring(0, 160) + '...' : plainText
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

const estimateReadTime = (content: string) => {
  const wordsPerMinute = 200
  const wordCount = content.length / 2
  return Math.max(1, Math.round(wordCount / wordsPerMinute))
}

const filterByCategory = (categoryId: number) => {
  selectedCategory.value = categoryId.toString()
  currentPage.value = 1
  fetchPosts()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const navigateToPost = (postId: number) => {
  router.push(`/post/${postId}`)
}

// Watch for page changes
watch(currentPage, fetchPosts)

onMounted(() => {
  fetchPosts()
  fetchCategories()
})
</script>

<style scoped>
.post-list {
  background: var(--color-bg-primary);
  min-height: 100vh;
}

.container {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-lg);
}

/* Page header */
.page-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.page-header p {
  font-size: 16px;
  color: var(--color-text-secondary);
}

/* Controls */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius);
}

.filter-select {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 14px;
  color: var(--color-text-primary);
}

.results-count {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

/* Posts */
.posts {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.post-item {
  background: var(--color-bg-primary);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-item:hover {
  border-color: var(--color-border-medium);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.post-content {
  padding: var(--spacing-xl);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.meta-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.separator {
  opacity: 0.5;
}

.post-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
  margin-bottom: var(--spacing-md);
}

.post-excerpt {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
  font-size: 16px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.post-categories {
  display: flex;
  gap: var(--spacing-xs);
}

.category-badge {
  background: var(--color-accent);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.category-badge:hover {
  background: var(--color-accent-hover);
}

.post-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-3xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
}

.page-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius);
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-medium);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: var(--spacing-xs);
}

.page-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius);
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-medium);
}

.page-number.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .controls {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }
  
  .post-content {
    padding: var(--spacing-lg);
  }
  
  .post-title {
    font-size: 20px;
  }
  
  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}
</style>
