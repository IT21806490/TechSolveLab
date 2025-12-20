<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
    <div class="container mx-auto max-w-6xl">
      <!-- Header and Upload Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          ⏱️ GTFS Stop Times Generator
        </h1>
        <p class="text-gray-600">
          Upload your GTFS files, validate, and generate stop_times.txt with automatic time calculations.
        </p>
      </div>

      <!-- Upload GTFS File -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          1. Upload GTFS ZIP File
        </h2>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
          <input
            type="file"
            accept=".zip"
            @change="handleGTFSFile"
            id="gtfsFileInput"
            class="hidden"
          />
          <label for="gtfsFileInput" class="cursor-pointer flex flex-col items-center">
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span class="text-lg font-medium text-gray-700 mb-1">Click to upload GTFS ZIP file</span>
            <span class="text-sm text-gray-500">ZIP file containing all GTFS .txt files</span>
          </label>
        </div>

        <!-- Feedback During File Processing -->
        <div v-if="isProcessing" class="text-center mt-4 text-gray-500">
          <svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16M4 12h16M4 20h16"></path>
          </svg>
          <p>Processing your GTFS file...</p>
        </div>

        <!-- Uploaded File Information -->
        <div v-if="gtfsFileName" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-green-800 font-medium">{{ gtfsFileName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Validation Report -->
      <div v-if="report" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          2. Validation Report
        </h2>
        <pre class="bg-gray-50 p-4 rounded-lg text-sm">{{ report }}</pre>
        <button @click="downloadReport" class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all">
          Download Report
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Reactive state for file name, validation report, and processing status
const gtfsFileName = ref('');
const report = ref('');
const isProcessing = ref(false);
const worker = new Worker(new URL('./gtfsWorker.js', import.meta.url));

// Handle GTFS file upload and validation using Web Worker
function handleGTFSFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  gtfsFileName.value = file.name;
  isProcessing.value = true;  // Show loading indicator

  // Read the file as a binary buffer
  const reader = new FileReader();
  reader.onload = function (e) {
    const zipBuffer = e.target.result;

    // Send the buffer to the Web Worker for background processing
    worker.postMessage({ zipBuffer });
  };

  reader.readAsArrayBuffer(file);

  // Listen for messages from the worker
  worker.onmessage = function (e) {
    const { missingFiles, isValid, error } = e.data;

    isProcessing.value = false;  // Hide loading indicator

    if (error) {
      report.value = `Error: ${error}`;
    } else if (isValid) {
      report.value = 'GTFS ZIP file is valid!';
    } else {
      report.value = `Validation Report:\nMissing files:\n${missingFiles.join('\n')}`;
    }
  };

  // Error handling for worker
  worker.onerror = function (error) {
    isProcessing.value = false;
    report.value = `Worker error: ${error.message}`;
  };
}

// Download the validation report as a text file
function downloadReport() {
  const blob = new Blob([report.value], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'validation_report.txt';
  link.click();
}
</script>

<style scoped>
/* Custom styles for the app */
</style>
