<template>
  <div class="min-h-screen bg-gray-50 antialiased">
    <Navbar />

    <header
      class="pt-32 pb-12 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
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
            class="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            {{ category }}
          </span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          {{ title }}
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-blue-100 text-sm">
          <div>{{ date }}</div>
          <div>•</div>
          <div>{{ readTime }}</div>
          <div>•</div>
          <div>2.1K views</div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div class="grid lg:grid-cols-3 gap-10">
        <article class="lg:col-span-2">
          <section class="bg-white rounded-2xl shadow-xl p-8 md:p-12">

            <aside
              class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-10"
              aria-label="Article Summary"
            >
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                What You'll Learn
              </h2>
              <ul class="space-y-2 text-gray-700 list-disc pl-5">
                <li>Top AI tools for business productivity</li>
                <li>How AI can automate repetitive tasks</li>
                <li>AI trends to watch in 2025</li>
              </ul>
            </aside>

            <div class="prose prose-lg max-w-none">
              <p class="text-xl text-gray-700 leading-relaxed mb-6">
                AI is transforming businesses across industries. From automating
                repetitive tasks to generating creative content, AI tools can
                boost productivity and efficiency.
              </p>

              <h2 class="text-2xl font-bold mt-8 mb-4">
                Top 10 AI Tools You Should Know
              </h2>

              <ol class="list-decimal list-inside space-y-8 pl-0">
                <li>
                  <h3 class="text-xl font-bold text-blue-700 mt-0 mb-1">
                    ChatGPT Enterprise
                  </h3>
                  <p class="text-gray-700 ml-5">
                    An AI chatbot for automating customer support and content
                    creation.
                  </p>
                </li>
                <li>
                  <h3 class="text-xl font-bold text-blue-700 mt-0 mb-1">
                    Jasper AI
                  </h3>
                  <p class="text-gray-700 ml-5">
                    Generates marketing copy, blog posts, and social media
                    content quickly.
                  </p>
                </li>
                <li>
                  <h3 class="text-xl font-bold text-blue-700 mt-0 mb-1">
                    MidJourney
                  </h3>
                  <p class="text-gray-700 ml-5">
                    AI-powered image generation for designers and marketers.
                  </p>
                </li>
                <li>
                  <h3 class="text-xl font-bold text-blue-700 mt-0 mb-1">
                    Grammarly AI
                  </h3>
                  <p class="text-gray-700 ml-5">
                    Advanced writing assistant to improve clarity and tone in
                    business communication.
                  </p>
                </li>
                <li>
                  <h3 class="text-xl font-bold text-blue-700 mt-0 mb-1">
                    Notion AI
                  </h3>
                  <p class="text-gray-700 ml-5">
                    AI-enhanced productivity app for notes, tasks, and project
                    management.
                  </p>
                </li>
                <li>
                  <h3 class="text-xl font-bold text-blue-700 mt-0 mb-1">
                    Synthesia
                  </h3>
                  <p class="text-gray-700 ml-5">
                    Create AI videos with avatars for corporate training or
                    marketing.
                  </p>
                </li>
                <li>
                  <h3 class="text-xl font-bold text-blue-700 mt-0 mb-1">
                    Zapier AI
                  </h3>
                  <p class="text-gray-700 ml-5">
                    Automate workflows between apps using AI triggers.
                  </p>
                </li>
                <li>
                  <h3 class="text-xl font-bold text-blue-700 mt-0 mb-1">
                    Canva AI
                  </h3>
                  <p class="text-gray-700 ml-5">
                    Design graphics and social media posts using AI templates.
                  </p>
                </li>
                <li>
                  <h3 class="text-xl font-bold text-blue-700 mt-0 mb-1">
                    DALL·E 3
                  </h3>
                  <p class="text-gray-700 ml-5">
                    Generates realistic or creative images from text prompts.
                  </p>
                </li>
                <li>
                  <h3 class="text-xl font-bold text-blue-700 mt-0 mb-1">
                    Copy.ai
                  </h3>
                  <p class="text-gray-700 ml-5">
                    AI content generator for blogs, ads, and social posts.
                  </p>
                </li>
              </ol>

              <h2 class="text-2xl font-bold mt-12 mb-4">Conclusion</h2>
              <p class="text-gray-700 leading-relaxed">
                Businesses embracing AI tools can save time, reduce costs, and
                enhance creativity. Try these tools to stay competitive in 2025.
              </p>
            </div>
          </section>
        </article>

        <aside class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-xl">
              <h3 class="text-xl font-bold text-gray-900 mb-4">
                Related Posts
              </h3>
              <div class="space-y-4">
                <a href="#" class="block group">
                  <h4
                    class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                  >
                    Best Laptops for Productivity 2025
                  </h4>
                  <p class="text-sm text-gray-600">5 min read</p>
                </a>
                <a href="#" class="block group">
                  <h4
                    class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                  >
                    Top AI Trends in 2025
                  </h4>
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

const title = "Top 10 AI Tools Transforming Businesses in 2025";
const date = "November 27, 2025";
const readTime = "6 min read";
const category = "AI Tools";
</script>

<script>
// 🚨 CRITICAL: The listing page reads this exact object.
export const postMetadata = {
    title: "Top 10 AI Tools Transforming Businesses in 2025",
    summary: "Discover the best AI tools that are revolutionizing business productivity in 2025.",
    date: "November 27, 2025",
    readTime: "6 min read",
    category: "AI Tools"
};
</script>