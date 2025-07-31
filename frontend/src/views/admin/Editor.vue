<template>
  <div class="medium-editor">
    <!-- Medium-style header -->
    <header class="medium-header">
      <div class="header-content">
        <router-link to="/admin" class="logo-link">
          Volcano
        </router-link>
        <div class="header-actions">
          <button 
            @click="savePost(false)" 
            :disabled="saving || !canPublish"
            class="btn-draft"
          >
            {{ saving ? 'Saving...' : 'Save Draft' }}
          </button>
          <button 
            @click="savePost(true)" 
            :disabled="saving || !canPublish"
            class="btn-publish"
          >
            {{ saving ? 'Publishing...' : 'Publish Post' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Medium-style editor body -->
    <main class="medium-main">
      <div class="medium-container">
        <!-- Title Input -->
        <div class="title-section">
          <textarea
            v-model="postForm.title"
            placeholder="Title"
            class="title-input"
            rows="1"
            @input="autoResizeTitle"
            ref="titleRef"
          ></textarea>
        </div>

        <!-- Content Editor -->
        <div class="content-section">
          <textarea
            v-model="postForm.content"
            placeholder="Tell your story..."
            class="content-input"
            @input="autoResizeContent"
            ref="contentRef"
          ></textarea>
        </div>

        <!-- Bottom Toolbar -->
        <div class="bottom-toolbar">
          <div class="toolbar-left">
            <span class="word-count">{{ postForm.content?.length || 0 }} characters</span>
          </div>
          <div class="toolbar-right">
            <!-- Category Selection -->
            <div class="category-selector">
              <button 
                @click="showCategoryMenu = !showCategoryMenu"
                class="category-toggle-btn"
              >
                Categories ({{ selectedCategories.length }})
                <span class="toggle-arrow" :class="{ 'expanded': showCategoryMenu }">▼</span>
              </button>
              
              <div v-if="showCategoryMenu" class="category-menu" @click.stop>
                <div class="category-list">
                  <label 
                    v-for="category in categories" 
                    :key="category.id"
                    class="category-item"
                    @click.stop
                  >
                    <input 
                      v-model="selectedCategories" 
                      :value="category.id"
                      type="checkbox"
                      @change="onCategoryChange"
                    />
                    <span class="category-name">{{ category.name }}</span>
                    <button 
                      @click.stop="deleteCategory(category.id)"
                      class="delete-category-btn"
                      :title="`Delete ${category.name}`"
                    >
                      ×
                    </button>
                  </label>
                </div>
                
                <div class="category-actions">
                  <button @click.stop="showAddCategory = true" class="add-category-btn">
                    Add Category
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </main>

    <!-- Add Category Modal -->
    <div v-if="showAddCategory" class="modal-overlay" @click="showAddCategory = false">
      <div class="modal-card" @click.stop>
        <h3>Add New Category</h3>
        <input
          v-model="newCategoryName"
          type="text"
          placeholder="Category name"
          class="modal-input"
          @keyup.enter="addCategory"
        />
        <div class="modal-actions">
          <button @click="showAddCategory = false" class="btn-cancel">Cancel</button>
          <button @click="addCategory" class="btn-confirm">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { blogApi, type Post, type Category, type PostForm } from '../../api'

interface Props {
  id?: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()

// Reactive data
const postForm = ref({
  title: '',
  content: '',
  published: false
})

const categories = ref<Category[]>([])
const selectedCategories = ref<number[]>([])
const saving = ref(false)

// Modal related
const showAddCategory = ref(false)
const showCategoryMenu = ref(false)
const newCategoryName = ref('')

// Element references
const titleRef = ref<HTMLTextAreaElement>()
const contentRef = ref<HTMLTextAreaElement>()

// Computed properties
const isEditing = computed(() => !!(props.id || route.params.id))

const canPublish = computed(() => {
  return postForm.value.title.trim() && postForm.value.content.trim()
})

// Methods
const autoResizeTitle = () => {
  nextTick(() => {
    if (titleRef.value) {
      titleRef.value.style.height = 'auto'
      titleRef.value.style.height = titleRef.value.scrollHeight + 'px'
    }
  })
}

const autoResizeContent = () => {
  nextTick(() => {
    if (contentRef.value) {
      contentRef.value.style.height = 'auto'
      contentRef.value.style.height = contentRef.value.scrollHeight + 'px'
    }
  })
}

const fetchCategories = async () => {
  try {
    categories.value = await blogApi.categories.getAll()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = []
  }
}

const fetchPost = async () => {
  if (!isEditing.value) return
  
  try {
    const postId = parseInt(props.id || route.params.id as string)
    const post = await blogApi.posts.getById(postId)
    
    postForm.value = {
      title: post.title,
      content: post.content,
      published: post.published
    }
    
    selectedCategories.value = post.categories?.map(c => c.id) || []
    
    // Auto adjust height
    nextTick(() => {
      autoResizeTitle()
      autoResizeContent()
    })
  } catch (error) {
    console.error('Failed to fetch post:', error)
    alert('Failed to load post')
    router.push('/admin')
  }
}

const savePost = async (publish: boolean) => {
  if (!canPublish.value) return
  
  saving.value = true
  
  try {
    const postData: PostForm = {
      title: postForm.value.title.trim(),
      content: postForm.value.content.trim(),
      published: publish,
      categoryIds: selectedCategories.value
    }
    
    console.log('Preparing to save post:', postData)
    
    if (isEditing.value) {
      const postId = parseInt(props.id || route.params.id as string)
      await blogApi.posts.update(postId, postData)
    } else {
      await blogApi.posts.create(postData)
    }
    
    postForm.value.published = publish
    alert(publish ? 'Post published successfully!' : 'Draft saved successfully!')
    
    if (!isEditing.value) {
      router.push('/admin')
    }
  } catch (error: any) {
    console.error('Failed to save post:', error)
    console.error('Error details:', error.response?.data)
    console.error('Status code:', error.response?.status)
    
    let errorMessage = 'Save failed, please retry'
    
    if (error.response?.status === 401) {
      errorMessage = 'Authentication failed, please login again'
      // Clear token and redirect to login page
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      router.push('/admin/login')
      return
    } else if (error.response?.status === 403) {
      errorMessage = 'Insufficient permissions'
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    alert(errorMessage)
  } finally {
    saving.value = false
  }
}

const addCategory = async () => {
  if (!newCategoryName.value.trim()) return
  
  try {
    const newCategory = await blogApi.categories.create({
      name: newCategoryName.value.trim()
    })
    categories.value.push(newCategory)
    newCategoryName.value = ''
    showAddCategory.value = false
    
    // Show success message
    const successMessage = document.createElement('div')
    successMessage.className = 'toast-message success'
    successMessage.textContent = 'Category added successfully!'
    document.body.appendChild(successMessage)
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      successMessage.classList.add('fade-out')
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 500)
    }, 3000)
  } catch (error) {
    console.error('Failed to add category:', error)
    
    // Show error message
    const errorMessage = document.createElement('div')
    errorMessage.className = 'toast-message error'
    errorMessage.textContent = 'Failed to add category'
    document.body.appendChild(errorMessage)
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      errorMessage.classList.add('fade-out')
      setTimeout(() => {
        document.body.removeChild(errorMessage)
      }, 500)
    }, 3000)
  }
}

