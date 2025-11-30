<!-- FILE: pages/posts/how-to-fix-nuxt-routing.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <!-- Hero Section -->
    <section class="pt-32 pb-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center space-x-3 mb-4">
          <NuxtLink to="/blog" class="text-blue-200 hover:text-white transition-colors flex items-center text-sm">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Tutorials
          </NuxtLink>
          <span class="text-blue-200">•</span>
          <span class="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
            Nuxt
          </span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">How to Fix Nuxt 3 Page Routing Errors: Complete Guide</h1>
        <div class="flex flex-wrap items-center gap-4 text-blue-100">
          <div>November 25, 2025</div>
          <div>8 min read</div>
          <div>1.2K views</div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid lg:grid-cols-3 gap-10">
        <article class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">

            <!-- Table of Contents -->
            <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-10">
              <h2 class="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <ul class="space-y-2 text-gray-700">
                <li>Understanding Nuxt routing fundamentals</li>
                <li>Common routing errors and their solutions</li>
                <li>Best practices for production deployments</li>
              </ul>
            </div>

            <!-- Article Content -->
            <div class="prose prose-lg max-w-none">
              <p>Nuxt routing errors can be frustrating. In this guide, we'll cover common issues and step-by-step solutions.</p>

              <h2>Understanding Nuxt Routing</h2>
              <p>Nuxt uses file-based routing. Make sure your pages folder matches your URL structure.</p>

              <h2>Step 1: Verify Your Routes</h2>
              <p>Check your pages folder for proper kebab-case filenames to avoid routing conflicts.</p>

              <h2>Step 2: Clear Your Build Cache</h2>
              <p>Remove <code>.nuxt</code> folder and reinstall dependencies:</p>
              <pre class="bg-gray-900 rounded-xl p-4 overflow-x-auto text-green-400"><code>rm -rf .nuxt
npm install
npm run build</code></pre>

              <h2>Step 3: Check Configuration</h2>
              <p>Verify your <code>nuxt.config.ts</code> for deployment settings.</p>

              <h2>Conclusion</h2>
              <p>Follow these steps to resolve most Nuxt routing issues.</p>
            </div>

            <!-- Author Section -->
            <div class="mt-12 pt-8 border-t border-gray-200">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl">T</div>
                <div>
                  <p class="font-semibold text-gray-900">TechSolveLab Team</p>
                  <p class="text-sm text-gray-600">Web Development Experts</p>
                </div>
              </div>
            </div>

          </div>
        </article>

        <!-- Sidebar -->
        <aside class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Related Tutorials</h3>
              <div class="space-y-4">
                <a href="#" class="block group">
                  <h4 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">Advanced Nuxt Middleware Guide</h4>
                  <p class="text-sm text-gray-600">5 min read</p>
                </a>
                <a href="#" class="block group">
                  <h4 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">Deploying Nuxt to Vercel</h4>
                  <p class="text-sm text-gray-600">7 min read</p>
                </a>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';
</script>

<style scoped>
</style>
