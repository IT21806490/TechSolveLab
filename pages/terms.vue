<template>
  <transition name="slide-up">
    <div 
      v-if="showBanner" 
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl"
    >
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <!-- Content -->
          <div class="flex-1">
            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">We Value Your Privacy</h3>
                <p class="text-sm text-gray-600 leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.
                  <NuxtLink to="/cookie-policy" class="text-blue-600 hover:text-blue-700 font-medium ml-1">
                    Learn more
                  </NuxtLink>
                </p>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              @click="acceptEssentialOnly"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
            >
              Essential Only
            </button>
            <button 
              @click="showPreferences"
              class="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm whitespace-nowrap"
            >
              Customize
            </button>
            <button 
              @click="acceptAll"
              class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Preferences Modal -->
  <transition name="fade">
    <div 
      v-if="showPreferencesModal" 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="showPreferencesModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">Cookie Preferences</h2>
            <button 
              @click="showPreferencesModal = false"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <p class="text-gray-600 mt-2 text-sm">
            Manage your cookie preferences below. Some cookies are essential for the site to function.
          </p>
        </div>

        <div class="p-6 space-y-6">
          <!-- Essential Cookies -->
          <div class="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <h3 class="font-bold text-gray-900">Essential Cookies</h3>
                <span class="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">Required</span>
              </div>
              <p class="text-sm text-gray-600">
                These cookies are necessary for the website to function and cannot be disabled.
              </p>
            </div>
            <div class="ml-4">
              <input 
                type="checkbox" 
                checked 
                disabled
                class="w-5 h-5 text-blue-600 border-gray-300 rounded cursor-not-allowed opacity-50"
              />
            </div>
          </div>

          <!-- Analytics Cookies -->
          <div class="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 mb-2">Analytics Cookies</h3>
              <p class="text-sm text-gray-600 mb-2">
                Help us understand how visitors interact with our website (Google Analytics).
              </p>
              <p class="text-xs text-gray-500">Cookies: _ga, _gid, _gat</p>
            </div>
            <div class="ml-4">
              <label class="relative inline-block w-12 h-6 cursor-pointer">
                <input 
                  v-model="preferences.analytics" 
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>
          </div>

          <!-- Advertising Cookies -->
          <div class="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 mb-2">Advertising Cookies</h3>
              <p class="text-sm text-gray-600 mb-2">
                Used to deliver personalized advertisements (Google AdSense).
              </p>
              <p class="text-xs text-gray-500">Cookies: __gads, __gac, IDE</p>
            </div>
            <div class="ml-4">
              <label class="relative inline-block w-12 h-6 cursor-pointer">
                <input 
                  v-model="preferences.advertising" 
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>
          </div>

          <!-- Preference Cookies -->
          <div class="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 mb-2">Preference Cookies</h3>
              <p class="text-sm text-gray-600 mb-2">
                Remember your settings and preferences for a personalized experience.
              </p>
              <p class="text-xs text-gray-500">Cookies: theme_preference, language</p>
            </div>
            <div class="ml-4">
              <label class="relative inline-block w-12 h-6 cursor-pointer">
                <input 
                  v-model="preferences.preferences" 
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          <button 
            @click="savePreferences"
            class="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Preferences
          </button>
          <button 
            @click="acceptAllFromModal"
            class="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showBanner = ref(false);
const showPreferencesModal = ref(false);

const preferences = ref({
  analytics: true,
  advertising: true,
  preferences: true
});

onMounted(() => {
  // Check if user has already made a choice
  const cookieConsent = localStorage.getItem('cookie_consent');
  if (!cookieConsent) {
    // Show banner after a short delay for better UX
    setTimeout(() => {
      showBanner.value = true;
    }, 1000);
  } else {
    // Load saved preferences
    try {
      const saved = JSON.parse(cookieConsent);
      preferences.value = { ...preferences.value, ...saved };
    } catch (e) {
      console.error('Error loading cookie preferences');
    }
  }
});

const acceptAll = () => {
  const consent = {
    essential: true,
    analytics: true,
    advertising: true,
    preferences: true,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('cookie_consent', JSON.stringify(consent));
  showBanner.value = false;
  
  // Load analytics and advertising scripts here
  loadAnalytics();
  loadAdsense();
};

const acceptEssentialOnly = () => {
  const consent = {
    essential: true,
    analytics: false,
    advertising: false,
    preferences: false,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('cookie_consent', JSON.stringify(consent));
  showBanner.value = false;
};

const showPreferences = () => {
  showPreferencesModal.value = true;
};

const savePreferences = () => {
  const consent = {
    essential: true,
    ...preferences.value,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('cookie_consent', JSON.stringify(consent));
  showPreferencesModal.value = false;
  showBanner.value = false;
  
  // Load scripts based on preferences
  if (preferences.value.analytics) loadAnalytics();
  if (preferences.value.advertising) loadAdsense();
};

const acceptAllFromModal = () => {
  preferences.value = {
    analytics: true,
    advertising: true,
    preferences: true
  };
  savePreferences();
};

// Helper functions to load external scripts
const loadAnalytics = () => {
  // Load Google Analytics
  if (typeof window !== 'undefined' && !window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  }
};

const loadAdsense = () => {
  // Load Google AdSense
  if (typeof window !== 'undefined' && !window.adsbygoogle) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }
};
</script>

<style scoped>
/* Slide up animation */
.slide-up-enter-active {
  animation: slideUp 0.4s ease-out;
}

.slide-up-leave-active {
  animation: slideDown 0.3s ease-in;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* Fade animation for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>