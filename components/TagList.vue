<template>
  <div class="flex flex-wrap gap-2">
    <NuxtLink
      v-for="tag in tags"
      :key="tag"
      :to="`/?tag=${tag}`"
      class="text-sm px-3 py-1 border rounded text-gray-600"
      >{{ tag }}</NuxtLink
    >
  </div>
</template>

<script setup>
defineProps({ tags: Array });
</script>