<!-- FILE: pages/posts/wearable-tech-2025.vue -->
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
            Devices
          </span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Top 10 Wearable Tech Devices in 2025
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
            <div class="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-lg mb-10">
              <h2 class="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <ul class="space-y-2 text-gray-700">
                <li>Latest wearable devices in 2025</li>
                <li>Health, fitness, and productivity features</li>
                <li>Which devices to invest in for the future</li>
              </ul>
            </div>

            <div class="prose prose-lg max-w-none">
              <p class="text-xl text-gray-700 leading-relaxed mb-6">
                Wearable tech devices are becoming smarter, integrating health monitoring, notifications, and AI-powered analytics to improve daily life.
              </p>

              <h2 class="text-2xl font-bold mt-8 mb-4">Top 10 Wearables</h2>
              <ol class="list-decimal list-inside space-y-6">
                <li><h3 class="text-lg font-semibold text-teal-700">Apple Watch Series 10</h3><p class="ml-4">Advanced health tracking and AI-based fitness insights.</p></li>
                <li><h3 class="text-lg font-semibold text-teal-700">Fitbit Charge 7</h3><p class="ml-4">Accurate heart rate and sleep monitoring with AI suggestions.</p></li>
                <li><h3 class="text-lg font-semibold text-teal-700">Samsung Galaxy Watch 6</h3><p class="ml-4">Stylish smartwatch with smart notifications and health tracking.</p></li>
                <li><h3 class="text-lg font-semibold text-teal-700">Garmin Venu 3</h3><p class="ml-4">Fitness-focused smartwatch for athletes and active users.</p></li>
                <li><h3 class="text-lg font-semibold text-teal-700">Oura Ring 4</h3><p class="ml-4">Ring-shaped wearable for health metrics and sleep tracking.</p></li>
                <li><h3 class="text-lg font-semibold text-teal-700">Whoop 4.0</h3><p class="ml-4">Fitness band for AI-driven recovery and performance tracking.</p></li>
                <li><h3 class="text-lg font-semibold text-teal-700">Xiaomi Mi Band 8</h3><p class="ml-4">Affordable wearable with health and fitness features.</p></li>
                <li><h3 class="text-lg font-semibold text-teal-700">Huawei Watch GT 4</h3><p class="ml-4">Long battery life smartwatch with advanced metrics.</p></li>
                <li><h3 class="text-lg font-semibold text-teal-700">Amazfit GTR 5</h3><p class="ml-4">Stylish wearable with fitness and AI tracking.</p></li>
                <li><h3 class="text-lg font-semibold text-teal-700">Google Pixel Watch 2</h3><p class="ml-4">AI-integrated smartwatch with Google ecosystem features.</p></li>
              </ol>

              <h2 class="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
              <p class="text-gray-700 leading-relaxed">
                Wearable tech in 2025 continues to evolve, helping users stay healthy, productive, and connected in style.
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
                  <h4 class="font-semibold text-gray-900 group-hover:text-teal-600">Smart Home Gadgets</h4>
                  <p class="text-sm text-gray-600">5 min read</p>
                </a>
                <a href="#" class="block group">
                  <h4 class="font-semibold text-gray-900 group-hover:text-teal-600">AI Productivity Apps</h4>
                  <p class="text-sm text-gray-600">6 min read</p>
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
const title = "Top 10 Wearable Tech Devices 2025";
const date = "November 27, 2025";
const readTime = "6 min read";
const category = "Wearable Tech";
</script>

<script>
// 🚨 CRITICAL: The listing page reads this exact object.
export const postMetadata = {
    title: "Top 10 Wearable Tech Devices 2025",
    summary: "Discover the best wearable tech devices enhancing health and productivity in 2025.",
    date: "November 27, 2025",
    readTime: "6 min read",
    category: "Wearable Tech"
};
</script>