const deleteCategory = async (categoryId: number) => {
  if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
    return
  }
  
  try {
    await blogApi.categories.delete(categoryId)
    
    // Remove from categories list
    categories.value = categories.value.filter(cat => cat.id !== categoryId)
    
    // Remove from selected categories if it was selected
    selectedCategories.value = selectedCategories.value.filter(id => id !== categoryId)
    
    // Show success message
    const successMessage = document.createElement('div')
    successMessage.className = 'toast-message success'
    successMessage.textContent = 'Category deleted successfully!'
    document.body.appendChild(successMessage)
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      successMessage.classList.add('fade-out')
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 500)
    }, 3000)
  } catch (error) {
    console.error('Failed to delete category:', error)
    
    // Show error message
    const errorMessage = document.createElement('div')
    errorMessage.className = 'toast-message error'
    errorMessage.textContent = 'Failed to delete category. It may be in use by existing posts.'
    document.body.appendChild(errorMessage)
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      errorMessage.classList.add('fade-out')
      setTimeout(() => {
        document.body.removeChild(errorMessage)
      }, 500)
    }, 3000)
  }
}

const onCategoryChange = () => {
  // This function is called when a category checkbox is toggled
  // The v-model automatically handles the selectedCategories array update
  console.log('Selected categories:', selectedCategories.value)
}

// Lifecycle
onMounted(async () => {
  try {
    // Check if authentication token exists
    const token = localStorage.getItem('admin_token')
    console.log('Current auth token:', token ? 'exists' : 'not found')
    
    if (!token) {
      console.warn('No auth token found, login may be required')
      alert('Please login to admin dashboard first')
      router.push('/admin/login')
      return
    }
    
    await fetchCategories()
    
    if (isEditing.value) {
      await fetchPost()
    }

    // Add click outside listener to close category menu
    document.addEventListener('click', (event) => {
      const categorySelector = document.querySelector('.category-selector')
      if (categorySelector && !categorySelector.contains(event.target as Node)) {
        showCategoryMenu.value = false
      }
    })
  } catch (error) {
    console.error('Editor initialization failed:', error)
  }
})
</script>

