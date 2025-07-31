<template>
  <div class="about">
    <div class="about-content">
      <h1>About Me</h1>
      
      <div class="intro">

        
        <div class="bio">
          <h2>Hello, I'm BernardYao</h2>
          <p>
            Welcome to my personal blog!
          </p>
        </div>
      </div>
      
      <div class="sections">
        <section class="skills">
          <h3>Technology Stack</h3>
          <div class="skill-tags">
            <span class="skill-tag">JavaScript</span>
            <span class="skill-tag">Computer network</span>
            <span class="skill-tag">Vue.js</span>
            <span class="skill-tag">C</span>
            <span class="skill-tag">Node.js</span>
            <span class="skill-tag">Linux</span>
            <span class="skill-tag">Java</span>
            <span class="skill-tag">MySQL</span>
            <span class="skill-tag">Git</span>
            <span class="skill-tag">Docker</span>
          </div>
        </section>
        
        <section class="contact">
          <h3>Contact</h3>
          <div class="contact-links">
            <button @click="handleEmailClick" class="contact-link">
              Email
            </button>
            <a href="https://github.com/bernardyao" class="contact-link" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </section>
        
        <section class="blog-info">
          <h3>About This Blog</h3>
          <p>
            This blog is built with <strong>Vue 3 + TypeScript</strong> for the frontend,
            <strong>Express + Prisma</strong> for the backend,
            and supports Markdown article writing and category management.
          </p>
          <p>
            It mainly shares content about frontend development, backend technology, programming insights, etc.,
            hoping to help fellow developers.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Static page with email handler
const handleEmailClick = () => {
  window.open('mailto:bernardyao624@gmail.com', '_blank');
}
</script>

<style scoped>
.about {
  background: var(--volcano-bg-primary);
  min-height: 100vh;
  padding: var(--spacing-3xl) 0;
}

.about-content {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.about-content h1 {
  color: var(--volcano-text-primary);
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.intro {
  display: flex;
  align-items: center;
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-3xl);
  padding-bottom: var(--spacing-3xl);
  border-bottom: 1px solid var(--volcano-border-light);
}



.bio h2 {
  color: var(--volcano-text-primary);
  margin-bottom: var(--spacing-lg);
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
}

.bio p {
  color: var(--volcano-text-secondary);
  line-height: 1.7;
  font-size: 18px;
}

.sections {
  display: grid;
  gap: var(--spacing-3xl);
}

.sections h3 {
  color: var(--volcano-text-primary);
  margin-bottom: var(--spacing-lg);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.skill-tag {
  background: var(--volcano-bg-tertiary);
  color: var(--volcano-text-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--volcano-border-light);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background: var(--volcano-primary);
  color: white;
  border-color: var(--volcano-primary);
  transform: translateY(-1px);
}

.contact h3 {
  margin-bottom: var(--spacing-xl);
}

  .contact-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}.contact-link {
  display: block;
  background: var(--volcano-primary);
  color: white !important;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  border: none;
  width: 100%;
}

.contact-link:hover {
  background: var(--volcano-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--volcano-shadow-md);
}

.blog-info p {
  color: var(--volcano-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-lg);
  font-size: 16px;
}

.blog-info strong {
  color: var(--volcano-primary);
  font-weight: 600;
}

/* Responsive design */
@media (max-width: 768px) {
  .about {
    padding: var(--spacing-xl) 0;
  }
  
  .about-content {
    padding: 0 var(--spacing-md);
  }
  
  .about-content h1 {
    font-size: 32px;
    margin-bottom: var(--spacing-xl);
  }
  
  .intro {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-xl);
  }
  

  
  .bio h2 {
    font-size: 24px;
  }
  
  .bio p {
    font-size: 16px;
  }
  
  .sections h3 {
    font-size: 20px;
  }
  
  .interests ul {
    grid-template-columns: 1fr;
  }
  
  .contact-links {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .about-content {
    padding: 0 var(--spacing-sm);
  }
  
  .about-content h1 {
    font-size: 28px;
  }
  
  .intro {
    gap: var(--spacing-lg);
  }
  
  .bio h2 {
    font-size: 22px;
  }
}
</style>
