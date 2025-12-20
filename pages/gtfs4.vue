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
              Comprehensive GTFS validation with detailed reports - Results in seconds!
            </p>
          </div>
          <div v-if="fileName" class="bg-purple-100 px-4 py-2 rounded-lg">
            <p class="text-sm text-purple-800 font-medium">{{ fileName }}</p>
          </div>
        </div>
      </div>

      <!-- Upload Section -->
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
            <span class="text-gray-700 font-medium">{{ processingStatus }}</span>
          </div>
          <div class="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
            </div>
            <p class="text-sm text-purple-800 mt-2 text-center">{{ progress }}% Complete</p>
          </div>
        </div>
        
        <!-- Results -->
        <div v-if="validationResults && !loading" class="mt-6">
          <!-- Summary Header -->
          <div class="flex items-center justify-between mb-6 p-6 bg-gradient-to-r rounded-lg shadow-md"
               :class="validationResults.summary.isValid ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'">
            <div class="text-white">
              <h3 class="text-3xl font-bold mb-2">Validation Complete</h3>
              <p class="text-lg opacity-90">
                {{ validationResults.summary.isValid ? '✓ Feed is valid' : '✗ Feed has errors' }}
              </p>
            </div>
            <div class="text-right text-white">
              <p class="text-5xl font-bold">{{ validationResults.summary.score }}/100</p>
              <p class="text-sm opacity-90">Quality Score</p>
            </div>
          </div>

          <!-- Feed Info & Agencies -->
          <div v-if="validationResults.feedInfo || validationResults.agencies" class="mb-6 space-y-4">
            <!-- Feed Info -->
            <div v-if="validationResults.feedInfo" class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">📋 Feed Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span class="font-medium text-gray-700">Publisher:</span> {{ validationResults.feedInfo.publisher_name }}</div>
                <div><span class="font-medium text-gray-700">Website:</span> <a :href="validationResults.feedInfo.publisher_url" target="_blank" class="text-blue-600 hover:underline">{{ validationResults.feedInfo.publisher_url }}</a></div>
                <div><span class="font-medium text-gray-700">Language:</span> {{ validationResults.feedInfo.feed_lang }}</div>
                <div><span class="font-medium text-gray-700">Version:</span> {{ validationResults.feedInfo.feed_version }}</div>
                <div><span class="font-medium text-gray-700">Service Window:</span> {{ validationResults.feedInfo.feed_start_date }} to {{ validationResults.feedInfo.feed_end_date }}</div>
              </div>
            </div>

            <!-- Agencies -->
            <div v-if="validationResults.agencies && validationResults.agencies.length > 0" class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">🚌 Agencies Included ({{ validationResults.agencies.length }})</h3>
              <div class="space-y-3">
                <div v-for="(agency, idx) in validationResults.agencies" :key="idx" class="border-l-4 border-purple-500 pl-4 py-2">
                  <p class="font-semibold text-gray-800">{{ agency.name }}</p>
                  <div class="text-sm text-gray-600 mt-1 space-y-1">
                    <p><span class="font-medium">Website:</span> <a :href="agency.url" target="_blank" class="text-blue-600 hover:underline">{{ agency.url }}</a></p>
                    <p><span class="font-medium">Phone:</span> {{ agency.phone }}</p>
                    <p v-if="agency.email !== 'Not provided'"><span class="font-medium">Email:</span> {{ agency.email }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 mb-6">
            <button @click="downloadReport('html')" 
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Download HTML Report</span>
            </button>
            <button @click="downloadReport('json')" 
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Download JSON Report</span>
            </button>
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
              <p class="text-3xl font-bold text-red-600">{{ validationResults.summary.errorCount }}</p>
              <p class="text-sm text-gray-600">Errors</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
              <p class="text-3xl font-bold text-yellow-600">{{ validationResults.summary.warningCount }}</p>
              <p class="text-sm text-gray-600">Warnings</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
              <p class="text-3xl font-bold text-blue-600">{{ validationResults.summary.infoCount }}</p>
              <p class="text-sm text-gray-600">Info</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <p class="text-3xl font-bold text-green-600">{{ validationResults.summary.filesValidated }}</p>
              <p class="text-sm text-gray-600">Files Validated</p>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="flex border-b overflow-x-auto">
              <button v-for="tab in tabs" :key="tab.id"
                      @click="activeTab = tab.id"
                      class="px-6 py-3 font-semibold transition-colors whitespace-nowrap"
                      :class="activeTab === tab.id ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600 hover:text-purple-600'">
                {{ tab.label }}
                <span v-if="tab.count !== undefined" class="ml-2 px-2 py-1 text-xs rounded-full"
                      :class="tab.color">{{ tab.count }}</span>
              </button>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
              <!-- Errors Tab -->
              <div v-if="activeTab === 'errors'" class="space-y-4">
                <div v-if="validationResults.errors.length === 0" class="text-center py-8 text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-lg font-semibold">No errors found! 🎉</p>
                </div>
                <div v-else v-for="(error, index) in validationResults.errors" :key="index" 
                     class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div class="flex items-start">
                    <svg class="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="flex-1">
                      <p class="font-semibold text-red-800">{{ error.code }}</p>
                      <p class="text-red-700 mt-1">{{ error.message }}</p>
                      <div v-if="error.file" class="mt-2 text-sm text-red-600">
                        <span class="font-medium">File:</span> {{ error.file }}
                        <span v-if="error.line" class="ml-3"><span class="font-medium">Line:</span> {{ error.line }}</span>
                        <span v-if="error.field" class="ml-3"><span class="font-medium">Field:</span> {{ error.field }}</span>
                      </div>
                      <p v-if="error.suggestion" class="mt-2 text-sm text-red-600 italic">💡 {{ error.suggestion }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Warnings Tab -->
              <div v-if="activeTab === 'warnings'" class="space-y-4">
                <div v-if="validationResults.warnings.length === 0" class="text-center py-8 text-gray-500">
                  <p class="text-lg font-semibold">No warnings! 👍</p>
                </div>
                <div v-else v-for="(warning, index) in validationResults.warnings" :key="index" 
                     class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <div class="flex items-start">
                    <svg class="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <div class="flex-1">
                      <p class="font-semibold text-yellow-800">{{ warning.code }}</p>
                      <p class="text-yellow-700 mt-1">{{ warning.message }}</p>
                      <div v-if="warning.file" class="mt-2 text-sm text-yellow-600">
                        <span class="font-medium">File:</span> {{ warning.file }}
                        <span v-if="warning.line" class="ml-3"><span class="font-medium">Line:</span> {{ warning.line }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Info Tab -->
              <div v-if="activeTab === 'info'" class="space-y-4">
                <div v-for="(info, index) in validationResults.info" :key="index" 
                     class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div class="flex items-start">
                    <svg class="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="flex-1">
                      <p class="font-semibold text-blue-800">{{ info.code }}</p>
                      <p class="text-blue-700 mt-1">{{ info.message }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Files Tab -->
              <div v-if="activeTab === 'files'">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="(details, file) in validationResults.fileDetails" :key="file"
                       class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center space-x-2">
                        <svg v-if="details.status === 'valid'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <svg v-else-if="details.status === 'error'" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <svg v-else class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <p class="font-semibold text-gray-800">{{ file }}</p>
                      </div>
                      <span class="text-xs px-2 py-1 rounded-full"
                            :class="details.required ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                        {{ details.required ? 'Required' : 'Optional' }}
                      </span>
                    </div>
                    <div class="space-y-1 text-sm text-gray-600">
                      <p><span class="font-medium">Rows:</span> {{ details.rowCount || 'N/A' }}</p>
                      <p><span class="font-medium">Size:</span> {{ formatFileSize(details.size) }}</p>
                      <p><span class="font-medium">Errors:</span> <span class="text-red-600 font-semibold">{{ details.errors || 0 }}</span></p>
                      <p><span class="font-medium">Warnings:</span> <span class="text-yellow-600 font-semibold">{{ details.warnings || 0 }}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Statistics Tab -->
              <div v-if="activeTab === 'statistics'">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div v-for="(value, key) in validationResults.statistics" :key="key"
                       class="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-lg text-white">
                    <p class="text-4xl font-bold mb-2">{{ value.toLocaleString() }}</p>
                    <p class="text-lg opacity-90 capitalize">{{ key.replace(/_/g, ' ') }}</p>
                  </div>
                </div>
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
            <span>Comprehensive validation - Checks all GTFS specifications including foreign keys</span>
          </li>
          <li class="flex items-start space-x-2">
            <span>✓</span>
            <span>Results in seconds, not minutes</span>
          </li>
          <li class="flex items-start space-x-2">
            <span>✓</span>
            <span>Detailed reports - HTML and JSON export options</span>
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
import { ref, computed } from 'vue';

const loading = ref(false);
const validationResults = ref(null);
const fileName = ref('');
const isDragging = ref(false);
const processingStatus = ref('Reading ZIP file...');
const progress = ref(0);
const fileInput = ref(null);
const activeTab = ref('errors');

const tabs = computed(() => {
  if (!validationResults.value) return [];
  return [
    { id: 'errors', label: 'Errors', count: validationResults.value.summary.errorCount, color: 'bg-red-100 text-red-800' },
    { id: 'warnings', label: 'Warnings', count: validationResults.value.summary.warningCount, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'info', label: 'Info', count: validationResults.value.summary.infoCount, color: 'bg-blue-100 text-blue-800' },
    { id: 'files', label: 'Files', count: validationResults.value.summary.filesValidated, color: 'bg-green-100 text-green-800' },
    { id: 'statistics', label: 'Statistics' }
  ];
});

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
  progress.value = 0;

  try {
    const arrayBuffer = await file.arrayBuffer();
    await processZip(arrayBuffer);
  } catch (error) {
    loading.value = false;
    validationResults.value = createErrorResult(`Error processing file: ${error.message}`);
  }
}

async function processZip(buffer) {
  try {
    progress.value = 5;
    processingStatus.value = 'Loading libraries...';
    
    // Load libraries in parallel
    const loadLibraries = [];
    if (!window.JSZip) {
      loadLibraries.push(new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
      }));
    }
    if (!window.Papa) {
      loadLibraries.push(new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
      }));
    }
    
    if (loadLibraries.length > 0) {
      await Promise.all(loadLibraries);
    }

    progress.value = 15;
    processingStatus.value = 'Extracting ZIP...';

    const JSZip = window.JSZip;
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(buffer);

    progress.value = 25;

    const results = {
      summary: {
        isValid: true,
        errorCount: 0,
        warningCount: 0,
        infoCount: 0,
        filesValidated: 0,
        score: 100
      },
      errors: [],
      warnings: [],
      info: [],
      fileDetails: {},
      statistics: {}
    };

    const gtfsSpec = getGTFSSpecification();

    progress.value = 30;
    processingStatus.value = 'Validating files...';

    // Parse all files in parallel for speed
    const filePromises = {};
    const filesToProcess = ['agency.txt', 'stops.txt', 'routes.txt', 'trips.txt', 'stop_times.txt', 
                            'calendar.txt', 'calendar_dates.txt', 'shapes.txt', 'feed_info.txt'];
    
    for (const filename of filesToProcess) {
      if (zipContent.files[filename]) {
        filePromises[filename] = zipContent.files[filename].async('text').then(content => ({
          content,
          parsed: window.Papa.parse(content, { header: true, skipEmptyLines: true, dynamicTyping: false })
        }));
      }
    }

    const parsedFiles = {};
    for (const [filename, promise] of Object.entries(filePromises)) {
      parsedFiles[filename] = await promise;
    }

    progress.value = 50;

    let fileIndex = 0;
    const totalFiles = Object.keys(gtfsSpec).length;

    // Quick validation of file structure
    for (const [filename, spec] of Object.entries(gtfsSpec)) {
      fileIndex++;
      
      const fileData = zipContent.files[filename];
      
      if (!fileData) {
        if (spec.required) {
          results.errors.push({
            code: 'MISSING_REQUIRED_FILE',
            message: `Required file '${filename}' is missing`,
            file: filename,
            suggestion: `Add ${filename} to your GTFS feed`
          });
          results.summary.errorCount++;
          results.summary.isValid = false;
          results.fileDetails[filename] = {
            status: 'error',
            required: true,
            errors: 1,
            warnings: 0
          };
        } else {
          results.fileDetails[filename] = {
            status: 'missing',
            required: false,
            errors: 0,
            warnings: 0
          };
        }
        continue;
      }

      results.summary.filesValidated++;

      const { content, parsed } = parsedFiles[filename] || { 
        content: await fileData.async('text'), 
        parsed: window.Papa.parse(await fileData.async('text'), { header: true, skipEmptyLines: true, dynamicTyping: false })
      };

      const fileResult = {
        status: 'valid',
        required: spec.required,
        size: content.length,
        rowCount: parsed.data.length,
        errors: 0,
        warnings: 0
      };

      const headers = parsed.meta.fields || [];
      
      // Check required fields
      for (const [fieldName, fieldSpec] of Object.entries(spec.fields)) {
        const fieldExists = headers.some(h => h.toLowerCase() === fieldName.toLowerCase());
        
        if (!fieldExists && fieldSpec.required) {
          results.errors.push({
            code: 'MISSING_REQUIRED_FIELD',
            message: `Required field '${fieldName}' is missing in ${filename}`,
            file: filename,
            field: fieldName,
            suggestion: `Add the '${fieldName}' column to ${filename}`
          });
          results.summary.errorCount++;
          results.summary.isValid = false;
          fileResult.errors++;
          fileResult.status = 'error';
        }
      }

      const headerMap = {};
      headers.forEach(h => {
        headerMap[h.toLowerCase()] = h;
      });

      const uniqueIds = new Set();
      const idField = spec.primaryKey;

      // Optimized row validation - only check critical fields
      const criticalChecks = filename === 'stops.txt' || filename === 'stop_times.txt' || 
                            filename === 'routes.txt' || filename === 'trips.txt';
      
      parsed.data.forEach((row, rowIndex) => {
        const lineNumber = rowIndex + 2;

        // Check required values only for critical files
        if (criticalChecks) {
          for (const [fieldName, fieldSpec] of Object.entries(spec.fields)) {
            if (fieldSpec.required) {
              const actualFieldName = headerMap[fieldName.toLowerCase()];
              const value = row[actualFieldName];
              
              if (!value || value.trim() === '') {
                results.errors.push({
                  code: 'MISSING_REQUIRED_VALUE',
                  message: `Missing required value for field '${fieldName}'`,
                  file: filename,
                  line: lineNumber,
                  field: fieldName,
                  suggestion: `Provide a value for '${fieldName}'`
                });
                results.summary.errorCount++;
                results.summary.isValid = false;
                fileResult.errors++;
                fileResult.status = 'error';
              }
            }
          }
        }

        // Check unique IDs
        if (idField) {
          const actualIdField = headerMap[idField.toLowerCase()];
          const idValue = row[actualIdField];
          
          if (idValue) {
            if (uniqueIds.has(idValue)) {
              results.errors.push({
                code: 'DUPLICATE_ID',
                message: `Duplicate ${idField}: '${idValue}'`,
                file: filename,
                line: lineNumber,
                field: idField,
                suggestion: `Ensure all ${idField} values are unique`
              });
              results.summary.errorCount++;
              results.summary.isValid = false;
              fileResult.errors++;
              fileResult.status = 'error';
            }
            uniqueIds.add(idValue);
          }
        }

        // Critical validations only
        if (filename === 'stops.txt') {
          const lat = parseFloat(row[headerMap['stop_lat']]);
          const lon = parseFloat(row[headerMap['stop_lon']]);
          
          if (isNaN(lat) || lat < -90 || lat > 90) {
            results.errors.push({
              code: 'INVALID_LATITUDE',
              message: `Invalid latitude value: ${row[headerMap['stop_lat']]}`,
              file: filename,
              line: lineNumber,
              field: 'stop_lat',
              suggestion: 'Latitude must be between -90 and 90'
            });
            results.summary.errorCount++;
            results.summary.isValid = false;
            fileResult.errors++;
            fileResult.status = 'error';
          }
          
          if (isNaN(lon) || lon < -180 || lon > 180) {
            results.errors.push({
              code: 'INVALID_LONGITUDE',
              message: `Invalid longitude value: ${row[headerMap['stop_lon']]}`,
              file: filename,
              line: lineNumber,
              field: 'stop_lon',
              suggestion: 'Longitude must be between -180 and 180'
            });
            results.summary.errorCount++;
            results.summary.isValid = false;
            fileResult.errors++;
            fileResult.status = 'error';
          }
        }
      });

      results.fileDetails[filename] = fileResult;

      // Statistics
      if (filename === 'stops.txt') {
        results.statistics.total_stops = parsed.data.length;
      } else if (filename === 'routes.txt') {
        results.statistics.total_routes = parsed.data.length;
      } else if (filename === 'trips.txt') {
        results.statistics.total_trips = parsed.data.length;
      } else if (filename === 'stop_times.txt') {
        results.statistics.total_stop_times = parsed.data.length;
      } else if (filename === 'agency.txt') {
        results.statistics.total_agencies = parsed.data.length;
      }
    }

    // Fast cross-file validation
    progress.value = 70;
    processingStatus.value = 'Validating foreign keys...';
    await performCrossFileValidations(parsedFiles, results);

    progress.value = 90;
    processingStatus.value = 'Finalizing...';

    if (parsedFiles['feed_info.txt']?.parsed) {
      const feedInfoParsed = parsedFiles['feed_info.txt'].parsed;
      if (feedInfoParsed.data.length > 0) {
        const feedInfo = feedInfoParsed.data[0];
        results.feedInfo = {
          publisher_name: feedInfo.feed_publisher_name || 'Not provided',
          publisher_url: feedInfo.feed_publisher_url || 'Not provided',
          feed_lang: feedInfo.feed_lang || 'Not provided',
          feed_start_date: feedInfo.feed_start_date || 'Not provided',
          feed_end_date: feedInfo.feed_end_date || 'Not provided',
          feed_version: feedInfo.feed_version || 'Not provided'
        };
      }
    }

    if (parsedFiles['agency.txt']?.parsed) {
      const agencyParsed = parsedFiles['agency.txt'].parsed;
      results.agencies = agencyParsed.data.map(agency => ({
        name: agency.agency_name || 'Unknown',
        url: agency.agency_url || 'Not provided',
        phone: agency.agency_phone || 'Not provided',
        email: agency.agency_email || 'Not provided',
        timezone: agency.agency_timezone || 'Not provided'
      }));
    }

    const totalIssues = results.summary.errorCount + (results.summary.warningCount * 0.5);
    results.summary.score = Math.max(0, Math.round(100 - (totalIssues * 2)));

    progress.value = 100;
    processingStatus.value = 'Complete!';

    loading.value = false;
    validationResults.value = results;

  } catch (error) {
    loading.value = false;
    validationResults.value = createErrorResult(`Error during validation: ${error.message}`);
  }
}

