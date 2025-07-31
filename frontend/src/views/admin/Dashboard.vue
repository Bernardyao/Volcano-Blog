<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <h1>Admin Dashboard</h1>
      <div class="header-actions">
        <span class="welcome">Welcome, {{ user?.name }}</span>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </header>
    
    <div class="dashboard-content">
      <!-- Statistics Cards -->
      <div class="stats">
        <div class="stat-card">
          <h3>Total Posts</h3>
          <div class="stat-number">{{ stats.totalPosts }}</div>
        </div>
        
        <div class="stat-card">
          <h3>Published</h3>
          <div class="stat-number">{{ stats.publishedPosts }}</div>
        </div>
        
        <div class="stat-card">
          <h3>Drafts</h3>
          <div class="stat-number">{{ stats.draftPosts }}</div>
        </div>
        
        <div class="stat-card">
          <h3>Categories</h3>
          <div class="stat-number">{{ stats.totalCategories }}</div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <router-link to="/admin/editor" class="action-btn primary">
            New
          </router-link>
          <button @click="refreshStats" class="action-btn secondary" :disabled="loading">
             {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>
      
      <!-- Recent Posts -->
      <div class="recent-posts">
        <h2>Recent Posts</h2>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="recentPosts.length === 0" class="no-posts">
          No posts yet
        </div>
        <div v-else class="posts-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in recentPosts" :key="post.id">
                <td>
                  <router-link 
                    :to="`/post/${post.id}`" 
                    class="post-title"
                    target="_blank"
                  >
                    {{ post.title }}
                  </router-link>
                </td>
                <td>
                  <span :class="['status', post.published ? 'published' : 'draft']">
                    {{ post.published ? 'Published' : 'Draft' }}
                  </span>
                </td>
                <td>{{ formatDate(post.createdAt) }}</td>
                <td class="actions">
                  <router-link 
                    :to="`/admin/editor/${post.id}`" 
                    class="edit-link"
                  >
                    Edit
                  </router-link>
                  <button 
                    @click="deletePost(post.id)" 
                    class="delete-btn"
                    :disabled="deletingPostId === post.id"
                  >
                    {{ deletingPostId === post.id ? 'Deleting...' : 'Delete' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { blogApi, type Post } from '../../api'

// Type definitions
interface User {
  id: number
  name: string
  email: string
}

interface Stats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalCategories: number
}

const router = useRouter()

// Reactive data
const user = ref<User | null>(null)
const recentPosts = ref<Post[]>([])
const loading = ref(false)
const deletingPostId = ref<number | null>(null)
const stats = ref<Stats>({
  totalPosts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  totalCategories: 0
})

// Get user information
const fetchUserInfo = async (): Promise<void> => {
  try {
    const userData = localStorage.getItem('admin_user')
    if (userData) {
      user.value = JSON.parse(userData)
    } else {
      // Set default user data
      user.value = {
        id: 1,
        name: 'Admin',
        email: 'admin@example.com'
      }
    }
  } catch (error) {
    console.error('Failed to get user information:', error)
    logout()
  }
}

// Get statistics data
const fetchStats = async (): Promise<void> => {
  try {
    // Call real API to get statistics data
    const postsResponse = await blogApi.posts.getAll({ limit: 1000 })
    const categoriesResponse = await blogApi.categories.getAll()
    
    const totalPosts = postsResponse.total || postsResponse.posts?.length || 0
    const publishedPosts = postsResponse.posts?.filter(p => p.published).length || 0
    const draftPosts = totalPosts - publishedPosts
    
    stats.value = {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories: categoriesResponse.length || 0
    }
  } catch (error) {
    console.error('Failed to get statistics data:', error)
    // If API call fails, set default values
    stats.value = {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalCategories: 0
    }
  }
}

// Get recent posts
const fetchRecentPosts = async (): Promise<void> => {
  try {
    loading.value = true
    // Call real API to get recent posts
    const response = await blogApi.posts.getAll({ 
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    recentPosts.value = response.posts || []
  } catch (error) {
    console.error('Failed to get recent posts:', error)
    recentPosts.value = []
  } finally {
    loading.value = false
  }
}

// Delete post
const deletePost = async (postId: number): Promise<void> => {
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return
  }
  
  try {
    deletingPostId.value = postId
    const postToDelete = recentPosts.value.find(p => p.id === postId)
    
    // Call real API to delete post
    await blogApi.posts.delete(postId)
    
    // Remove from local list
    recentPosts.value = recentPosts.value.filter(post => post.id !== postId)
    
    // Update statistics
    if (postToDelete) {
      stats.value.totalPosts--
      if (postToDelete.published) {
        stats.value.publishedPosts--
      } else {
        stats.value.draftPosts--
      }
    }
    
    alert('Post deleted successfully')
  } catch (error) {
    console.error('Failed to delete post:', error)
    alert('Failed to delete post, please try again later')
  } finally {
    deletingPostId.value = null
  }
}

// Refresh data
const refreshStats = async (): Promise<void> => {
  await Promise.all([
    fetchStats(),
    fetchRecentPosts()
  ])
}

// Logout
const logout = (): void => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push('/admin/login')
}

// Format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Initialize data when component is mounted
onMounted(async () => {
  console.log('Dashboard mounted, starting data fetch...')
  try {
    await Promise.all([
      fetchUserInfo(),
      fetchStats(),
      fetchRecentPosts()
    ])
  } catch (error) {
    console.error('Initialization failed:', error)
  }
})
</script>

<style scoped>
.admin-dashboard {
  background: var(--color-bg-secondary);
  min-height: 100vh;
  font-family: var(--font-family);
}

.admin-header {
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border-light);
  padding: var(--spacing-lg) var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-header h1 {
  color: var(--color-text-primary);
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.welcome {
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
}

.logout-btn {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.dashboard-content {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-3xl);
}

.stat-card {
  background: var(--color-bg-primary);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border-light);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
  text-align: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: var(--color-border-medium);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stat-card h3 {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  color: var(--color-text-primary);
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.quick-actions {
  background: var(--color-bg-primary);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border-light);
  margin-bottom: var(--spacing-xl);
}

.quick-actions h2 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  font-size: 20px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.action-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.action-btn.primary {
  background: var(--color-accent);
  color: white;
}

.action-btn.primary:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-medium);
}

.action-btn.secondary:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-light);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.recent-posts {
  background: var(--color-bg-primary);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border-light);
}

