<template>
  <article class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 flex flex-col h-full">
    
    <!-- Category Badge (original style) -->
    <span 
      v-if="post.category" 
      class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-3"
    >
      {{ post.category }}
    </span>

    <!-- Title -->
    <h3 class="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
      <NuxtLink :to="post.slug">{{ post.title }}</NuxtLink>
    </h3>

    <!-- Summary -->
    <p class="text-gray-600 mb-6 line-clamp-3 flex-1">
      {{ post.summary }}
    </p>

    <!-- Read More Button -->
    <div class="mt-auto">
      <NuxtLink 
        :to="post.slug"
        class="w-full text-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:scale-105 transition-all duration-300"
      >
        Read More
      </NuxtLink>
    </div>
    
  </article>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
});
</script>
