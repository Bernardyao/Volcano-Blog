<template>
  <div class="post-detail">
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="error">
      {{ error }}
      <router-link to="/posts" class="back-link">Return to article list</router-link>
    </div>
    
    <article v-else-if="post" class="post">
      <header class="post-header">
        <h1>{{ post.title }}</h1>
        
        <div class="post-meta">
          <div class="author-info">
            <span class="author">Author: {{ typeof post.author === 'string' ? post.author : post.author.name }}</span>
            <span class="date">Posted in: {{ formatDate(post.createdAt) }}</span>
            <span v-if="post.updatedAt !== post.createdAt" class="updated">
              Updated: {{ formatDate(post.updatedAt) }}
            </span>
          </div>
          
          <div class="post-categories">
            <div v-if="post.categories && post.categories.length > 0" class="categories">
              <span class="label">Category:</span>
              <router-link 
                v-for="(category, index) in post.categories" 
                :key="'id' in category ? category.id : index"
                :to="`/category/${'id' in category ? category.id : ''}`"
                class="category-link"
              >
                {{ 'name' in category ? category.name : String(category) }}
              </router-link>
            </div>
            

          </div>
        </div>
      </header>
      
      <div class="post-content" v-html="renderedContent"></div>
      
      <footer class="post-footer">
        <div class="actions">
          <router-link to="/posts" class="back-btn">
            ← Return to article list
          </router-link>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { blogApi, type Post } from '../api'

interface Props {
  id: string
}

const props = defineProps<Props>()
const route = useRoute()

const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref('')

// 简单的Markdown渲染（可以后续替换为更复杂的渲染器）
const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  
  // 简单的Markdown转HTML
  return post.value.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
})

const fetchPost = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const postId = parseInt(props.id || route.params.id as string)
    if (isNaN(postId)) {
      error.value = 'Invalid article ID'
      return
    }
    
    post.value = await blogApi.posts.getById(postId)
  } catch (err: any) {
    console.error('Failed to fetch article:', err)
    error.value = 'Failed to load article, please try again later'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

onMounted(fetchPost)
</script>

<style scoped>
.post-detail {
  background: var(--color-bg-primary);
  min-height: 100vh;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: var(--color-text-secondary);
  font-size: 16px;
}

.back-link {
  color: var(--color-accent);
  text-decoration: none;
  margin-top: var(--spacing-md);
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}

.post {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.post-header {
  margin-bottom: var(--spacing-3xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
}

.post-header h1 {
  color: var(--color-text-primary);
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: var(--spacing-xl);
  letter-spacing: -0.02em;
}

.post-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.author-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: 15px;
  font-weight: 500;
}

.author-info span {
  display: flex;
  align-items: center;
}

.author-info span:not(:last-child)::after {
  content: '·';
  margin-left: var(--spacing-sm);
  color: var(--color-text-tertiary);
}

.post-categories {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.categories, .tags {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.label {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 15px;
  margin-right: 4px;
}

.category-link {
  background: var(--color-accent);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.category-link:hover {
  background: var(--color-accent-hover);
}



.post-content {
  line-height: 1.8;
  color: var(--color-text-primary);
  font-size: 18px;
  margin-bottom: var(--spacing-3xl);
  letter-spacing: 0.01em;
}

.post-content :deep(p) {
  margin-bottom: var(--spacing-lg);
}

.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5),
.post-content :deep(h6) {
  color: var(--color-text-primary);
  font-weight: 600;
  margin: var(--spacing-xl) 0 var(--spacing-md);
  line-height: 1.3;
}

.post-content :deep(h1) { font-size: 32px; }
.post-content :deep(h2) { font-size: 28px; }
.post-content :deep(h3) { font-size: 24px; }
.post-content :deep(h4) { font-size: 20px; }

.post-content :deep(strong) {
  font-weight: 600;
  color: var(--color-text-primary);
}

.post-content :deep(em) {
  font-style: italic;
  color: var(--color-text-secondary);
}

.post-content :deep(code) {
  background: var(--color-bg-tertiary);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.9em;
  color: var(--color-accent);
}

.post-content :deep(pre) {
  background: var(--color-bg-tertiary);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  overflow-x: auto;
  margin: var(--spacing-lg) 0;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.post-content :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  padding-left: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  font-style: italic;
  color: var(--color-text-secondary);
}

.post-content :deep(ul),
.post-content :deep(ol) {
  margin: var(--spacing-lg) 0;
  padding-left: var(--spacing-xl);
}

.post-content :deep(li) {
  margin-bottom: var(--spacing-sm);
}

.post-content :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-decoration-color: rgba(26, 137, 23, 0.3);
  text-underline-offset: 2px;
  transition: all 0.2s ease;
}

.post-content :deep(a:hover) {
  color: var(--color-accent-hover);
  text-decoration-color: var(--color-accent-hover);
}

.post-footer {
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
  text-align: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-accent);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .post {
    padding: var(--spacing-2xl) var(--spacing-md);
  }
  
  .post-header h1 {
    font-size: 32px;
  }
  
  .post-content {
    font-size: 16px;
  }
  
  .author-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .author-info span:not(:last-child)::after {
    display: none;
  }
  
  .post-categories {
    margin-top: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .post {
    padding: var(--spacing-xl) var(--spacing-sm);
  }
  
  .post-header h1 {
    font-size: 28px;
  }
}
</style>