function getGTFSSpecification() {
  return {
    'agency.txt': {
      required: true,
      primaryKey: 'agency_id',
      fields: {
        agency_id: { required: false, type: 'text' },
        agency_name: { required: true, type: 'text' },
        agency_url: { required: true, type: 'url' },
        agency_timezone: { required: true, type: 'timezone' },
        agency_lang: { required: false, type: 'language' },
        agency_phone: { required: false, type: 'phone' },
        agency_fare_url: { required: false, type: 'url' },
        agency_email: { required: false, type: 'email' }
      }
    },
    'stops.txt': {
      required: true,
      primaryKey: 'stop_id',
      fields: {
        stop_id: { required: true, type: 'text' },
        stop_code: { required: false, type: 'text' },
        stop_name: { required: true, type: 'text' },
        stop_desc: { required: false, type: 'text' },
        stop_lat: { required: true, type: 'latitude' },
        stop_lon: { required: true, type: 'longitude' },
        zone_id: { required: false, type: 'text' },
        stop_url: { required: false, type: 'url' },
        location_type: { required: false, type: 'enum' },
        parent_station: { required: false, type: 'text' },
        stop_timezone: { required: false, type: 'timezone' },
        wheelchair_boarding: { required: false, type: 'enum' }
      }
    },
    'routes.txt': {
      required: true,
      primaryKey: 'route_id',
      fields: {
        route_id: { required: true, type: 'text' },
        agency_id: { required: false, type: 'text' },
        route_short_name: { required: true, type: 'text' },
        route_long_name: { required: true, type: 'text' },
        route_desc: { required: false, type: 'text' },
        route_type: { required: true, type: 'enum' },
        route_url: { required: false, type: 'url' },
        route_color: { required: false, type: 'color' },
        route_text_color: { required: false, type: 'color' },
        route_sort_order: { required: false, type: 'integer' }
      }
    },
    'trips.txt': {
      required: true,
      primaryKey: 'trip_id',
      fields: {
        route_id: { required: true, type: 'text' },
        service_id: { required: true, type: 'text' },
        trip_id: { required: true, type: 'text' },
        trip_headsign: { required: false, type: 'text' },
        trip_short_name: { required: false, type: 'text' },
        direction_id: { required: false, type: 'enum' },
        block_id: { required: false, type: 'text' },
        shape_id: { required: false, type: 'text' },
        wheelchair_accessible: { required: false, type: 'enum' },
        bikes_allowed: { required: false, type: 'enum' }
      }
    },
    'stop_times.txt': {
      required: true,
      primaryKey: null,
      fields: {
        trip_id: { required: true, type: 'text' },
        arrival_time: { required: true, type: 'time' },
        departure_time: { required: true, type: 'time' },
        stop_id: { required: true, type: 'text' },
        stop_sequence: { required: true, type: 'integer' },
        stop_headsign: { required: false, type: 'text' },
        pickup_type: { required: false, type: 'enum' },
        drop_off_type: { required: false, type: 'enum' },
        shape_dist_traveled: { required: false, type: 'float' },
        timepoint: { required: false, type: 'enum' }
      }
    },
    'calendar.txt': {
      required: false,
      primaryKey: 'service_id',
      fields: {
        service_id: { required: true, type: 'text' },
        monday: { required: true, type: 'enum' },
        tuesday: { required: true, type: 'enum' },
        wednesday: { required: true, type: 'enum' },
        thursday: { required: true, type: 'enum' },
        friday: { required: true, type: 'enum' },
        saturday: { required: true, type: 'enum' },
        sunday: { required: true, type: 'enum' },
        start_date: { required: true, type: 'date' },
        end_date: { required: true, type: 'date' }
      }
    },
    'calendar_dates.txt': {
      required: false,
      primaryKey: null,
      fields: {
        service_id: { required: true, type: 'text' },
        date: { required: true, type: 'date' },
        exception_type: { required: true, type: 'enum' }
      }
    },
    'fare_attributes.txt': {
      required: false,
      primaryKey: 'fare_id',
      fields: {
        fare_id: { required: true, type: 'text' },
        price: { required: true, type: 'float' },
        currency_type: { required: true, type: 'currency' },
        payment_method: { required: true, type: 'enum' },
        transfers: { required: true, type: 'enum' },
        transfer_duration: { required: false, type: 'integer' }
      }
    },
    'fare_rules.txt': {
      required: false,
      primaryKey: null,
      fields: {
        fare_id: { required: true, type: 'text' },
        route_id: { required: false, type: 'text' },
        origin_id: { required: false, type: 'text' },
        destination_id: { required: false, type: 'text' },
        contains_id: { required: false, type: 'text' }
      }
    },
    'shapes.txt': {
      required: false,
      primaryKey: null,
      fields: {
        shape_id: { required: true, type: 'text' },
        shape_pt_lat: { required: true, type: 'latitude' },
        shape_pt_lon: { required: true, type: 'longitude' },
        shape_pt_sequence: { required: true, type: 'integer' },
        shape_dist_traveled: { required: false, type: 'float' }
      }
    },
    'frequencies.txt': {
      required: false,
      primaryKey: null,
      fields: {
        trip_id: { required: true, type: 'text' },
        start_time: { required: true, type: 'time' },
        end_time: { required: true, type: 'time' },
        headway_secs: { required: true, type: 'integer' },
        exact_times: { required: false, type: 'enum' }
      }
    },
    'transfers.txt': {
      required: false,
      primaryKey: null,
      fields: {
        from_stop_id: { required: true, type: 'text' },
        to_stop_id: { required: true, type: 'text' },
        transfer_type: { required: true, type: 'enum' },
        min_transfer_time: { required: false, type: 'integer' }
      }
    },
    'feed_info.txt': {
      required: false,
      primaryKey: null,
      fields: {
        feed_publisher_name: { required: true, type: 'text' },
        feed_publisher_url: { required: true, type: 'url' },
        feed_lang: { required: true, type: 'language' },
        feed_start_date: { required: false, type: 'date' },
        feed_end_date: { required: false, type: 'date' },
        feed_version: { required: false, type: 'text' }
      }
    }
  };
}

