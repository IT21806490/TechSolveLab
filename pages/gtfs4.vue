<template>
  <div class="container mx-auto max-w-4xl py-8">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">
      ⏱️ GTFS File Validator
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

    <!-- Validation Results -->
    <div v-if="validationResults && !errorMessage" class="mt-4">
      <h2 class="text-xl font-semibold text-gray-800">Validation Results:</h2>
      <ul class="mt-4">
        <li v-for="(status, file) in validationResults" :key="file" class="py-1">
          <span :style="status.valid ? 'color: green' : 'color: red'">{{ file }}: {{ status.message }}</span>
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
const validationResults = ref({});

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];

  if (!file) return;

  // Start processing
  isProcessing.value = true;
  errorMessage.value = '';
  validationResults.value = {};

  // Create a web worker to handle ZIP processing
  const workerBlob = new Blob([`
    importScripts('https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js');

    onmessage = function (event) {
      const file = event.data;
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const zipData = e.target.result;
        
        try {
          const zip = new JSZip();
          zip.loadAsync(zipData).then(function(zip) {
            const requiredFiles = ['stops.txt', 'routes.txt', 'trips.txt', 'shapes.txt', 'calendar.txt'];
            const filesStatus = {};
            const validationResults = {};

            // Check if required files are present
            requiredFiles.forEach(fileName => {
              if (zip.files[fileName]) {
                filesStatus[fileName] = { valid: true, message: 'Found' };
              } else {
                filesStatus[fileName] = { valid: false, message: 'Missing' };
              }
            });

            // Validate each file's data
            function validateFileData(fileName, fileContent) {
              const rows = fileContent.split('\n').map(row => row.trim());
              const header = rows[0].split(',');
              const errors = [];

              switch (fileName) {
                case 'stops.txt':
                  const stopIdIndex = header.indexOf('stop_id');
                  const stopNameIndex = header.indexOf('stop_name');
                  if (stopIdIndex === -1 || stopNameIndex === -1) {
                    errors.push('Missing required columns: stop_id, stop_name');
                  }
                  // Add more validations as needed
                  break;

                case 'routes.txt':
                  const routeIdIndex = header.indexOf('route_id');
                  const routeShortNameIndex = header.indexOf('route_short_name');
                  if (routeIdIndex === -1 || routeShortNameIndex === -1) {
                    errors.push('Missing required columns: route_id, route_short_name');
                  }
                  break;

                case 'trips.txt':
                  const tripIdIndex = header.indexOf('trip_id');
                  const routeIdTripIndex = header.indexOf('route_id');
                  if (tripIdIndex === -1 || routeIdTripIndex === -1) {
                    errors.push('Missing required columns: trip_id, route_id');
                  }
                  break;

                // Additional file checks for shapes.txt, calendar.txt, etc.
              }

              return errors;
            }

            // Validate all files
            for (let fileName in zip.files) {
              const file = zip.files[fileName];
              if (requiredFiles.includes(fileName)) {
                file.async('text').then(function(content) {
                  const validationErrors = validateFileData(fileName, content);
                  if (validationErrors.length > 0) {
                    validationResults[fileName] = { valid: false, message: validationErrors.join(', ') };
                  } else {
                    validationResults[fileName] = { valid: true, message: 'Valid data' };
                  }

                  // Send results when done
                  postMessage({ status: 'success', filesStatus: filesStatus, validationResults: validationResults });
                });
              }
            }
          }).catch((err) => {
            postMessage({ status: 'error', message: 'Error parsing the ZIP file. It may be corrupted or invalid.' });
          });
        } catch (error) {
          postMessage({ status: 'error', message: 'Unable to extract or parse the ZIP file.' });
        }
      };

      reader.readAsArrayBuffer(file);
    };
  `], { type: 'application/javascript' });

  const worker = new Worker(URL.createObjectURL(workerBlob));

  // When the worker sends a message back
  worker.onmessage = function (e) {
    const result = e.data;
    isProcessing.value = false;

    if (result.status === 'error') {
      errorMessage.value = result.message;
    } else {
      validationResults.value = result.validationResults;
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
