<template>
  <nav class="bg-white shadow-md fixed w-full z-50 top-0">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center space-x-2 text-3xl font-extrabold text-gray-900 hover:text-blue-600 transition-colors"
        >
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span>TechSolveLab</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6 font-medium text-gray-700">
          <NuxtLink to="/" class="hover:text-blue-600 transition-colors">
            Home
          </NuxtLink>
          
          <NuxtLink to="/blog" class="hover:text-blue-600 transition-colors">
            Blogs
          </NuxtLink>
          
          <NuxtLink to="/about" class="hover:text-blue-600 transition-colors">
            About
          </NuxtLink>
          
          <NuxtLink to="/contact" class="hover:text-blue-600 transition-colors">
            Contact
          </NuxtLink>
          
          <NuxtLink
            to="/subscribe"
            class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Subscribe
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button 
            @click="isOpen = !isOpen" 
            class="text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-label="isOpen ? 'Close menu' : 'Open menu'"
          >
            <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div 
        v-if="isOpen" 
        class="md:hidden pb-4 border-t border-gray-100"
      >
        <NuxtLink 
          to="/" 
          class="block py-3 px-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded" 
          @click="isOpen = false"
        >
          Home
        </NuxtLink>
        
        <NuxtLink 
          to="/blog" 
          class="block py-3 px-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded" 
          @click="isOpen = false"
        >
          Blogs
        </NuxtLink>
        
        <NuxtLink 
          to="/about" 
          class="block py-3 px-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded" 
          @click="isOpen = false"
        >
          About
        </NuxtLink>
        
        <NuxtLink 
          to="/contact" 
          class="block py-3 px-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded" 
          @click="isOpen = false"
        >
          Contact
        </NuxtLink>
        
        <NuxtLink 
          to="/subscribe"
          class="block py-3 px-2 mt-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
          @click="isOpen = false"
        >
          Subscribe
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
const categoriesOpen = ref(false);

// Close mobile menu when route changes
const route = useRoute();
watch(() => route.path, () => {
  isOpen.value = false;
  categoriesOpen.value = false;
});
</script>

<style scoped>
/* Ensure dropdown appears above other content */
.group:hover .group-hover\:opacity-100 {
  z-index: 50;
}
</style>