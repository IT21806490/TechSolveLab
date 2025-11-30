<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <Navbar />

    <section class="relative overflow-hidden pt-32 pb-20 px-6 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Master <span class="text-yellow-300">Tech Solutions</span> Today
          </h1>
          <p class="text-xl md:text-2xl mb-4 max-w-3xl mx-auto font-light leading-relaxed">
            In-Depth Blog Posts • Quick Fixes • Expert Tech Guides • Gadget Reviews
          </p>
          <p class="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-blue-100">
            Join 50,000+ readers learning practical tech skills and staying informed
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink 
              to="/blog"
              class="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg">
              Browse All Blog Posts →
            </NuxtLink>
            <NuxtLink 
              to="/subscribe"
              class="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg">
              Get Weekly Tips 📧
            </NuxtLink>
          </div>
        </div>
        
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div class="text-3xl font-bold">500+</div>
            <div class="text-blue-200 text-sm">Blog Posts</div>
          </div>
          <div>
            <div class="text-3xl font-bold">50K+</div>
            <div class="text-blue-200 text-sm">Readers</div>
          </div>
          <div>
            <div class="text-3xl font-bold">4.9★</div>
            <div class="text-blue-200 text-sm">Rating</div>
          </div>
          <div>
            <div class="text-3xl font-bold">100%</div>
            <div class="text-blue-200 text-sm">Free</div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto -mt-8 px-6 relative z-20">
      <div class="grid md:grid-cols-3 gap-6">
        <NuxtLink 
          v-for="topic in featuredTopics" 
          :key="topic.name"
          :to="topic.link"
          class="bg-white rounded-2xl shadow-2xl p-6 text-center transition-all duration-300 group hover:shadow-xl hover:scale-[1.01] border-t-4 border-blue-500 hover:border-blue-700"
        >
          <div class="text-5xl mb-3 text-blue-600 group-hover:text-blue-700 transition-colors">
            {{ topic.icon }}
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ topic.name }}</h3>
          <p class="text-sm text-gray-500">{{ topic.description }}</p>
          <p class="text-sm font-semibold mt-3 text-blue-500 group-hover:text-blue-600">
            Explore Now →
          </p>
        </NuxtLink>
      </div>
    </section>

    <section class="max-w-6xl mx-auto mt-20 px-6">
      <div class="flex items-center justify-between mb-10">
        <div>
          <h2 class="text-4xl font-bold text-gray-900 mb-2">Latest Blog Posts</h2>
          <p class="text-gray-600 text-lg">Stay updated with our newest articles and insights</p>
        </div>
        <NuxtLink 
          to="/blog"
          class="hidden md:inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
          View All 
          <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>
      
      <div v-if="latestPosts.length > 0" class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PostCard v-for="p in latestPosts" :key="p.slug" :post="p" />
      </div>
      <div v-else class="text-center py-10 text-gray-500">
        Loading latest posts...
      </div>

      <div class="text-center mt-12">
        <NuxtLink 
          to="/blog"
          class="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300">
          Explore More Blog Posts
        </NuxtLink>
      </div>
    </section>

    <section class="max-w-6xl mx-auto mt-24 px-6 mb-20">
      <h2 class="text-4xl font-bold text-center mb-4 text-gray-900">Why Readers Choose TechSolveLab</h2>
      <p class="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
        **Quality content** that helps you understand the latest tech, solve real-world problems, and stay informed.
      </p>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-900">In-Depth Guides 📘</h3>
          <p class="text-gray-600 leading-relaxed">
            Clear, detailed instructions and comprehensive reviews covering cutting-edge technology and trends.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-900">Quick Tech Solutions ⚡</h3>
          <p class="text-gray-600 leading-relaxed">
            Fast, actionable solutions and fixes for common hardware, software, and privacy issues.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div class="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-900">Expert Insight 💡</h3>
          <p class="text-gray-600 leading-relaxed">
            Learn from seasoned tech professionals about future trends, security, and best practices.
          </p>
        </div>
      </div>
    </section>

    <section class="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-6">
      <div class="max-w-4xl mx-auto text-center text-white">
        <h2 class="text-4xl font-bold mb-4">Never Miss an Update</h2>
        <p class="text-xl mb-8 text-blue-100">
          Get weekly **blog posts**, tips, and tech news delivered directly to your inbox.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email"
            class="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
          <button class="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>
        <p class="text-sm mt-4 text-blue-200">Join 50,000+ readers. Unsubscribe anytime.</p>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';
import PostCard from '~/components/PostCard.vue';
import { ref } from 'vue';

// --- SEO Meta Tags ---
useHead({
  title: 'TechSolveLab - Expert Tech Solutions & Guides',
  meta: [
    { name: 'description', content: 'Explore in-depth tutorials, quick fixes, and expert guides on AI, 5G, cybersecurity, and modern gadgets.' },
    { name: 'keywords', content: 'tech tutorials, AI guides, 5G devices, cybersecurity tips, gadget reviews, tech news, remote work, online privacy' },
    { property: 'og:title', content: 'TechSolveLab - Expert Tech Solutions & Guides' },
    { property: 'og:description', content: 'Master the latest technology trends and secure your digital life.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://techsolvelab.com' }
  ]
});

// --- FEATURED TOPICS DATA ---
const featuredTopics = [
    { 
        name: 'Artificial Intelligence', 
        link: '/category/ai', 
        icon: '🤖',
        description: 'Explore the latest in AI tools, productivity apps, and machine learning trends.',
    },
    { 
        name: 'Cybersecurity & Privacy', 
        link: '/category/cybersecurity', 
        icon: '🔒',
        description: 'Stay safe online with guides on privacy, data protection, and essential security tools.',
    },
    { 
        name: 'Gadget Reviews & Guides', 
        link: '/category/gadgets', 
        icon: '📱',
        description: 'In-depth reviews and buyer guides for the best new smartphones, laptops, and wearables.',
    }
];

// --- Dynamic Post Fetching Logic ---
const postFiles = import.meta.glob('~/pages/posts/*.vue', { eager: false });
const allPosts = ref([]);
const latestPosts = ref([]); // Holds the final top 3 posts

const parseDate = (dateString) => {
    // Helper function to parse date strings for sorting
    return new Date(dateString); 
};

await useAsyncData('latest-blog-posts', async () => {
    const tempPosts = [];
    
    for (const path in postFiles) {
        try {
            const module = await postFiles[path]();
            
            // Reads the postMetadata explicit export object
            const metadata = module.postMetadata; 
            
            if (metadata && metadata.title) {
                const filename = path.split('/').pop().replace('.vue', '');
                
                tempPosts.push({
                    title: metadata.title,
                    summary: metadata.summary || 'A summary is missing.',
                    category: metadata.category || 'General',
                    slug: `/posts/${filename}`, 
                    date: metadata.date || 'Jan 1, 2000', // Ensure a date exists for sorting
                    readTime: metadata.readTime || '5 min read'
                });
            }
        } catch (e) {
            console.error(`❌ HOME PAGE IMPORT FAILURE: Could not import file ${path}`, e);
        }
    }

    // Sort by date (latest first)
    tempPosts.sort((a, b) => parseDate(b.date) - parseDate(a.date));

    allPosts.value = tempPosts;
    
    // Select only the top 3 posts
    latestPosts.value = tempPosts.slice(0, 3);
});
</script>

<style scoped>
/* Grid pattern for the Hero section */
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}
</style>