<style scoped>
/* === Medium Official Editor Styles === */
.medium-editor {
  min-height: 100vh;
  background: var(--volcano-bg-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  transition: all 0.3s ease;
}

/* Header styles - Modern frosted glass effect */
.medium-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--volcano-border-light);
  z-index: 100;
  transition: all 0.3s ease;
}

.dark-theme .medium-header {
  background: rgba(18, 18, 18, 0.85);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.logo-link {
  color: var(--volcano-text-primary);
  text-decoration: none;
  font-weight: 700;
  font-size: 28px;
  font-family: "Playfair Display", Georgia, serif;
  letter-spacing: -0.02em;
  transition: all 0.2s ease;
}

.logo-link:hover {
  color: var(--volcano-primary);
}

.header-actions {
  display: flex;
  gap: 16px;
}

.btn-draft, .btn-publish {
  border: none;
  border-radius: 24px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.02em;
  position: relative;
  overflow: hidden;
}

.btn-draft {
  background: var(--volcano-bg-tertiary);
  color: var(--volcano-text-secondary);
  border: 1px solid var(--volcano-border-medium);
}

.btn-draft:hover:not(:disabled) {
  background: var(--volcano-bg-secondary);
  color: var(--volcano-primary);
  border-color: var(--volcano-primary);
  transform: translateY(-1px);
  box-shadow: var(--volcano-shadow-sm);
}

.btn-publish {
  background: linear-gradient(135deg, var(--volcano-primary) 0%, var(--volcano-primary-dark) 100%);
  color: white;
  box-shadow: var(--volcano-shadow-md);
  border: 1px solid var(--volcano-primary);
}

.btn-publish:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--volcano-primary-dark) 0%, #0d5f00 100%);
  transform: translateY(-2px);
  box-shadow: var(--volcano-shadow-lg);
}

.btn-draft:disabled, .btn-publish:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Main body styles - More elegant layout */
.medium-main {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: var(--volcano-bg-primary);
}

.medium-container {
  max-width: 740px;
  margin: 0 auto;
  padding: 64px 32px 120px;
}

/* Title styles - Medium official style */
.title-section {
  margin-bottom: 32px;
}

.title-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--volcano-text-primary);
  resize: none;
  overflow: hidden;
  background: transparent;
  font-family: "sohne", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: -0.03em;
  transition: color 0.3s ease;
}

.title-input::placeholder {
  color: var(--volcano-text-tertiary);
  opacity: 0.6;
}

.title-input:focus::placeholder {
  opacity: 0.3;
}

/* Content styles - Optimized readability */
.content-section {
  margin-bottom: 64px;
  position: relative;
}

.content-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 21px;
  line-height: 1.58;
  color: var(--volcano-text-primary);
  resize: none;
  overflow: hidden;
  background: transparent;
  font-family: "Charter", "Georgia", "Cambria", "Times New Roman", "Times", serif;
  min-height: 500px;
  transition: color 0.3s ease;
  letter-spacing: -0.003em;
}

.content-input::placeholder {
  color: var(--volcano-text-tertiary);
  opacity: 0.5;
  font-style: italic;
}

.content-input:focus::placeholder {
  opacity: 0.3;
}

/* Bottom toolbar - Modern design */
.bottom-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid var(--volcano-border-light);
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 50;
  transition: all 0.3s ease;
}

.dark-theme .bottom-toolbar {
  background: rgba(18, 18, 18, 0.95);
}

.toolbar-left {
  color: var(--volcano-text-secondary);
  font-size: 14px;
  font-weight: 500;
}

.toolbar-right {
  display: flex;
  gap: 24px;
  align-items: center;
}

/* Category selector - Improved design */
.category-selector {
  position: relative;
}

.category-toggle-btn {
  background: none;
  border: 1px solid var(--volcano-border-medium);
  color: var(--volcano-text-primary);
  font-size: 14px;
  font-weight: 500;
  font-family: "sohne", "Helvetica Neue", Helvetica, Arial, sans-serif;
  padding: 10px 16px;
  border-radius: 20px;
  background: var(--volcano-bg-tertiary);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-toggle-btn:hover {
  background: var(--volcano-bg-secondary);
  transform: translateY(-1px);
  border-color: var(--volcano-primary);
  color: var(--volcano-primary);
}

.toggle-arrow {
  font-size: 12px;
  transition: transform 0.2s ease;
}

.toggle-arrow.expanded {
  transform: rotate(180deg);
}

.category-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: var(--volcano-bg-primary);
  border: 1px solid var(--volcano-border-light);
  border-radius: 12px;
  box-shadow: var(--volcano-shadow-lg);
  min-width: 280px;
  margin-bottom: 12px;
  backdrop-filter: blur(20px);
  z-index: 10;
  animation: fadeInScale 0.2s ease;
  transform-origin: bottom right;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.category-list {
  padding: 16px;
  max-height: 200px;
  overflow-y: auto;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--volcano-text-primary);
  transition: all 0.2s ease;
  border-radius: 8px;
  margin-bottom: 6px;
  position: relative;
  border: 1px solid transparent;
}

