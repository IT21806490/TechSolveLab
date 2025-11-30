<!-- FILE: pages/posts/smart-home-gadgets-2025.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <!-- Hero Section -->
    <section
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
            class="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold"
          >
            Gadgets
          </span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Top 5 Smart Home Gadgets for 2025
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-blue-100">
          <div>November 27, 2025</div>
          <div>6 min read</div>
          <div>2.1K views</div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid lg:grid-cols-3 gap-10">
        <article class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div class="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg mb-10">
              <h2 class="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <ul class="space-y-2 text-gray-700">
                <li>Latest smart home gadgets in 2025</li>
                <li>Features and benefits of each device</li>
                <li>How to upgrade your home technology</li>
              </ul>
            </div>

            <div class="prose prose-lg max-w-none">
              <p class="text-xl text-gray-700 leading-relaxed mb-6">
                Smart home gadgets make life easier, secure, and more energy-efficient. In 2025, these devices offer advanced features and AI integration.
              </p>

              <h2 class="text-2xl font-bold mt-8 mb-4">Top 5 Smart Home Gadgets</h2>
              <ol class="list-decimal list-inside space-y-6">
                <li><h3 class="text-lg font-semibold text-indigo-700">Amazon Echo 6th Gen</h3><p class="ml-4">Voice-controlled assistant with smart home integration.</p></li>
                <li><h3 class="text-lg font-semibold text-indigo-700">Google Nest Hub Max</h3><p class="ml-4">Smart display with AI-powered home automation features.</p></li>
                <li><h3 class="text-lg font-semibold text-indigo-700">Ring Video Doorbell 5</h3><p class="ml-4">Advanced security with AI motion detection.</p></li>
                <li><h3 class="text-lg font-semibold text-indigo-700">Philips Hue Smart Lights</h3><p class="ml-4">Control lighting via app or voice assistant with color options.</p></li>
                <li><h3 class="text-lg font-semibold text-indigo-700">iRobot Roomba 980+</h3><p class="ml-4">AI-powered robot vacuum for smart cleaning.</p></li>
              </ol>

              <h2 class="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
              <p class="text-gray-700 leading-relaxed">
                Upgrading to smart home gadgets in 2025 can increase convenience, safety, and energy efficiency in your home.
              </p>
            </div>
          </div>
        </article>

        <aside class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Related Posts</h3>
              <div class="space-y-4">
                <a href="#" class="block group">
                  <h4 class="font-semibold text-gray-900 group-hover:text-indigo-600">AI Smart Gadgets</h4>
                  <p class="text-sm text-gray-600">6 min read</p>
                </a>
                <a href="#" class="block group">
                  <h4 class="font-semibold text-gray-900 group-hover:text-indigo-600">Home Automation 2025</h4>
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
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";
const title = "Top 5 Smart Home Gadgets 2025";
const date = "November 27, 2025";
const readTime = "5 min read";
const category = "Gadgets";
</script>

<script>
// 🚨 CRITICAL: The listing page reads this exact object.
export const postMetadata = {
    title: "Top 5 Smart Home Gadgets 2025",
    summary: "Explore the best smart home gadgets to enhance your living space in 2025.",
    date: "November 27, 2025",
    readTime: "6 min read",
    category: "Gadgets"
};
</script>
