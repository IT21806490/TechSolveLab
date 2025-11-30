<template>
  <div class="min-h-screen bg-gray-50 antialiased">
    <Navbar />
        <!-- Hero Section -->
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
    <main class="max-w-6xl mx-auto p-6 pt-16">

      <div v-if="pending" class="text-center py-20 text-gray-500 text-lg">
        Loading the latest posts...
      </div>
      
      <div v-else-if="posts.length === 0" class="text-center py-20 text-red-600 text-lg">
        No tutorials found. Check your file path or ensure post files contain the exported 'postMetadata' object!
      </div>

      <div v-else class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PostCard v-for="p in posts" :key="p.slug" :post="p" />
      </div>

    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';
import PostCard from '~/components/PostCard.vue';

const posts = ref([]); 
const postFiles = import.meta.glob('~/pages/posts/*.vue');

const { pending, error } = await useAsyncData('all-blog-posts', async () => {
    
    const fetchedPosts = [];
    
    for (const path in postFiles) {
        try {
            const module = await postFiles[path]();
            
            // 🚨 NEW METHOD: Directly access the named export 'postMetadata'
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
            } else {
                 // Log this if the postMetadata object is missing from the file
                 console.error(`🔴 MISSING METADATA: File ${path} is missing the exported 'postMetadata' object.`);
            }

        } catch (e) {
            console.error(`❌ CRITICAL IMPORT FAILURE: Could not import file ${path}`, e);
        }
    }

    posts.value = fetchedPosts;
    posts.value.sort((a, b) => a.title.localeCompare(b.title));
});
</script>