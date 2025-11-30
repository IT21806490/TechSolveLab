<template>
  <article class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300">
    <span v-if="post.category" class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-3">
      {{ post.category }}
    </span>

    <h3 class="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
      <NuxtLink :to="post.slug">{{ post.title }}</NuxtLink>
    </h3>

    <p class="text-gray-600 mb-4 line-clamp-3">{{ post.summary }}</p>

    <NuxtLink :to="post.slug"
      class="inline-block mt-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors">
      Read More
    </NuxtLink>
  </article>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true
    // You might want to add a default with safe values for robustness
  }
});
</script>