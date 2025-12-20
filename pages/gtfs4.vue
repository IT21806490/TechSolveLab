<template>
  <div class="container mx-auto max-w-4xl py-8">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">
      ⏱️ GTFS File Checker
    </h1>

    <!-- File Upload -->
    <div>
      <label for="fileInput" class="block text-lg font-medium text-gray-700">
        Upload GTFS ZIP File
      </label>
      <input
        type="file"
        id="fileInput"
        accept=".zip"
        @change="handleFileUpload"
        class="mt-2 px-4 py-2 border border-gray-300 rounded-lg"
      />
    </div>

    <!-- Processing Message -->
    <div v-if="isProcessing" class="mt-4">
      <p class="text-gray-600">Processing your GTFS file...</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-4 text-red-600">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- File Check Results -->
    <div v-if="fileStatus && !errorMessage" class="mt-4">
      <h2 class="text-xl font-semibold text-gray-800">File Check Results:</h2>
      <ul class="mt-4">
        <li v-for="(status, file) in fileStatus" :key="file" class="py-1">
          <span :style="status === 'missing' ? 'color: red' : 'color: green'">{{ file }}: {{ status }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// State variables
const isProcessing = ref(false);
const errorMessage = ref('');
const fileStatus = ref({});

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];

  if (!file) return;

  // Start processing
  isProcessing.value = true;
  errorMessage.value = '';
  fileStatus.value = {};

  // Create a web worker to handle ZIP processing
  const worker = new Worker(URL.createObjectURL(new Blob([`
    onmessage = function (event) {
      const file = event.data;
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const zipData = e.target.result;
        
        try {
          const zip = new JSZip();
          zip.loadAsync(zipData).then(function(zip) {
            const requiredFiles = ['stops.txt', 'routes.txt', 'trips.txt'];
            const filesStatus = {};

            // Check if required files are present
            requiredFiles.forEach(fileName => {
              if (zip.files[fileName]) {
                filesStatus[fileName] = 'found';
              } else {
                filesStatus[fileName] = 'missing';
              }
            });

            postMessage({ status: 'success', files: filesStatus });
          });
        } catch (error) {
          postMessage({ status: 'error', message: 'Unable to extract or parse the ZIP file.' });
        }
      };

      reader.readAsArrayBuffer(file);
    };
  `], { type: 'application/javascript' })));

  // When the worker sends a message back
  worker.onmessage = function (e) {
    const result = e.data;
    isProcessing.value = false;

    if (result.status === 'error') {
      errorMessage.value = result.message;
    } else {
      fileStatus.value = result.files;
    }
  };

  // Post the file to the worker
  worker.postMessage(file);
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  font-size: 16px;
}

input[type="file"] {
  display: block;
  margin-top: 10px;
}

.text-red-600 {
  color: #ef4444;
}

.text-green-600 {
  color: #10B981;
}
</style>
