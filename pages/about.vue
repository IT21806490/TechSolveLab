<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <section class="pt-32 pb-16 px-6 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6">About TechSolveLab</h1>
        <p class="text-xl md:text-2xl text-blue-100 leading-relaxed">
          Empowering readers worldwide with practical tech insights and expert analysis since 2023
        </p>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-6 py-16">
      <section class="mb-20">
        <div class="bg-white rounded-2xl shadow-xl p-10 md:p-14">
          <div class="max-w-3xl mx-auto">
            <h2 class="text-4xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
            <p class="text-xl text-gray-700 leading-relaxed mb-6">
              At TechSolveLab, we believe that understanding modern technology should be accessible, practical, and clear. Our mission is to create comprehensive, well-researched **blog posts** that help readers solve real-world **tech challenges**, master their gadgets, and stay secure online.
            </p>
            <p class="text-lg text-gray-600 leading-relaxed">
              We're committed to providing high-quality content that cuts through the complexity, offering **deep insights** into trends like AI, 5G, and cybersecurity with clarity and practical applicability.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-20">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-4">What We Offer</h2>
        <p class="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
          Comprehensive resources designed to accelerate your understanding of technology
        </p>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">In-Depth Blog Posts</h3>
            <p class="text-gray-600 leading-relaxed">
              Detailed articles that walk you through every concept, from basic gadget usage to advanced cybersecurity strategies, with clear explanations.
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Fast Tech Solutions</h3>
            <p class="text-gray-600 leading-relaxed">
              Troubleshooting guides for common hardware, software, and networking issues. Get your tech working quickly with our tested fixes.
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Expert Insights & Reviews</h3>
            <p class="text-gray-600 leading-relaxed">
              Unbiased reviews of the latest gadgets, analysis of market trends (AI, 5G), and actionable tips for future-proofing your setup.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-20">
        <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-10 md:p-14 text-white">
          <h2 class="text-4xl font-bold mb-8 text-center">Tech Topics We Cover</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex items-center space-x-3 bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all">
              <span class="text-3xl">🤖</span>
              <div>
                <h4 class="font-bold text-lg">Artificial Intelligence</h4>
                <p class="text-blue-100 text-sm">Tools, Trends, Ethical Implications, and Use Cases</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all">
              <span class="text-3xl">🔒</span>
              <div>
                <h4 class="font-bold text-lg">Cybersecurity</h4>
                <p class="text-blue-100 text-sm">VPNs, Data Privacy, Scam Prevention, and Digital Safety</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all">
              <span class="text-3xl">📱</span>
              <div>
                <h4 class="font-bold text-lg">Gadgets & Hardware</h4>
                <p class="text-blue-100 text-sm">Product Reviews, Buyer Guides, and Setup Tutorials</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all">
              <span class="text-3xl">📶</span>
              <div>
                <h4 class="font-bold text-lg">Connectivity & 5G</h4>
                <p class="text-blue-100 text-sm">Internet Speeds, Router Setup, and Wireless Technology</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all">
              <span class="text-3xl">💡</span>
              <div>
                <h4 class="font-bold text-lg">Tech Insights</h4>
                <p class="text-blue-100 text-sm">Future Trends, Industry Analysis, and Emerging Technologies</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all">
              <span class="text-3xl">💻</span>
              <div>
                <h4 class="font-bold text-lg">Productivity & Software</h4>
                <p class="text-blue-100 text-sm">Best Apps, Workflow Tips, and Operating System Guides</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-20">
        <div class="bg-white rounded-2xl shadow-xl p-10">
          <h2 class="text-4xl font-bold text-center text-gray-900 mb-12">Our Impact</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-5xl font-extrabold text-blue-600 mb-2">500+</div>
              <div class="text-gray-600 font-medium">Blog Posts Published</div>
            </div>
            <div class="text-center">
              <div class="text-5xl font-extrabold text-green-600 mb-2">50K+</div>
              <div class="text-gray-600 font-medium">Monthly Readers</div>
            </div>
            <div class="text-center">
              <div class="text-5xl font-extrabold text-purple-600 mb-2">100+</div>
              <div class="text-gray-600 font-medium">Countries Reached</div>
            </div>
            <div class="text-center">
              <div class="text-5xl font-extrabold text-orange-600 mb-2">4.9★</div>
              <div class="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-20">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-600">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Quality First</h3>
            <p class="text-gray-600 leading-relaxed">
              Every article and review is thoroughly researched, tested, and fact-checked to ensure accuracy and relevance. We never compromise on content quality.
            </p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-600">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Actionable Knowledge</h3>
            <p class="text-gray-600 leading-relaxed">
              We focus on practical applications and clear guidance that you can immediately use to improve your digital life or solve a tech problem.
            </p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-600">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Community Driven</h3>
            <p class="text-gray-600 leading-relaxed">
              We listen to our readers and create content based on your questions, the tech challenges you face, and the trends you want to understand.
            </p>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-8 border-l-4 border-orange-600">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Always Up-to-Date</h3>
            <p class="text-gray-600 leading-relaxed">
              Technology evolves rapidly. We regularly update our content to reflect the latest product releases, security threats, and industry shifts.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-12 text-center text-white">
        <h2 class="text-4xl font-bold mb-4">Join Our Community</h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and get weekly **tech blog posts**, tips, and resources delivered straight to your inbox
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email"
            class="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
          <button class="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
            Subscribe Free
          </button>
        </div>
        <p class="text-sm mt-4 text-blue-200">Join 50,000+ readers. Unsubscribe anytime.</p>
      </section>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';

// 💡 UPDATED SEO Meta Tags for Tech Niche
useHead({
  title: 'About TechSolveLab - Expert Tech Insights, Guides & Reviews',
  meta: [
    { name: 'description', content: 'Learn about TechSolveLab\'s mission to provide high-quality technology insights. Discover our values, the tech topics we cover (AI, 5G, Cyber), and how we help 50,000+ readers worldwide.' },
    { name: 'keywords', content: 'about techsolvelab, tech blog, technology reviews, AI education, cybersecurity guides, gadget news' },
    { property: 'og:title', content: 'About TechSolveLab - Technology Education' },
    { property: 'og:description', content: 'Empowering readers worldwide with practical tech insights and expert analysis.' },
  ]
});
</script>

<style scoped>
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}
</style>