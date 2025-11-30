<template>
  <div class="mb-6">
    <input
      v-model="q"
      @input="onInput"
      type="text"
      placeholder="Search posts..."
      class="w-full p-3 rounded border"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
const q = ref("");
const emit = defineEmits(["search"]);
function onInput() {
  emit("search", q.value);
}
</script>