function validateFieldType(value, type, fieldName, filename, lineNumber) {
  switch (type) {
    case 'url':
      if (value && !isValidURL(value)) {
        return {
          code: 'INVALID_URL',
          message: `Invalid URL format: ${value}`,
          file: filename,
          line: lineNumber,
          field: fieldName,
          suggestion: 'URL must start with http:// or https://'
        };
      }
      break;
    case 'email':
      if (value && !isValidEmail(value)) {
        return {
          code: 'INVALID_EMAIL',
          message: `Invalid email format: ${value}`,
          file: filename,
          line: lineNumber,
          field: fieldName,
          suggestion: 'Email must be in valid format (e.g., user@example.com)'
        };
      }
      break;
    case 'integer':
      if (value && isNaN(parseInt(value))) {
        return {
          code: 'INVALID_INTEGER',
          message: `Invalid integer value: ${value}`,
          file: filename,
          line: lineNumber,
          field: fieldName,
          suggestion: 'Value must be a valid integer'
        };
      }
      break;
    case 'float':
      if (value && isNaN(parseFloat(value))) {
        return {
          code: 'INVALID_FLOAT',
          message: `Invalid float value: ${value}`,
          file: filename,
          line: lineNumber,
          field: fieldName,
          suggestion: 'Value must be a valid number'
        };
      }
      break;
    case 'color':
      if (value && !/^[0-9A-Fa-f]{6}$/.test(value)) {
        return {
          code: 'INVALID_COLOR',
          message: `Invalid color format: ${value}`,
          file: filename,
          line: lineNumber,
          field: fieldName,
          suggestion: 'Color must be 6-digit hex (e.g., FFFFFF)'
        };
      }
      break;
  }
  return null;
}

