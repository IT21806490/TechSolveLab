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
              Upload your GTFS ZIP files for fast validation - Results in seconds!
            </p>
          </div>
          <div v-if="fileName" class="bg-purple-100 px-4 py-2 rounded-lg">
            <p class="text-sm text-purple-800 font-medium">{{ fileName }}</p>
          </div>
        </div>
      </div>

      <!-- Step 1: Upload ZIP file -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          📤 Upload GTFS ZIP File
        </h2>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
             @dragover.prevent="isDragging = true"
             @dragleave.prevent="isDragging = false"
             @drop.prevent="handleDrop"
             :class="{ 'border-purple-500 bg-purple-50': isDragging }">
          <input
            type="file"
            accept=".zip"
            @change="handleFileUpload"
            id="gtfsFileInput"
            class="hidden"
            ref="fileInput"
          />
          <label
            for="gtfsFileInput"
            class="cursor-pointer flex flex-col items-center"
          >
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span class="text-lg font-medium text-gray-700 mb-1">
              Click to upload or drag & drop GTFS ZIP file
            </span>
            <span class="text-sm text-gray-500">Maximum file size: 100MB</span>
          </label>
        </div>

        <!-- Loading Status -->
        <div v-if="loading" class="mt-6">
          <div class="flex items-center justify-center space-x-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span class="text-gray-700 font-medium">Processing file... This should only take a few seconds!</span>
          </div>
          <div class="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm text-purple-800">{{ processingStatus }}</p>
          </div>
        </div>
        
        <!-- Results Summary -->
        <div v-if="validationResults && !loading" class="mt-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-2xl font-bold text-gray-800">Validation Results</h3>
            <div v-if="validationResults.valid" class="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-green-800 font-semibold">Valid GTFS</span>
            </div>
            <div v-else class="flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-red-800 font-semibold">Invalid GTFS</span>
            </div>
          </div>

          <!-- File Structure -->
          <div class="bg-gray-50 rounded-lg p-6 mb-4">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">📁 File Structure</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div v-for="(status, file) in validationResults.fileStructure" :key="file" 
                   class="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                <svg v-if="status === 'present'" class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg v-else-if="status === 'optional'" class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ file }}</p>
                  <p v-if="validationResults.fileSizes[file]" class="text-xs text-gray-500">
                    {{ formatFileSize(validationResults.fileSizes[file]) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Errors -->
          <div v-if="validationResults.errors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <h4 class="text-lg font-semibold text-red-800 mb-3 flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Errors ({{ validationResults.errors.length }})
            </h4>
            <ul class="space-y-2">
              <li v-for="(error, index) in validationResults.errors" :key="index" class="flex items-start space-x-2">
                <span class="text-red-600 font-bold">•</span>
                <span class="text-red-800">{{ error }}</span>
              </li>
            </ul>
          </div>

          <!-- Warnings -->
          <div v-if="validationResults.warnings.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
            <h4 class="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              Warnings ({{ validationResults.warnings.length }})
            </h4>
            <ul class="space-y-2">
              <li v-for="(warning, index) in validationResults.warnings" :key="index" class="flex items-start space-x-2">
                <span class="text-yellow-600 font-bold">•</span>
                <span class="text-yellow-800">{{ warning }}</span>
              </li>
            </ul>
          </div>

          <!-- Statistics -->
          <div v-if="validationResults.statistics" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-blue-800 mb-3">📊 Statistics</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="(value, key) in validationResults.statistics" :key="key" class="bg-white p-4 rounded-lg shadow-sm">
                <p class="text-2xl font-bold text-blue-600">{{ value }}</p>
                <p class="text-sm text-gray-600 capitalize">{{ key.replace(/_/g, ' ') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
        <h3 class="text-xl font-bold mb-3">⚡ Why This Validator is Super Fast</h3>
        <ul class="space-y-2">
          <li class="flex items-start space-x-2">
            <span>✓</span>
            <span>Client-side processing - No server uploads needed</span>
          </li>
          <li class="flex items-start space-x-2">
            <span>✓</span>
            <span>Optimized validation algorithms</span>
          </li>
          <li class="flex items-start space-x-2">
            <span>✓</span>
            <span>Results in seconds, not minutes</span>
          </li>
          <li class="flex items-start space-x-2">
            <span>✓</span>
            <span>No data leaves your browser - 100% private</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);
const validationResults = ref(null);
const fileName = ref('');
const isDragging = ref(false);
const processingStatus = ref('Reading ZIP file...');
const fileInput = ref(null);

function handleDrop(event) {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0 && files[0].name.endsWith('.zip')) {
    processFile(files[0]);
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  processFile(file);
}

async function processFile(file) {
  fileName.value = file.name;
  loading.value = true;
  validationResults.value = null;
  processingStatus.value = 'Reading ZIP file...';

  try {
    const arrayBuffer = await file.arrayBuffer();
    await processZip(arrayBuffer);
  } catch (error) {
    loading.value = false;
    validationResults.value = {
      errors: [`Error processing file: ${error.message}`],
      warnings: [],
      fileStructure: {},
      fileSizes: {},
      valid: false
    };
  }
}

async function processZip(buffer) {
  try {
    processingStatus.value = 'Extracting files from ZIP...';
    
    // Load JSZip from CDN
    if (!window.JSZip) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      document.head.appendChild(script);
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    const JSZip = window.JSZip;
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(buffer);

    let results = {
      errors: [],
      warnings: [],
      fileStructure: {},
      fileSizes: {},
      statistics: {},
      valid: true
    };

    processingStatus.value = 'Checking file structure...';

    // Required GTFS files
    const requiredFiles = ['agency.txt', 'stops.txt', 'routes.txt', 'trips.txt', 'stop_times.txt'];
    const optionalFiles = ['calendar.txt', 'calendar_dates.txt', 'fare_attributes.txt', 'fare_rules.txt', 'shapes.txt', 'frequencies.txt', 'transfers.txt', 'pathways.txt', 'levels.txt', 'feed_info.txt'];

    // Check required files
    for (const file of requiredFiles) {
      if (zipContent.files[file]) {
        results.fileStructure[file] = 'present';
        const content = await zipContent.files[file].async('text');
        results.fileSizes[file] = content.length;
      } else {
        results.fileStructure[file] = 'missing';
        results.errors.push(`Required file missing: ${file}`);
        results.valid = false;
      }
    }

    // Check optional files
    for (const file of optionalFiles) {
      if (zipContent.files[file]) {
        results.fileStructure[file] = 'optional';
        const content = await zipContent.files[file].async('text');
        results.fileSizes[file] = content.length;
      }
    }

    processingStatus.value = 'Validating file contents...';

    // Validate required files content
    await validateAgency(zipContent, results);
    await validateStops(zipContent, results);
    await validateRoutes(zipContent, results);
    await validateTrips(zipContent, results);
    await validateStopTimes(zipContent, results);

    // Calculate statistics
    processingStatus.value = 'Calculating statistics...';
    await calculateStatistics(zipContent, results);

    loading.value = false;
    validationResults.value = results;
  } catch (error) {
    loading.value = false;
    validationResults.value = {
      errors: [`Error processing ZIP: ${error.message}`],
      warnings: [],
      fileStructure: {},
      fileSizes: {},
      valid: false
    };
  }
}

async function validateAgency(zipContent, results) {
  const file = zipContent.files['agency.txt'];
  if (!file) return;

  const content = await file.async('text');
  const lines = content.split('\n');
  const header = lines[0].toLowerCase();

  const requiredColumns = ['agency_name', 'agency_url', 'agency_timezone'];
  
  for (const col of requiredColumns) {
    if (!header.includes(col)) {
      results.errors.push(`Missing required column '${col}' in agency.txt`);
      results.valid = false;
    }
  }

  if (lines.length < 2) {
    results.errors.push('agency.txt has no data rows');
    results.valid = false;
  }
}

async function validateStops(zipContent, results) {
  const file = zipContent.files['stops.txt'];
  if (!file) return;

  const content = await file.async('text');
  const lines = content.split('\n');
  const header = lines[0].toLowerCase();

  const requiredColumns = ['stop_id', 'stop_name', 'stop_lat', 'stop_lon'];
  
  for (const col of requiredColumns) {
    if (!header.includes(col)) {
      results.errors.push(`Missing required column '${col}' in stops.txt`);
      results.valid = false;
    }
  }

  // Check for duplicate stop_ids
  const stopIds = new Set();
  const headerArray = lines[0].split(',');
  const stopIdIndex = headerArray.findIndex(h => h.toLowerCase().includes('stop_id'));

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = lines[i].split(',');
    const stopId = cols[stopIdIndex]?.trim();
    if (stopId && stopIds.has(stopId)) {
      results.warnings.push(`Duplicate stop_id found: ${stopId}`);
    }
    stopIds.add(stopId);
  }
}

async function validateRoutes(zipContent, results) {
  const file = zipContent.files['routes.txt'];
  if (!file) return;

  const content = await file.async('text');
  const lines = content.split('\n');
  const header = lines[0].toLowerCase();

  const requiredColumns = ['route_id', 'route_short_name', 'route_long_name', 'route_type'];
  
  for (const col of requiredColumns) {
    if (!header.includes(col)) {
      results.errors.push(`Missing required column '${col}' in routes.txt`);
      results.valid = false;
    }
  }
}

async function validateTrips(zipContent, results) {
  const file = zipContent.files['trips.txt'];
  if (!file) return;

  const content = await file.async('text');
  const lines = content.split('\n');
  const header = lines[0].toLowerCase();

  const requiredColumns = ['route_id', 'service_id', 'trip_id'];
  
  for (const col of requiredColumns) {
    if (!header.includes(col)) {
      results.errors.push(`Missing required column '${col}' in trips.txt`);
      results.valid = false;
    }
  }
}

async function validateStopTimes(zipContent, results) {
  const file = zipContent.files['stop_times.txt'];
  if (!file) return;

  const content = await file.async('text');
  const lines = content.split('\n');
  const header = lines[0].toLowerCase();

  const requiredColumns = ['trip_id', 'arrival_time', 'departure_time', 'stop_id', 'stop_sequence'];
  
  for (const col of requiredColumns) {
    if (!header.includes(col)) {
      results.errors.push(`Missing required column '${col}' in stop_times.txt`);
      results.valid = false;
    }
  }
}

async function calculateStatistics(zipContent, results) {
  try {
    // Count stops
    if (zipContent.files['stops.txt']) {
      const content = await zipContent.files['stops.txt'].async('text');
      const lines = content.split('\n').filter(l => l.trim());
      results.statistics.stops = lines.length - 1; // Subtract header
    }

    // Count routes
    if (zipContent.files['routes.txt']) {
      const content = await zipContent.files['routes.txt'].async('text');
      const lines = content.split('\n').filter(l => l.trim());
      results.statistics.routes = lines.length - 1;
    }

    // Count trips
    if (zipContent.files['trips.txt']) {
      const content = await zipContent.files['trips.txt'].async('text');
      const lines = content.split('\n').filter(l => l.trim());
      results.statistics.trips = lines.length - 1;
    }

    // Count agencies
    if (zipContent.files['agency.txt']) {
      const content = await zipContent.files['agency.txt'].async('text');
      const lines = content.split('\n').filter(l => l.trim());
      results.statistics.agencies = lines.length - 1;
    }
  } catch (error) {
    results.warnings.push('Could not calculate all statistics');
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
</script>

<style scoped>
/* Additional custom styles if needed */
.container {
  max-width: 1200px;
}
</style>
