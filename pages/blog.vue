<template>
  <div class="min-h-screen bg-gray-50 antialiased">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <section class="pt-32 pb-16 px-6 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6">TechSolveLab Blog</h1>
        <p class="text-xl md:text-2xl text-blue-100 leading-relaxed">
          Explore tutorials, insights, and the latest trends in technology, AI, and productivity.
        </p>
      </div>
    </section>

    <!-- Category Filter -->
    <ClientOnly>
      <div class="max-w-6xl mx-auto px-6 py-8" v-if="posts.length > 0">
        <!-- Desktop: Wrap buttons + Show More/Less -->
        <div class="hidden sm:flex flex-wrap gap-4 items-center">
          <button
            v-for="(cat, index) in visibleCategories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-full font-medium transition',
              selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow hover:bg-gray-100'
            ]"
          >
            {{ cat }}
          </button>

          <button
            v-if="allCategories.length > maxVisible"
            @click="showAllCategories = !showAllCategories"
            class="px-4 py-2 rounded-full font-medium bg-gray-200 text-gray-800 shadow hover:bg-gray-300"
          >
            {{ showAllCategories ? 'Show Less' : '+ More' }}
          </button>
        </div>

        <!-- Mobile: Horizontal scroll -->
        <div class="sm:hidden flex overflow-x-auto gap-3 pb-2">
          <button
            v-for="cat in allCategories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'flex-shrink-0 px-4 py-2 rounded-full font-medium transition whitespace-nowrap',
              selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow hover:bg-gray-100'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </ClientOnly>

    <!-- Posts Section -->
    <main class="max-w-6xl mx-auto p-6 pt-4">
      <div v-if="pending" class="text-center py-20 text-gray-500 text-lg">
        Loading the latest posts...
      </div>
      
      <div v-else-if="filteredPosts.length === 0" class="text-center py-20 text-red-600 text-lg">
        No posts found in this category.
      </div>

      <div v-else class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PostCard v-for="p in filteredPosts" :key="p.slug" :post="p" />
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';
import PostCard from '~/components/PostCard.vue';
import { ref, computed } from 'vue';

// Config
const maxVisible = 10;           // Desktop: show first 10 categories
const showAllCategories = ref(false);
const selectedCategory = ref('All');

// Posts
const posts = ref([]);
const postFiles = import.meta.glob('~/pages/posts/*.vue');

// Fetch all posts asynchronously
const { pending, error } = await useAsyncData('all-blog-posts', async () => {
  const fetchedPosts = [];

  for (const path in postFiles) {
    try {
      const module = await postFiles[path]();
      const metadata = module.postMetadata;

      if (metadata && metadata.title) {
        const filename = path.split('/').pop().replace('.vue', '');
        fetchedPosts.push({
          title: metadata.title,
          summary: metadata.summary || 'A compelling summary is missing.',
          category: metadata.category || 'General',
          slug: `/posts/${filename}`,
          date: metadata.date || 'N/A'
        });
      }
    } catch (e) {
      console.error(`❌ Failed to import ${path}`, e);
    }
  }

  // Sort newest first
  posts.value = fetchedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Compute all unique categories
const allCategories = computed(() => {
  const cats = new Set(posts.value.map(p => p.category));
  return ['All', ...cats];
});

// Desktop visible categories (with Show More/Less)
const visibleCategories = computed(() => {
  if (showAllCategories.value) return allCategories.value;
  return allCategories.value.slice(0, maxVisible);
});

// Filtered posts based on selected category
const filteredPosts = computed(() => {
  if (selectedCategory.value === 'All') return posts.value;
  return posts.value.filter(p => p.category === selectedCategory.value);
});
</script>