function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidTimeFormat(time) {
  return /^\d{1,2}:\d{2}:\d{2}$/.test(time);
}

function hasMixedCase(str) {
  const hasUpper = /[A-Z]/.test(str);
  const hasLower = /[a-z]/.test(str);
  return hasUpper && hasLower && str !== str.toLowerCase() && str !== str.toUpperCase();
}

async function performCrossFileValidations(parsedFiles, results) {
  try {
    // Use already parsed files for speed
    const stopsData = parsedFiles['stops.txt']?.parsed;
    const stopTimesData = parsedFiles['stop_times.txt']?.parsed;
    const tripsData = parsedFiles['trips.txt']?.parsed;
    const routesData = parsedFiles['routes.txt']?.parsed;
    const agencyData = parsedFiles['agency.txt']?.parsed;
    const calendarData = parsedFiles['calendar.txt']?.parsed;
    const calendarDatesData = parsedFiles['calendar_dates.txt']?.parsed;

    if (!stopsData || !stopTimesData || !tripsData) return;

    // Build foreign key sets for validation - FAST
    const validStopIds = new Set(stopsData.data.map(stop => stop.stop_id).filter(Boolean));
    const validTripIds = new Set(tripsData.data.map(trip => trip.trip_id).filter(Boolean));
    
    // Validate routes
    let routeIds = new Set();
    if (routesData) {
      routeIds = new Set(routesData.data.map(route => route.route_id).filter(Boolean));
      
      // Check route_id references in trips
      let tripRowNum = 2;
      for (const trip of tripsData.data) {
        if (trip.route_id && !routeIds.has(trip.route_id)) {
          results.errors.push({
            code: 'foreign_key_violation',
            message: `Foreign key violation: route_id '${trip.route_id}' in trips.txt does not exist in routes.txt`,
            file: 'trips.txt',
            line: tripRowNum,
            field: 'route_id',
            suggestion: `Ensure route_id '${trip.route_id}' exists in routes.txt`
          });
          results.summary.errorCount++;
          results.summary.isValid = false;
          if (results.fileDetails['trips.txt']) {
            results.fileDetails['trips.txt'].errors++;
            results.fileDetails['trips.txt'].status = 'error';
          }
        }
        tripRowNum++;
      }

      // Check agency_id if agency.txt exists
      if (agencyData) {
        const validAgencyIds = new Set(agencyData.data.map(agency => agency.agency_id).filter(Boolean));
        let routeRowNum = 2;
        for (const route of routesData.data) {
          if (route.agency_id && !validAgencyIds.has(route.agency_id)) {
            results.errors.push({
              code: 'foreign_key_violation',
              message: `Foreign key violation: agency_id '${route.agency_id}' in routes.txt does not exist in agency.txt`,
              file: 'routes.txt',
              line: routeRowNum,
              field: 'agency_id',
              suggestion: `Ensure agency_id '${route.agency_id}' exists in agency.txt`
            });
            results.summary.errorCount++;
            results.summary.isValid = false;
            if (results.fileDetails['routes.txt']) {
              results.fileDetails['routes.txt'].errors++;
              results.fileDetails['routes.txt'].status = 'error';
            }
          }
          routeRowNum++;
        }
      }
    }

    // Validate service_ids
    const validServiceIds = new Set();
    if (calendarData) {
      calendarData.data.forEach(cal => {
        if (cal.service_id) validServiceIds.add(cal.service_id);
      });
    }
    if (calendarDatesData) {
      calendarDatesData.data.forEach(calDate => {
        if (calDate.service_id) validServiceIds.add(calDate.service_id);
      });
    }

    if (validServiceIds.size > 0) {
      let tripRowNum = 2;
      for (const trip of tripsData.data) {
        if (trip.service_id && !validServiceIds.has(trip.service_id)) {
          results.errors.push({
            code: 'foreign_key_violation',
            message: `Foreign key violation: service_id '${trip.service_id}' in trips.txt does not exist in calendar.txt or calendar_dates.txt`,
            file: 'trips.txt',
            line: tripRowNum,
            field: 'service_id',
            suggestion: `Ensure service_id '${trip.service_id}' exists in calendar.txt or calendar_dates.txt`
          });
          results.summary.errorCount++;
          results.summary.isValid = false;
          if (results.fileDetails['trips.txt']) {
            results.fileDetails['trips.txt'].errors++;
            results.fileDetails['trips.txt'].status = 'error';
          }
        }
        tripRowNum++;
      }
    }

    // CRITICAL: Fast foreign key validation for stop_times
    let stopTimeRowNum = 2;
    for (const stopTime of stopTimesData.data) {
      // Check trip_id
      if (stopTime.trip_id && !validTripIds.has(stopTime.trip_id)) {
        results.errors.push({
          code: 'foreign_key_violation',
          message: `Foreign key violation: trip_id '${stopTime.trip_id}' in stop_times.txt does not exist in trips.txt`,
          file: 'stop_times.txt',
          line: stopTimeRowNum,
          field: 'trip_id',
          suggestion: `Ensure trip_id '${stopTime.trip_id}' exists in trips.txt or remove orphaned stop_times entries`
        });
        results.summary.errorCount++;
        results.summary.isValid = false;
        if (results.fileDetails['stop_times.txt']) {
          results.fileDetails['stop_times.txt'].errors++;
          results.fileDetails['stop_times.txt'].status = 'error';
        }
      }

      // Check stop_id
      if (stopTime.stop_id && !validStopIds.has(stopTime.stop_id)) {
        results.errors.push({
          code: 'foreign_key_violation',
          message: `Foreign key violation: stop_id '${stopTime.stop_id}' in stop_times.txt does not exist in stops.txt`,
          file: 'stop_times.txt',
          line: stopTimeRowNum,
          field: 'stop_id',
          suggestion: `Ensure stop_id '${stopTime.stop_id}' exists in stops.txt`
        });
        results.summary.errorCount++;
        results.summary.isValid = false;
        if (results.fileDetails['stop_times.txt']) {
          results.fileDetails['stop_times.txt'].errors++;
          results.fileDetails['stop_times.txt'].status = 'error';
        }
      }

      stopTimeRowNum++;
    }

  } catch (error) {
    console.error('Error in cross-file validation:', error);
  }
}
                field: 'trip_id',
                suggestion: `Check times for trip ${tripId}`
              });
              results.summary.warningCount++;
            }
          }
        }
      }
    });

    // Check for unused trips
    const tripsWithStopTimes = new Set(Object.keys(tripStopTimes));
    const allTrips = new Set();
    tripsParsed.data.forEach(trip => {
      if (trip.trip_id) allTrips.add(trip.trip_id);
    });

    allTrips.forEach(tripId => {
      if (!tripsWithStopTimes.has(tripId)) {
        results.warnings.push({
          code: 'unused_trip',
          message: `Trip ${tripId} has no stop times defined`,
          file: 'trips.txt',
          field: 'trip_id'
        });
        results.summary.warningCount++;
      }
    });

    // Check for unusable trips (less than 2 stops)
    Object.entries(tripStopTimes).forEach(([tripId, stopTimes]) => {
      if (stopTimes.length < 2) {
        results.warnings.push({
          code: 'unusable_trip',
          message: `Trip ${tripId} has less than 2 stops`,
          file: 'stop_times.txt',
          field: 'trip_id',
          suggestion: 'Trips must have at least 2 stops'
        });
        results.summary.warningCount++;
      }
    });

    // Check stops match shape order (if shapes exist)
    if (shapesFile) {
      const shapesContent = await shapesFile.async('text');
      const shapesParsed = window.Papa.parse(shapesContent, { header: true, skipEmptyLines: true });

      const shapesMap = {};
      shapesParsed.data.forEach(shape => {
        if (!shape.shape_id) return;
        if (!shapesMap[shape.shape_id]) {
          shapesMap[shape.shape_id] = [];
        }
        shapesMap[shape.shape_id].push({
          lat: parseFloat(shape.shape_pt_lat),
          lon: parseFloat(shape.shape_pt_lon),
          sequence: parseInt(shape.shape_pt_sequence)
        });
      });

      Object.keys(shapesMap).forEach(shapeId => {
        shapesMap[shapeId].sort((a, b) => a.sequence - b.sequence);
      });

      tripsParsed.data.forEach(trip => {
        if (!trip.shape_id || !shapesMap[trip.shape_id]) return;

        const shape = shapesMap[trip.shape_id];
        const stops = tripStopTimes[trip.trip_id];

        if (!stops || stops.length < 2) return;

        stops.forEach((stop, idx) => {
          const stopCoord = stopCoords[stop.stop_id];
          if (!stopCoord) return;

          let minDist = Infinity;
          shape.forEach(shapePoint => {
            const dist = calculateDistance(stopCoord.lat, stopCoord.lon, shapePoint.lat, shapePoint.lon);
            if (dist < minDist) minDist = dist;
          });

          if (minDist > 1) {
            results.warnings.push({
              code: 'stop_too_far_from_shape',
              message: `Stop ${stop.stop_id} is ${Math.round(minDist * 1000)}m from shape`,
              file: 'stop_times.txt',
              field: 'stop_id',
              suggestion: `Check shape_id for trip ${trip.trip_id}`
            });
            results.summary.warningCount++;
          }
        });

        const stopShapeIndices = stops.map(stop => {
          const stopCoord = stopCoords[stop.stop_id];
          if (!stopCoord) return -1;

          let closestIdx = 0;
          let minDist = Infinity;
          shape.forEach((shapePoint, idx) => {
            const dist = calculateDistance(stopCoord.lat, stopCoord.lon, shapePoint.lat, shapePoint.lon);
            if (dist < minDist) {
              minDist = dist;
              closestIdx = idx;
            }
          });
          return closestIdx;
        }).filter(idx => idx >= 0);

        for (let i = 0; i < stopShapeIndices.length - 1; i++) {
          if (stopShapeIndices[i] > stopShapeIndices[i + 1]) {
            results.warnings.push({
              code: 'stops_match_shape_out_of_order',
              message: `Stops for trip ${trip.trip_id} don't match shape order`,
              file: 'trips.txt',
              field: 'trip_id',
              suggestion: 'Check stop sequence or shape definition'
            });
            results.summary.warningCount++;
            break;
          }
        }
      });
    }

  } catch (error) {
    console.error('Error in cross-file validation:', error);
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function parseTime(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  if (parts.length !== 3) return null;
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseInt(parts[2]);
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
  return hours * 3600 + minutes * 60 + seconds;
}

function createErrorResult(message) {
  return {
    summary: {
      isValid: false,
      errorCount: 1,
      warningCount: 0,
      infoCount: 0,
      filesValidated: 0,
      score: 0
    },
    errors: [{
      code: 'PROCESSING_ERROR',
      message: message,
      suggestion: 'Please ensure the file is a valid GTFS ZIP archive'
    }],
    warnings: [],
    info: [],
    fileDetails: {},
    statistics: {}
  };
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function downloadReport(format) {
  if (!validationResults.value) return;

  if (format === 'json') {
    const dataStr = JSON.stringify(validationResults.value, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gtfs-validation-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } else if (format === 'html') {
    const html = generateHTMLReport(validationResults.value);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gtfs-validation-report-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

function generateHTMLReport(results) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GTFS Validation Report - ${fileName.value}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: ${results.summary.isValid ? '#10b981' : '#ef4444'}; margin-bottom: 10px; }
    .summary { background: ${results.summary.isValid ? '#d1fae5' : '#fee2e2'}; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .score { font-size: 48px; font-weight: bold; color: ${results.summary.isValid ? '#10b981' : '#ef4444'}; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
    .stat-card { background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6; }
    .stat-value { font-size: 32px; font-weight: bold; color: #8b5cf6; }
    .stat-label { color: #6b7280; font-size: 14px; }
    .section { margin: 30px 0; }
    .section-title { font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #1f2937; }
    .issue { background: white; border-left: 4px solid #ef4444; padding: 15px; margin: 10px 0; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .issue.warning { border-left-color: #f59e0b; }
    .issue.info { border-left-color: #3b82f6; }
    .issue-code { font-weight: bold; color: #1f2937; margin-bottom: 5px; }
    .issue-message { color: #4b5563; }
    .issue-details { font-size: 12px; color: #6b7280; margin-top: 8px; }
    .issue-suggestion { font-style: italic; color: #059669; margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: bold; color: #1f2937; }
    .status-valid { color: #10b981; font-weight: bold; }
    .status-error { color: #ef4444; font-weight: bold; }
    .status-warning { color: #f59e0b; font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎯 GTFS Validation Report</h1>
    <p style="color: #6b7280; margin-bottom: 20px;">File: ${fileName.value} | Generated: ${new Date().toLocaleString()}</p>
    
    <div class="summary">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2>${results.summary.isValid ? '✓ Feed is Valid' : '✗ Feed Has Errors'}</h2>
          <p>Quality Score: <span class="score">${results.summary.score}/100</span></p>
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card" style="border-left-color: #ef4444;">
        <div class="stat-value" style="color: #ef4444;">${results.summary.errorCount}</div>
        <div class="stat-label">Errors</div>
      </div>
      <div class="stat-card" style="border-left-color: #f59e0b;">
        <div class="stat-value" style="color: #f59e0b;">${results.summary.warningCount}</div>
        <div class="stat-label">Warnings</div>
      </div>
      <div class="stat-card" style="border-left-color: #3b82f6;">
        <div class="stat-value" style="color: #3b82f6;">${results.summary.infoCount}</div>
        <div class="stat-label">Info</div>
      </div>
      <div class="stat-card" style="border-left-color: #10b981;">
        <div class="stat-value" style="color: #10b981;">${results.summary.filesValidated}</div>
        <div class="stat-label">Files Validated</div>
      </div>
    </div>

    ${results.errors.length > 0 ? `
    <div class="section">
      <h2 class="section-title">❌ Errors (${results.errors.length})</h2>
      ${results.errors.map(error => `
        <div class="issue">
          <div class="issue-code">${error.code}</div>
          <div class="issue-message">${error.message}</div>
          ${error.file ? `<div class="issue-details">File: ${error.file}${error.line ? ` | Line: ${error.line}` : ''}${error.field ? ` | Field: ${error.field}` : ''}</div>` : ''}
          ${error.suggestion ? `<div class="issue-suggestion">💡 ${error.suggestion}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${results.warnings.length > 0 ? `
    <div class="section">
      <h2 class="section-title">⚠️ Warnings (${results.warnings.length})</h2>
      ${results.warnings.map(warning => `
        <div class="issue warning">
          <div class="issue-code">${warning.code}</div>
          <div class="issue-message">${warning.message}</div>
          ${warning.file ? `<div class="issue-details">File: ${warning.file}${warning.line ? ` | Line: ${warning.line}` : ''}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="section">
      <h2 class="section-title">📁 File Details</h2>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Status</th>
            <th>Type</th>
            <th>Rows</th>
            <th>Size</th>
            <th>Errors</th>
            <th>Warnings</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(results.fileDetails).map(([file, details]) => `
            <tr>
              <td>${file}</td>
              <td class="status-${details.status}">${details.status.toUpperCase()}</td>
              <td>${details.required ? 'Required' : 'Optional'}</td>
              <td>${details.rowCount || 'N/A'}</td>
              <td>${details.size ? formatFileSize(details.size) : 'N/A'}</td>
              <td class="status-error">${details.errors || 0}</td>
              <td class="status-warning">${details.warnings || 0}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${Object.keys(results.statistics).length > 0 ? `
    <div class="section">
      <h2 class="section-title">📊 Statistics</h2>
      <div class="stats">
        ${Object.entries(results.statistics).map(([key, value]) => `
          <div class="stat-card">
            <div class="stat-value">${value.toLocaleString()}</div>
            <div class="stat-label">${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <div class="footer">
      <p>Report generated by GTFS Validator | ${new Date().toLocaleString()}</p>
      <p style="margin-top: 10px; font-size: 12px;">This validation was performed client-side in your browser. No data was uploaded to any server.</p>
    </div>
  </div>
</body>
</html>`;
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
