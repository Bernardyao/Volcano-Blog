<template>
  <div class="category-posts">
    <div class="header">
      <h1 v-if="category">Category: {{ category.name }}</h1>
      <h1 v-else>Category Posts</h1>
      <router-link to="/posts" class="back-link">← Back to All Posts</router-link>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="posts.length === 0" class="no-posts">
      No posts in this category
    </div>
    
    <div v-else class="posts">
      <article 
        v-for="post in posts" 
        :key="post.id" 
        class="post-item"
        @click="$router.push(`/post/${post.id}`)"
      >
        <h2>{{ post.title }}</h2>
        <p class="excerpt">{{ getExcerpt(post.content) }}</p>
        
        <div class="post-meta">
          <span class="author">{{ typeof post.author === 'string' ? post.author : post.author?.name || 'Unknown Author' }}</span>
          <span class="date">{{ formatDate(post.createdAt) }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { blogApi, type Post, type Category } from '../api'

interface Props {
  id: string
}

const props = defineProps<Props>()
const route = useRoute()

const category = ref<Category | null>(null)
const posts = ref<Post[]>([])
const loading = ref(true)
const error = ref('')

const fetchCategoryPosts = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const categoryId = parseInt(props.id || route.params.id as string)
    if (isNaN(categoryId)) {
      error.value = 'Invalid category ID'
      return
    }
    // Get category information
    const categoryInfo = await blogApi.categories.getById(categoryId)
    // Get posts in this category
    const result = await blogApi.posts.getAll({ category: categoryInfo.name })
    category.value = categoryInfo
    posts.value = result.posts || []
  } catch (err: any) {
    console.error('Failed to fetch category posts:', err)
    error.value = 'Failed to load category posts, please try again later'
  } finally {
    loading.value = false
  }
}

const getExcerpt = (content: string) => {
  return content.length > 150 ? content.substring(0, 150) + '...' : content
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    return date.toLocaleDateString('en-US')
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

onMounted(fetchCategoryPosts)
</script>

<style scoped>
.category-posts {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e8f4f8;
}

.header h1 {
  color: #2c3e50;
  margin: 0;
}

.back-link {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.loading, .error, .no-posts {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.error {
  color: #e74c3c;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-item {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.post-item h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  line-height: 1.4;
}

.excerpt {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
