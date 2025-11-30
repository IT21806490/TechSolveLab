<template>
  <footer class="mt-auto bg-white border-t border-gray-100">
    <div class="max-w-6xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        <div class="md:col-span-1">
          <div class="flex items-center space-x-2 mb-4">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <h3 class="text-xl font-extrabold text-gray-900 tracking-tight">TechSolveLab</h3>
          </div>
          <p class="text-gray-600 text-sm leading-relaxed mb-6">
            Expert tech insights, reviews, and solutions for a modern digital life. We cover AI, gadgets, cybersecurity, and more.
          </p>
          
          <div class="flex space-x-3">
            <a 
              href="https://twitter.com/techsolvelab" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Twitter"
              class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/techsolvelab" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://linkedin.com/company/techsolvelab" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a 
              href="https://youtube.com/@techsolvelab" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="YouTube"
              class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-bold text-gray-900 mb-5 border-b-2 border-blue-600 w-1/2 pb-1">Quick Links</h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/blog" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                All Blog Posts
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                About Us
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Contact
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/subscribe" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Newsletter
              </NuxtLink>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-lg font-bold text-gray-900 mb-5 border-b-2 border-blue-600 w-1/2 pb-1">Topics</h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/category/ai" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                AI & Machine Learning
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/category/cybersecurity" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Cybersecurity
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/category/gadgets" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Gadgets & Reviews
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/category/software" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Software & Apps
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/category/connectivity" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Connectivity & 5G
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-bold text-gray-900 mb-5 border-b-2 border-blue-600 w-1/2 pb-1">Legal</h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/privacy" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Privacy Policy
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/terms" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Terms of Service
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cookie" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Cookie Policy
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/dmca" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                DMCA Policy
              </NuxtLink>
            </li>
            <li>
              <a href="/sitemap.xml" class="text-gray-600 hover:text-blue-600 transition-colors text-base">
                Sitemap
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-10 pb-10">
        <div class="max-w-xl mx-auto text-center">
          <h4 class="text-xl font-extrabold text-gray-900 mb-3">Stay Informed with TechSolveLab</h4>
          <p class="text-gray-600 mb-5 text-base">
            Get weekly blog posts, expert tips, and tech news delivered straight to your inbox.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-base transition-shadow"
              disabled 
              title="Click 'Subscribe Free' to open the signup page."
            />
            <a 
              href="https://techsolvelab.com/subscribe" 
              target="_blank"
              rel="noopener noreferrer"
              class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors whitespace-nowrap text-base flex-shrink-0"
            >
              Subscribe Free
            </a>
          </div>
          <p class="text-xs text-gray-500 mt-4">
            Join 50,000+ readers. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-600 text-sm font-medium">
          &copy; {{ currentYear }} TechSolveLab. All rights reserved.
        </p>
        
        <div class="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600">
          <NuxtLink to="/privacy" class="hover:text-blue-600 transition-colors">
            Privacy
          </NuxtLink>
          <NuxtLink to="/terms" class="hover:text-blue-600 transition-colors">
            Terms
          </NuxtLink>
          <NuxtLink to="/cookie" class="hover:text-blue-600 transition-colors">
            Cookies
          </NuxtLink>
          <NuxtLink to="/contact" class="hover:text-blue-600 transition-colors">
            Contact
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>Made with</span>
          <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
          </svg>
          <span>for tech enthusiasts</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>