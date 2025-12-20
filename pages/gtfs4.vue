<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
    <div class="container mx-auto max-w-6xl">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              ⏱️ GTFS File Validator
            </h1>
            <p class="text-gray-600">
              Upload your GTFS ZIP files for fast validation
            </p>
          </div>
        </div>
      </div>

      <!-- Step 1: Upload ZIP file -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          1. Upload GTFS ZIP File
        </h2>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
          <input
            type="file"
            accept=".zip"
            @change="handleFileUpload"
            id="gtfsFileInput"
            class="hidden"
          />
          <label
            for="gtfsFileInput"
            class="cursor-pointer flex flex-col items-center"
          >
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span class="text-lg font-medium text-gray-700 mb-1">
              Click to upload GTFS ZIP file
            </span>
          </label>
        </div>

        <!-- Loading Status -->
        <div v-if="loading" class="mt-4 text-gray-500">Processing file...</div>
        
        <!-- Results -->
        <div v-if="validationResults" class="mt-4">
          <h3 class="text-xl font-semibold text-gray-800">Validation Results</h3>
          <pre class="bg-gray-100 p-4 rounded-lg mt-2">{{ validationResults }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Reactive references for loading and results
const loading = ref(false);
const validationResults = ref(null);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Show loading message
  loading.value = true;
  validationResults.value = null;

  // Create a file reader
  const reader = new FileReader();
  
  // When the file is loaded, process it
  reader.onload = function(event) {
    const zipBuffer = event.target.result;

    try {
      processZip(zipBuffer);
    } catch (error) {
      loading.value = false;
      validationResults.value = `Error: ${error.message}`;
    }
  };

  // Read the uploaded ZIP file as ArrayBuffer
  reader.readAsArrayBuffer(file);
}

async function processZip(buffer) {
  // Create a Blob from the ArrayBuffer
  const blob = new Blob([buffer]);
  const zipContent = await unzipBlob(blob);

  let results = {
    errors: [],
    fileStructure: {
      stops: false,
      routes: false,
      trips: false
    }
  };

  // List of required GTFS files
  const requiredFiles = ['stops.txt', 'routes.txt', 'trips.txt'];

  // Check if each required file exists
  for (const fileName of requiredFiles) {
    if (zipContent[fileName]) {
      results.fileStructure[fileName.replace('.txt', '')] = true;
    } else {
      results.errors.push(`${fileName} not found`);
    }
  }

  // Validate content of the GTFS files
  await validateFile(zipContent, 'stops.txt', results);
  await validateFile(zipContent, 'routes.txt', results);
  await validateFile(zipContent, 'trips.txt', results);

  // Show the validation result
  loading.value = false;
  validationResults.value = JSON.stringify(results, null, 2);
}

// Extracts files from the zip blob
function unzipBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const zip = new JSZip();
        zip.loadAsync(event.target.result).then(zipFiles => {
          resolve(zipFiles.files);
        }).catch(err => {
          reject('Error unzipping the file');
        });
      } catch (err) {
        reject('Error reading ZIP file');
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}

// Validates the GTFS files asynchronously
async function validateFile(zipContent, fileName, results) {
  const file = zipContent[fileName];
  if (!file) return;

  const content = await file.async('text');

  if (fileName === 'stops.txt' && !content.includes('stop_id')) {
    results.errors.push('Missing stop_id column in stops.txt');
  }
  if (fileName === 'routes.txt' && !content.includes('route_id')) {
    results.errors.push('Missing route_id column in routes.txt');
  }
  if (fileName === 'trips.txt' && !content.includes('trip_id')) {
    results.errors.push('Missing trip_id column in trips.txt');
  }
}
</script>

<style scoped>
/* Custom styles here if needed */
</style>
