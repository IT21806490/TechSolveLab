<!-- FILE: pages/posts/ai-marketing-2025.vue -->
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
            Marketing
          </span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          AI in Marketing: Strategies for 2025
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
            <div class="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg mb-10">
              <h2 class="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <ul class="space-y-2 text-gray-700">
                <li>AI tools transforming marketing campaigns</li>
                <li>Automation and personalization strategies</li>
                <li>2025 trends for AI marketing</li>
              </ul>
            </div>

            <div class="prose prose-lg max-w-none">
              <p class="text-xl text-gray-700 leading-relaxed mb-6">
                AI is reshaping marketing. Businesses can automate campaigns, generate content, and personalize messages using advanced AI tools.
              </p>

              <h2 class="text-2xl font-bold mt-8 mb-4">Key AI Marketing Tools</h2>
              <ol class=" list-inside space-y-6">
                <li><h3 class="text-lg font-semibold text-yellow-700">1. ChatGPT for Customer Engagement</h3><p class="ml-4">Automates chat support and social media interactions.</p></li>
                <li><h3 class="text-lg font-semibold text-yellow-700">2. Jasper AI</h3><p class="ml-4">Generates marketing copy and blog posts.</p></li>
                <li><h3 class="text-lg font-semibold text-yellow-700">3. Canva AI</h3><p class="ml-4">Designs social media graphics and banners quickly.</p></li>
                <li><h3 class="text-lg font-semibold text-yellow-700">4. DALL·E 3</h3><p class="ml-4">Creates AI-generated images for campaigns.</p></li>
                <li><h3 class="text-lg font-semibold text-yellow-700">5. Notion AI</h3><p class="ml-4">Organizes marketing plans and tasks efficiently.</p></li>
              </ol>

              <h2 class="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
              <p class="text-gray-700 leading-relaxed">
                Businesses using AI in marketing save time, improve personalization, and increase ROI. 2025 will see even more AI-driven campaigns.
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
                  <h4 class="font-semibold text-gray-900 group-hover:text-yellow-600">Top AI Tools 2025</h4>
                  <p class="text-sm text-gray-600">6 min read</p>
                </a>
                <a href="#" class="block group">
                  <h4 class="font-semibold text-gray-900 group-hover:text-yellow-600">AI Trends 2025</h4>
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
const title = "AI in Marketing: Strategies for 2025";
const date = "November 27, 2025";
const readTime = "6 min read";
const category = "Marketing AI";
</script>

<script>
// 🚨 CRITICAL: The listing page reads this exact object.
export const postMetadata = {
    title: "AI in Marketing: Strategies for 2025",
    summary: "Explore how AI is transforming marketing strategies and tools in 2025.",
    date: "November 27, 2025",
    readTime: "6 min read",
    category: "Marketing AI"
};
</script>