<template>
  <div class="home">
    <!-- Hero section inspired by Medium -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Sharing Thoughts and Technology</h1>
          <p class="hero-subtitle">
            Here, I record the little things on the road of programming, share my thoughts on technology and life.
            Every article is a record of knowledge and a witness to growth.
          </p>
          <div class="hero-actions">
            <router-link to="/posts" class="btn btn-primary">
              Start Reading
            </router-link>
            <router-link to="/about" class="btn">
              Learn More
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured posts section -->
    <section class="featured-posts">
      <div class="container">
        <div class="section-header">
          <h2>Latest Posts</h2>
          <router-link to="/posts" class="see-all-link">
            View All
          </router-link>
        </div>

        <div v-if="loading" class="loading">
          Loading...
        </div>

        <div v-else-if="posts.length === 0" class="empty-state">
          <h3>No posts yet</h3>
          <p>No posts yet, stay tuned.</p>
        </div>

        <div v-else class="posts-grid">
          <article 
            v-for="post in posts" 
            :key="post.id" 
            class="post-card"
            @click="navigateToPost(post.id)"
          >
            <div class="post-content">
              <div class="post-meta">
                <span class="author">{{ typeof post.author === 'string' ? post.author : post.author.name }}</span>
                <span class="separator"></span>
                <time class="date">{{ formatDate(post.createdAt) }}</time>
              </div>
              
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ getExcerpt(post.content) }}</p>
              
              <div class="post-footer">
                <div class="post-actions">
                  <span class="read-time">{{ estimateReadTime(post.content) }} min read</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- About section -->
    <section class="about-preview">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>About the Author</h2>
            <p>
              A passionate developer who loves technology and focuses on front-end and full-stack development.
              I like to explore new technologies, share programming experience, and record growth.
            </p>
            <router-link to="/about" class="btn">
              Learn More
            </router-link>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { blogApi, type Post } from '../api'

const router = useRouter()
const posts = ref<Post[]>([])
const loading = ref(true)

const fetchRecentPosts = async () => {
  try {
    loading.value = true
    // 调用真实API获取最新文章
    const response = await blogApi.posts.getAll({ 
      limit: 6, 
      published: true,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    posts.value = response.posts || []
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    // 如果API调用失败，显示空状态
    posts.value = []
  } finally {
    loading.value = false
  }
}

const getExcerpt = (content: string) => {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/[#*`\[\]]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  
  return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }

    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

const estimateReadTime = (content: string) => {
  if (!content) return 1;
  
  const wordsPerMinute = 200
  const wordCount = content.length / 2 // Approximate for Chinese text
  return Math.max(1, Math.round(wordCount / wordsPerMinute))
}

const navigateToPost = (postId: number) => {
  router.push(`/post/${postId}`)
}

onMounted(fetchRecentPosts)
</script>

<style scoped>
.home {
  background: var(--volcano-bg-primary);
}

/* Hero section */
.hero {
  padding: var(--spacing-3xl) 0;
  background: var(--volcano-bg-primary);
  border-bottom: 1px solid var(--volcano-border-light);
}

.hero-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  color: var(--volcano-text-primary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--volcano-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* Featured posts section */
.featured-posts {
  padding: var(--spacing-3xl) 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.section-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: var(--volcano-text-primary);
}

.see-all-link {
  color: var(--volcano-primary);
  font-weight: 500;
  text-decoration: none;
  font-size: 14px;
}

.see-all-link:hover {
  text-decoration: underline;
}

/* Posts grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
}

.post-card {
  background: var(--volcano-bg-primary);
  border-radius: var(--border-radius);
  border: 1px solid var(--volcano-border-light);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--volcano-shadow-md);
  border-color: var(--volcano-border-medium);
}

.post-content {
  padding: var(--spacing-lg);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  font-size: 13px;
}

.post-meta .author {
  color: var(--volcano-text-secondary);
  font-weight: 500;
}

.post-meta .separator {
  width: 2px;
  height: 2px;
  background: var(--volcano-text-tertiary);
  border-radius: 50%;
}

.post-meta .date {
  color: var(--volcano-text-tertiary);
}

.post-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--volcano-text-primary);
  line-height: 1.3;
  margin-bottom: var(--spacing-md);
}

.post-excerpt {
  color: var(--volcano-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.post-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.post-actions {
  flex-shrink: 0;
}

.read-time {
  font-size: 12px;
  color: var(--volcano-text-tertiary);
}

/* About preview section */
.about-preview {
  padding: var(--spacing-3xl) 0;
  background: var(--volcano-bg-secondary);
  border-top: 1px solid var(--volcano-border-light);
}

.about-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-xl);
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.about-text h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--volcano-text-primary);
  margin-bottom: var(--spacing-md);
}

.about-text p {
  color: var(--volcano-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}



/* Container and layout */
.container {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* Loading and empty states */
.loading {
  text-align: center;
  padding: var(--spacing-3xl) 0;
  color: var(--volcano-text-secondary);
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) 0;
}

.empty-state h3 {
  color: var(--volcano-text-primary);
  margin-bottom: var(--spacing-md);
  font-size: 24px;
  font-weight: 600;
}

.empty-state p {
  color: var(--volcano-text-secondary);
  font-size: 16px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 99em;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background-color: transparent;
  color: var(--volcano-text-primary);
  border: 1px solid var(--volcano-border-medium);
}

.btn:hover {
  background-color: var(--volcano-bg-secondary);
  transform: translateY(-1px);
}

.btn-primary {
  background-color: var(--volcano-primary);
  color: white;
  border: 1px solid var(--volcano-primary);
}

.btn-primary:hover {
  background-color: var(--volcano-primary-dark);
  border-color: var(--volcano-primary-dark);
}

/* Responsive design */
@media (max-width: 768px) {
  .hero {
    padding: var(--spacing-2xl) 0;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 200px;
  }
  
  .section-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .about-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>
