<template>
  <div class="adsense-wrapper my-8">
    <div v-if="!isProduction" class="adsense-placeholder" :class="placeholderClass">
      <div class="text-center">
        <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
        </svg>
        <p class="text-gray-500 text-sm font-medium">Advertisement Space</p>
        <p class="text-gray-400 text-xs mt-1">{{ format }} format</p>
      </div>
    </div>

    <!-- Replace with your actual AdSense code in production -->
    <ins v-else
         class="adsbygoogle"
         :style="adStyle"
         :data-ad-client="adClient"
         :data-ad-slot="adSlot"
         :data-ad-format="adFormat"
         data-full-width-responsive="true">
    </ins>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
  format: {
    type: String,
    default: 'horizontal', // horizontal, vertical, rectangle
    validator: (value) => ['horizontal', 'vertical', 'rectangle', 'auto'].includes(value)
  },
  adSlot: {
    type: String,
    default: '' // Add your AdSense slot ID
  }
});

// Replace with your AdSense client ID
const adClient = 'ca-pub-XXXXXXXXXXXXXXXX';
const isProduction = process.env.NODE_ENV === 'production';

const adFormat = computed(() => {
  const formats = {
    horizontal: 'auto',
    vertical: 'auto',
    rectangle: 'rectangle',
    auto: 'auto'
  };
  return formats[props.format] || 'auto';
});

const adStyle = computed(() => {
  const styles = {
    horizontal: 'display:block; min-height: 90px;',
    vertical: 'display:block; width: 300px; min-height: 600px;',
    rectangle: 'display:block; width: 300px; height: 250px;',
    auto: 'display:block;'
  };
  return styles[props.format] || styles.auto;
});

const placeholderClass = computed(() => {
  const classes = {
    horizontal: 'h-24 bg-gray-100',
    vertical: 'w-full lg:w-80 h-96 bg-gray-100',
    rectangle: 'w-80 h-64 bg-gray-100',
    auto: 'h-32 bg-gray-100'
  };
  return `${classes[props.format] || classes.auto} border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center`;
});

onMounted(() => {
  if (isProduction && window.adsbygoogle) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }
});
</script>

<style scoped>
.adsense-wrapper {
  margin: 2rem auto;
  max-width: 100%;
}

.adsense-placeholder {
  transition: all 0.3s ease;
}

.adsense-placeholder:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}
</style>