.category-item:hover {
  background: var(--volcano-bg-tertiary);
  border-color: var(--volcano-border-light);
}

.category-item input {
  margin: 0;
  accent-color: var(--volcano-primary);
  cursor: pointer;
}

.category-name {
  flex: 1;
  cursor: pointer;
}

.delete-category-btn {
  background: none;
  border: none;
  color: var(--volcano-text-tertiary);
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.category-item:hover .delete-category-btn {
  opacity: 1;
}

.delete-category-btn:hover {
  background: rgba(255, 71, 87, 0.15);
  color: #ff4757;
  transform: scale(1.1);
}

.category-actions {
  border-top: 1px solid var(--volcano-border-light);
  padding: 16px;
}

.add-category-btn {
  width: 100%;
  background: var(--volcano-bg-tertiary);
  border: 1px dashed var(--volcano-border-medium);
  border-radius: 8px;
  padding: 12px;
  color: var(--volcano-text-secondary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-category-btn::before {
  content: '+';
  display: inline-block;
  font-weight: bold;
  font-size: 16px;
}

.add-category-btn:hover {
  background: var(--volcano-bg-secondary);
  color: var(--volcano-primary);
  border-color: var(--volcano-primary);
  border-style: solid;
  transform: translateY(-1px);
}



/* Modal styles - Modern design */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  background: var(--volcano-bg-primary);
  border-radius: 16px;
  padding: 32px;
  min-width: 400px;
  box-shadow: var(--volcano-shadow-xl);
  border: 1px solid var(--volcano-border-light);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-card h3 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--volcano-text-primary);
  letter-spacing: -0.01em;
}

.modal-input {
  width: 100%;
  border: 1px solid var(--volcano-border-medium);
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 15px;
  margin-bottom: 24px;
  background: var(--volcano-bg-secondary);
  color: var(--volcano-text-primary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-input:focus {
  outline: none;
  border-color: var(--volcano-primary);
  box-shadow: 0 0 0 3px rgba(26, 137, 23, 0.1);
  background: var(--volcano-bg-primary);
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.btn-cancel, .btn-confirm {
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.02em;
}

.btn-cancel {
  background: var(--volcano-bg-tertiary);
  color: var(--volcano-text-secondary);
  border: 1px solid var(--volcano-border-medium);
}

.btn-confirm {
  background: linear-gradient(135deg, var(--volcano-primary) 0%, var(--volcano-primary-dark) 100%);
  color: white;
  box-shadow: var(--volcano-shadow-sm);
}

.btn-cancel:hover {
  background: var(--volcano-bg-secondary);
  color: var(--volcano-text-primary);
  transform: translateY(-1px);
}

.btn-confirm:hover {
  background: linear-gradient(135deg, var(--volcano-primary-dark) 0%, #0d5f00 100%);
  transform: translateY(-1px);
  box-shadow: var(--volcano-shadow-md);
}

/* Responsive design - Optimized mobile experience */
@media (max-width: 768px) {
  .medium-container {
    padding: 32px 20px 140px;
  }
  
  .header-content {
    padding: 0 20px;
  }
  
  .title-input {
    font-size: 32px;
    line-height: 1.2;
  }
  
  .content-input {
    font-size: 18px;
    line-height: 1.6;
    min-height: 400px;
  }
  
  .bottom-toolbar {
    padding: 16px 20px;
  }
  
  .toolbar-right {
    gap: 16px;
  }
  

  
  .category-menu {
    min-width: 200px;
  }
  
  .modal-card {
    margin: 20px;
    min-width: auto;
    padding: 24px;
  }
  
  .header-actions {
    gap: 12px;
  }
  
  .btn-draft, .btn-publish {
    padding: 8px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .medium-container {
    padding: 24px 16px 160px;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .title-input {
    font-size: 28px;
  }
  
  .content-input {
    font-size: 17px;
  }
  
  .bottom-toolbar {
    flex-direction: column;
    gap: 16px;
    padding: 20px 16px;
  }
  
  .toolbar-left, .toolbar-right {
    width: 100%;
    justify-content: center;
  }
  

}

/* Toast Messages */
.toast-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

.toast-message.success {
  background-color: #52c41a;
}

.toast-message.error {
  background-color: #ff4d4f;
}

.toast-message.fade-out {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
