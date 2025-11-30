<template>
  <div class="min-h-screen bg-gray-50 antialiased">
    <Navbar />

    <header
      class="pt-32 pb-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
    >
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center space-x-3 mb-4">
          <NuxtLink
            to="/blog"
            class="text-blue-200 hover:text-white transition-colors flex items-center text-sm"
          >
            ← Back to Tutorials
          </NuxtLink>
          <span class="text-blue-200">•</span>
          <span
            class="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider"
          >
            {{ category }}
          </span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          {{ title }}
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-blue-100">
          <div>{{ date }}</div>
          <div>•</div>
          <div>{{ readTime }}</div>
          <div>•</div>
          <div>2.1K views</div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid lg:grid-cols-3 gap-10">
        <article class="lg:col-span-2">
          <section class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            <aside class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-10">
              <h2 class="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <ul class="space-y-2 text-gray-700 list-disc pl-5">
                <li>Latest 5G-enabled smartphones and gadgets</li>
                <li>Performance improvements over 4G devices</li>
                <li>Which devices will dominate the market in 2025</li>
              </ul>
            </aside>

            <div class="prose prose-lg max-w-none">
              <p class="text-xl text-gray-700 leading-relaxed mb-6">
                5G technology is reshaping mobile connectivity, providing faster speeds, lower latency, and new device capabilities.
              </p>

              <h2 class="text-2xl font-bold mt-8 mb-4">Top 5G Devices</h2>
              <ol class=" list-inside space-y-6">
                <li><h3 class="text-lg font-semibold text-blue-700">1. iPhone 17 Pro</h3><p class="ml-4">Next-gen Apple phone with full 5G support.</p></li>
                <li><h3 class="text-lg font-semibold text-blue-700">2. Samsung Galaxy Z Fold 5</h3><p class="ml-4">Folding device with high-speed 5G connectivity.</p></li>
                <li><h3 class="text-lg font-semibold text-blue-700">3. OnePlus 13 Pro</h3><p class="ml-4">Flagship Android with excellent 5G performance.</p></li>
                <li><h3 class="text-lg font-semibold text-blue-700">4. Google Pixel 10</h3><p class="ml-4">AI-integrated 5G smartphone with great camera.</p></li>
                <li><h3 class="text-lg font-semibold text-blue-700">5. Sony Xperia 2 5G</h3><p class="ml-4">High-end multimedia device with 5G.</p></li>
              </ol>

              <h2 class="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
              <p class="text-gray-700 leading-relaxed">
                5G devices in 2025 offer faster, more reliable connectivity, transforming the way we use smartphones and smart gadgets.
              </p>
            </div>
          </section>
        </article>

        <aside class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-xl">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Related Posts</h3>
              <div class="space-y-4">
                <a href="#" class="block group">
                  <h4 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">AI Devices 2025</h4>
                  <p class="text-sm text-gray-600">6 min read</p>
                </a>
                <a href="#" class="block group">
                  <h4 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Top 5G Trends</h4>
                  <p class="text-sm text-gray-600">7 min read</p>
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";

// 🚨 CRUCIAL FIX: Added summary variable for the listing page to read.
const title = "5G Devices You Must Watch in 2025";
const summary = "A definitive guide to the top 5G-enabled smartphones and gadgets set to dominate the market in 2025."; 
const date = "November 27, 2025";
const readTime = "6 min read";
const category = "5G Tech"; 
</script>

<script>
// 🚨 CRITICAL: The listing page reads this exact object.
export const postMetadata = {
    title: "5G Devices You Must Watch in 2025",
    summary: "A definitive guide to the top 5G-enabled smartphones and gadgets set to dominate the market in 2025.",
    date: "November 27, 2025",
    readTime: "6 min read",
    category: "5G Tech"
};
</script>