.recent-posts h2 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  font-size: 20px;
  font-weight: 600;
}

.loading, .no-posts {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-tertiary);
  font-size: 16px;
}

.posts-table {
  overflow-x: auto;
}

.posts-table table {
  width: 100%;
  border-collapse: collapse;
}

.posts-table th,
.posts-table td {
  padding: var(--spacing-md) var(--spacing-sm);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.posts-table th {
  background: var(--color-bg-secondary);
  font-weight: 500;
  color: var(--color-text-secondary);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.posts-table td {
  color: var(--color-text-primary);
  font-size: 14px;
}

.post-title {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.post-title:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}

.status {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status.published {
  background: rgba(26, 137, 23, 0.1);
  color: var(--color-accent);
}

.status.draft {
  background: rgba(255, 193, 7, 0.1);
  color: #b8860b;
}

.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.edit-link {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 12px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  font-weight: 500;
}

.edit-link:hover {
  background: rgba(26, 137, 23, 0.1);
  color: var(--color-accent-hover);
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.delete-btn:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
    padding: var(--spacing-md) var(--spacing-lg);
  }
  
  .dashboard-content {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .stats {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .posts-table {
    font-size: 12px;
  }
  
  .posts-table th,
  .posts-table td {
    padding: var(--spacing-sm) var(--spacing-xs);
  }
  
  .actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .admin-header h1 {
    font-size: 20px;
  }
  
  .dashboard-content {
    padding: var(--spacing-lg) var(--spacing-sm);
  }
  
  .stat-card {
    padding: var(--spacing-md);
  }
  
  .stat-number {
    font-size: 24px;
  }
}
</style>
