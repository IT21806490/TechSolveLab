<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <!-- Hero Section -->
    <section class="pt-32 pb-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-4">Get in Touch</h1>
        <p class="text-xl md:text-2xl text-blue-100">
          Have questions? We'd love to hear from you.
        </p>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-6 py-16">
      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
          <p class="text-gray-600 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-semibold text-gray-700 mb-2">
                Subject *
              </label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="tutorial">Tutorial Request</option>
                <option value="collaboration">Collaboration</option>
                <option value="feedback">Feedback</option>
                <option value="bug">Report an Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-semibold text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="6"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>

            <div class="flex items-start">
              <input
                id="subscribe"
                v-model="form.subscribe"
                type="checkbox"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="subscribe" class="ml-3 text-sm text-gray-600">
                I'd like to receive updates and newsletters from TechSolveLab
              </label>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span v-if="!isSubmitting">Send Message</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            </button>

            <p v-if="submitMessage" :class="submitSuccess ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium text-center">
              {{ submitMessage }}
            </p>
          </form>
        </div>

        <!-- Contact Information & FAQ -->
        <div class="space-y-8">
          <!-- Contact Cards -->
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-gray-900">Email</h4>
                  <a href="mailto:contact@techsolvelab.com" class="text-blue-600 hover:text-blue-700">
                    contact@techsolvelab.com
                  </a>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-gray-900">Response Time</h4>
                  <p class="text-gray-600">Within 24 hours</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="font-semibold text-gray-900">Location</h4>
                  <p class="text-gray-600">Available Worldwide</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
            <h3 class="text-2xl font-bold mb-4">Follow Us</h3>
            <p class="text-blue-100 mb-6">Stay connected for the latest tutorials and tips</p>
            <div class="grid grid-cols-2 gap-4">
              <a href="https://twitter.com/techsolvelab" target="_blank" rel="noopener" class="flex items-center justify-center p-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all">
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                <span class="font-semibold">Twitter</span>
              </a>
              <a href="https://github.com/techsolvelab" target="_blank" rel="noopener" class="flex items-center justify-center p-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all">
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span class="font-semibold">GitHub</span>
              </a>
              <a href="https://linkedin.com/company/techsolvelab" target="_blank" rel="noopener" class="flex items-center justify-center p-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all">
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                <span class="font-semibold">LinkedIn</span>
              </a>
              <a href="https://youtube.com/@techsolvelab" target="_blank" rel="noopener" class="flex items-center justify-center p-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all">
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span class="font-semibold">YouTube</span>
              </a>
            </div>
          </div>

          <!-- FAQ -->
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Quick Answers</h3>
            <div class="space-y-4">
              <details class="group">
                <summary class="font-semibold text-gray-900 cursor-pointer flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  How can I request a tutorial?
                  <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p class="text-gray-600 mt-2 px-4 pb-4">
                  Use the form above and select "Tutorial Request" as the subject. Tell us what you'd like to learn and we'll consider it for future content.
                </p>
              </details>

              <details class="group">
                <summary class="font-semibold text-gray-900 cursor-pointer flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  Do you offer 1-on-1 consulting?
                  <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p class="text-gray-600 mt-2 px-4 pb-4">
                  Yes! For consulting inquiries, please contact us with details about your project and we'll get back to you with our availability and rates.
                </p>
              </details>

              <details class="group">
                <summary class="font-semibold text-gray-900 cursor-pointer flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  Can I contribute content?
                  <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p class="text-gray-600 mt-2 px-4 pb-4">
                  We welcome guest contributors! Reach out with your topic idea and writing samples, and we'll review your proposal.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';

// SEO Meta Tags
useHead({
  title: 'Contact Us - Get Help with Web Development | TechSolveLab',
  meta: [
    { name: 'description', content: 'Contact TechSolveLab for web development questions, tutorial requests, or collaboration opportunities. We respond within 24 hours.' },
    { name: 'keywords', content: 'contact techsolvelab, web development help, programming questions, tutorial request' },
  ]
});

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  subscribe: false
});

const isSubmitting = ref(false);
const submitMessage = ref('');
const submitSuccess = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitMessage.value = '';

  try {
    // Replace with your actual form submission logic
    // This could be a serverless function, API endpoint, or email service
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay

    submitMessage.value = 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.';
    submitSuccess.value = true;
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
      subscribe: false
    };

    // Clear success message after 5 seconds
    setTimeout(() => {
      submitMessage.value = '';
    }, 5000);
  } catch (error) {
    submitMessage.value = 'Oops! Something went wrong. Please try again or email us directly.';
    submitSuccess.value = false;
  } finally {
    isSubmitting.value = false;
  }
};
</script>