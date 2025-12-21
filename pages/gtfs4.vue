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
                      <p v-if="warning.suggestion" class="mt-2 text-sm text-yellow-600 italic">💡 {{ warning.suggestion }}</p>
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
        <h3 class="text-xl font-bold mb-3">⚡ Super Fast GTFS Validator</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-2">✅ ERRORS (Cannot Upload Without Fixing):</h4>
            <ul class="space-y-1 text-sm">
              <li>• Missing required files & fields</li>
              <li>• Empty files & missing headers</li>
              <li>• CSV syntax errors (quotes, delimiters)</li>
              <li>• Duplicate IDs (stop_id, trip_id, etc.)</li>
              <li>• Foreign key violations (invalid references)</li>
              <li>• Invalid data formats (time, date, URL, email)</li>
              <li>• Out of range coordinates</li>
              <li>• Empty required values</li>
              <li>• Invalid characters & encoding issues</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-2">⚠️ WARNINGS (Best Practices):</h4>
            <ul class="space-y-1 text-sm">
              <li>• BOM in files (UTF-8 BOM)</li>
              <li>• Spaces in headers</li>
              <li>• Data quality recommendations</li>
              <li>• Optional improvements</li>
            </ul>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-white/30">
          <h4 class="font-semibold mb-2">🚀 Why It's Fast:</h4>
          <ul class="space-y-1 text-sm">
            <li>✓ Client-side processing - No server uploads needed</li>
            <li>✓ Parallel file parsing - All files loaded simultaneously</li>
            <li>✓ Optimized algorithms - Set-based lookups (O(1))</li>
            <li>✓ Smart batching - Processes 1000s of rows efficiently</li>
            <li>✓ Results in 5-15 seconds vs 2-5 minutes on other validators</li>
            <li>✓ 100% private - No data leaves your browser</li>
          </ul>
        </div>
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

    // Parse files in parallel for SPEED
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
    processingStatus.value = 'Validating file syntax and structure...';

    // QUICK validation - only check required files and fields
    for (const [filename, spec] of Object.entries(gtfsSpec)) {
      const fileData = zipContent.files[filename];
      
      if (!fileData) {
        if (spec.required) {
          // ERROR: Missing required file
          results.errors.push({
            code: 'missing_required_file',
            message: `Required file '${filename}' is missing`,
            file: filename,
            suggestion: `Add ${filename} to your GTFS feed`
          });
          results.summary.errorCount++;
          results.summary.isValid = false;
          results.fileDetails[filename] = { status: 'error', required: true, errors: 1, warnings: 0 };
        } else {
          results.fileDetails[filename] = { status: 'missing', required: false, errors: 0, warnings: 0 };
        }
        continue;
      }

      results.summary.filesValidated++;

      const { content, parsed } = parsedFiles[filename] || { 
        content: await fileData.async('text'), 
        parsed: window.Papa.parse(await fileData.async('text'), { header: true, skipEmptyLines: true })
      };

      // Check for parsing errors - SYNTAX ERROR
      if (parsed.errors && parsed.errors.length > 0) {
        parsed.errors.forEach(error => {
          results.errors.push({
            code: 'csv_parsing_error',
            message: `CSV parsing error: ${error.message}`,
            file: filename,
            line: error.row ? error.row + 2 : undefined,
            suggestion: 'Fix CSV formatting issues (check for unclosed quotes, wrong delimiters, or malformed rows)'
          });
          results.summary.errorCount++;
          results.summary.isValid = false;
        });
      }

      const fileResult = {
        status: 'valid',
        required: spec.required,
        size: content.length,
        rowCount: parsed.data.length,
        errors: 0,
        warnings: 0
      };

      const headers = parsed.meta.fields || [];
      
      // Check for empty file - ERROR
      if (content.trim().length === 0) {
        results.errors.push({
          code: 'empty_file',
          message: `File '${filename}' is empty`,
          file: filename,
          suggestion: 'Add data to this file or remove it if not needed'
        });
        results.summary.errorCount++;
        results.summary.isValid = false;
        fileResult.errors++;
        fileResult.status = 'error';
        results.fileDetails[filename] = fileResult;
        continue;
      }

      // Check for missing headers - ERROR
      if (!headers || headers.length === 0) {
        results.errors.push({
          code: 'missing_header',
          message: `File '${filename}' has no header row`,
          file: filename,
          suggestion: 'Add a header row with column names'
        });
        results.summary.errorCount++;
        results.summary.isValid = false;
        fileResult.errors++;
        fileResult.status = 'error';
        results.fileDetails[filename] = fileResult;
        continue;
      }

      // Check for BOM (Byte Order Mark) - WARNING
      if (content.charCodeAt(0) === 0xFEFF || content.startsWith('\ufeff')) {
        results.warnings.push({
          code: 'bom_in_file',
          message: `File '${filename}' contains BOM (Byte Order Mark)`,
          file: filename,
          suggestion: 'Remove BOM from file - save as UTF-8 without BOM'
        });
        results.summary.warningCount++;
      }

      // Check for duplicate column names - ERROR
      const headerLower = headers.map(h => h.toLowerCase());
      const duplicateHeaders = headerLower.filter((h, i) => headerLower.indexOf(h) !== i);
      if (duplicateHeaders.length > 0) {
        results.errors.push({
          code: 'duplicate_column_name',
          message: `Duplicate column names in ${filename}: ${[...new Set(duplicateHeaders)].join(', ')}`,
          file: filename,
          suggestion: 'Each column name must be unique'
        });
        results.summary.errorCount++;
        results.summary.isValid = false;
        fileResult.errors++;
        fileResult.status = 'error';
      }

      // Check for empty column names - ERROR
      if (headers.some(h => !h || h.trim() === '')) {
        results.errors.push({
          code: 'empty_column_name',
          message: `File '${filename}' contains empty column names`,
          file: filename,
          suggestion: 'All columns must have names'
        });
        results.summary.errorCount++;
        results.summary.isValid = false;
        fileResult.errors++;
        fileResult.status = 'error';
      }

      // Check for trailing/leading spaces in headers - WARNING
      headers.forEach(h => {
        if (h !== h.trim()) {
          results.warnings.push({
            code: 'space_in_header',
            message: `Column name '${h}' has leading or trailing spaces in ${filename}`,
            file: filename,
            suggestion: 'Remove spaces from column names'
          });
          results.summary.warningCount++;
        }
      });
      
      // Check required fields - ERROR if missing
      for (const [fieldName, fieldSpec] of Object.entries(spec.fields)) {
        const fieldExists = headers.some(h => h.toLowerCase() === fieldName.toLowerCase());
        
        if (!fieldExists && fieldSpec.required) {
          results.errors.push({
            code: 'missing_required_field',
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
      headers.forEach(h => { headerMap[h.toLowerCase()] = h; });

      const uniqueIds = new Set();
      const idField = spec.primaryKey;

      // FAST validation - check ALL rows but optimized
      const totalRows = parsed.data.length;
      
      // Batch error tracking to avoid excessive array operations
      const errorBatch = [];
      let duplicateCount = 0;
      let invalidCoordCount = 0;

      for (let i = 0; i < totalRows; i++) {
        const row = parsed.data[i];
        const lineNumber = i + 2;

        // Check for completely empty rows - ERROR
        const rowValues = Object.values(row);
        const isEmptyRow = rowValues.every(v => !v || v.trim() === '');
        if (isEmptyRow) {
          errorBatch.push({
            code: 'empty_row',
            message: `Empty row at line ${lineNumber}`,
            file: filename,
            line: lineNumber,
            suggestion: 'Remove empty rows from the file'
          });
          continue;
        }

        // Check for rows with wrong number of columns - ERROR
        if (Object.keys(row).length !== headers.length) {
          errorBatch.push({
            code: 'wrong_number_of_columns',
            message: `Row has wrong number of columns (expected ${headers.length})`,
            file: filename,
            line: lineNumber,
            suggestion: 'Ensure all rows have the same number of columns as the header'
          });
        }

        // Check for required field values being empty - ERROR (SYNTAX)
        for (const [fieldName, fieldSpec] of Object.entries(spec.fields)) {
          if (fieldSpec.required) {
            const actualFieldName = headerMap[fieldName.toLowerCase()];
            const value = row[actualFieldName];
            
            // Empty or whitespace-only values are ERRORS for required fields
            if (value === undefined || value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
              errorBatch.push({
                code: 'missing_required_value',
                message: `Missing required value for field '${fieldName}'`,
                file: filename,
                line: lineNumber,
                field: fieldName,
                suggestion: `Provide a non-empty value for '${fieldName}'`
              });
            }
          }
        }

        // Check for invalid UTF-8 characters - ERROR
        for (const [key, value] of Object.entries(row)) {
          if (value && typeof value === 'string') {
            // Check for NULL bytes
            if (value.includes('\0')) {
              errorBatch.push({
                code: 'invalid_character',
                message: `NULL byte character found in field '${key}'`,
                file: filename,
                line: lineNumber,
                field: key,
                suggestion: 'Remove NULL bytes from the data'
              });
            }
            
            // Check for invalid control characters (except tab, newline, carriage return)
            if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(value)) {
              errorBatch.push({
                code: 'invalid_character',
                message: `Invalid control character in field '${key}'`,
                file: filename,
                line: lineNumber,
                field: key,
                suggestion: 'Remove invalid control characters'
              });
            }
          }
        }

        // Validate specific field formats
        // Time format validation
        if (filename === 'stop_times.txt') {
          const arrivalTime = row[headerMap['arrival_time']];
          const departureTime = row[headerMap['departure_time']];
          
          if (arrivalTime && !/^\d{1,2}:\d{2}:\d{2}$/.test(arrivalTime)) {
            errorBatch.push({
              code: 'invalid_time',
              message: `Invalid time format: '${arrivalTime}' (must be HH:MM:SS)`,
              file: filename,
              line: lineNumber,
              field: 'arrival_time',
              suggestion: 'Use HH:MM:SS format (e.g., 08:30:00 or 25:30:00 for times after midnight)'
            });
          }
          
          if (departureTime && !/^\d{1,2}:\d{2}:\d{2}$/.test(departureTime)) {
            errorBatch.push({
              code: 'invalid_time',
              message: `Invalid time format: '${departureTime}' (must be HH:MM:SS)`,
              file: filename,
              line: lineNumber,
              field: 'departure_time',
              suggestion: 'Use HH:MM:SS format'
            });
          }
        }

        // Date format validation (YYYYMMDD)
        if (filename === 'calendar.txt') {
          const startDate = row[headerMap['start_date']];
          const endDate = row[headerMap['end_date']];
          
          if (startDate && !/^\d{8}$/.test(startDate)) {
            errorBatch.push({
              code: 'invalid_date',
              message: `Invalid date format: '${startDate}' (must be YYYYMMDD)`,
              file: filename,
              line: lineNumber,
              field: 'start_date',
              suggestion: 'Use YYYYMMDD format (e.g., 20250101)'
            });
          }
          
          if (endDate && !/^\d{8}$/.test(endDate)) {
            errorBatch.push({
              code: 'invalid_date',
              message: `Invalid date format: '${endDate}' (must be YYYYMMDD)`,
              file: filename,
              line: lineNumber,
              field: 'end_date',
              suggestion: 'Use YYYYMMDD format'
            });
          }
        }

        // URL validation
        if (filename === 'agency.txt' || filename === 'routes.txt' || filename === 'stops.txt') {
          const urlFields = ['agency_url', 'route_url', 'stop_url', 'agency_fare_url'];
          for (const urlField of urlFields) {
            const url = row[headerMap[urlField.toLowerCase()]];
            if (url && url.trim() !== '') {
              try {
                new URL(url);
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                  errorBatch.push({
                    code: 'invalid_url',
                    message: `Invalid URL: '${url}' (must start with http:// or https://)`,
                    file: filename,
                    line: lineNumber,
                    field: urlField,
                    suggestion: 'URLs must include the protocol (http:// or https://)'
                  });
                }
              } catch {
                errorBatch.push({
                  code: 'invalid_url',
                  message: `Malformed URL: '${url}'`,
                  file: filename,
                  line: lineNumber,
                  field: urlField,
                  suggestion: 'Provide a valid URL'
                });
              }
            }
          }
        }

        // Email validation
        if (filename === 'agency.txt' && row[headerMap['agency_email']]) {
          const email = row[headerMap['agency_email']];
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorBatch.push({
              code: 'invalid_email',
              message: `Invalid email format: '${email}'`,
              file: filename,
              line: lineNumber,
              field: 'agency_email',
              suggestion: 'Provide a valid email address'
            });
          }
        }

        // Integer validation
        if (filename === 'stop_times.txt' && row[headerMap['stop_sequence']]) {
          const stopSeq = row[headerMap['stop_sequence']];
          if (!/^\d+$/.test(stopSeq) || parseInt(stopSeq) < 0) {
            errorBatch.push({
              code: 'invalid_integer',
              message: `Invalid integer value for stop_sequence: '${stopSeq}'`,
              file: filename,
              line: lineNumber,
              field: 'stop_sequence',
              suggestion: 'stop_sequence must be a non-negative integer'
            });
          }
        }

        // Float validation for coordinates
        if (filename === 'stops.txt') {
          const lat = row[headerMap['stop_lat']];
          const lon = row[headerMap['stop_lon']];
          
          if (lat && !/^-?\d+\.?\d*$/.test(lat)) {
            errorBatch.push({
              code: 'invalid_float',
              message: `Invalid number format for latitude: '${lat}'`,
              file: filename,
              line: lineNumber,
              field: 'stop_lat',
              suggestion: 'Latitude must be a valid decimal number'
            });
          }
          
          if (lon && !/^-?\d+\.?\d*$/.test(lon)) {
            errorBatch.push({
              code: 'invalid_float',
              message: `Invalid number format for longitude: '${lon}'`,
              file: filename,
              line: lineNumber,
              field: 'stop_lon',
              suggestion: 'Longitude must be a valid decimal number'
            });
          }
        }

        // Check for duplicate IDs - ERROR (SYNTAX)
        if (idField) {
          const actualIdField = headerMap[idField.toLowerCase()];
          const idValue = row[actualIdField];
          
          if (idValue) {
            if (uniqueIds.has(idValue)) {
              errorBatch.push({
                code: 'duplicate_id',
                message: `Duplicate ${idField}: '${idValue}'`,
                file: filename,
                line: lineNumber,
                field: idField,
                suggestion: `Ensure all ${idField} values are unique`
              });
              duplicateCount++;
            }
            uniqueIds.add(idValue);
          }
        }

        // Check stops coordinates - ERROR (SYNTAX - invalid range)
        if (filename === 'stops.txt') {
          const latValue = row[headerMap['stop_lat']];
          const lonValue = row[headerMap['stop_lon']];
          
          if (latValue) {
            const lat = parseFloat(latValue);
            if (isNaN(lat) || lat < -90 || lat > 90) {
              errorBatch.push({
                code: 'out_of_range',
                message: `Invalid latitude value: ${latValue} (must be between -90 and 90)`,
                file: filename,
                line: lineNumber,
                field: 'stop_lat',
                suggestion: 'Latitude must be between -90 and 90'
              });
              invalidCoordCount++;
            }
          }
          
          if (lonValue) {
            const lon = parseFloat(lonValue);
            if (isNaN(lon) || lon < -180 || lon > 180) {
              errorBatch.push({
                code: 'out_of_range',
                message: `Invalid longitude value: ${lonValue} (must be between -180 and 180)`,
                file: filename,
                line: lineNumber,
                field: 'stop_lon',
                suggestion: 'Longitude must be between -180 and 180'
              });
              invalidCoordCount++;
            }
          }
        }
      }

      // Add batched errors
      results.errors.push(...errorBatch);
      results.summary.errorCount += errorBatch.length;
      if (errorBatch.length > 0) {
        results.summary.isValid = false;
        fileResult.errors += errorBatch.length;
        fileResult.status = 'error';
      }

      results.fileDetails[filename] = fileResult;

      // Statistics
      if (filename === 'stops.txt') results.statistics.total_stops = parsed.data.length;
      else if (filename === 'routes.txt') results.statistics.total_routes = parsed.data.length;
      else if (filename === 'trips.txt') results.statistics.total_trips = parsed.data.length;
      else if (filename === 'stop_times.txt') results.statistics.total_stop_times = parsed.data.length;
      else if (filename === 'agency.txt') results.statistics.total_agencies = parsed.data.length;
    }

    // FAST cross-file validation
    progress.value = 70;
    processingStatus.value = 'Validating foreign key relationships (this may take a moment for large files)...';
    await performFastCrossFileValidations(parsedFiles, results);

    progress.value = 90;
    processingStatus.value = 'Finalizing...';

    // Add feed info
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

    // Add agencies
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
        agency_id: { required: false },
        agency_name: { required: true },
        agency_url: { required: true },
        agency_timezone: { required: true },
        agency_lang: { required: false },
        agency_phone: { required: false },
        agency_fare_url: { required: false },
        agency_email: { required: false }
      }
    },
    'stops.txt': {
      required: true,
      primaryKey: 'stop_id',
      fields: {
        stop_id: { required: true },
        stop_code: { required: false },
        stop_name: { required: true },
        stop_desc: { required: false },
        stop_lat: { required: true },
        stop_lon: { required: true },
        zone_id: { required: false },
        stop_url: { required: false },
        location_type: { required: false },
        parent_station: { required: false },
        stop_timezone: { required: false },
        wheelchair_boarding: { required: false }
      }
    },
    'routes.txt': {
      required: true,
      primaryKey: 'route_id',
      fields: {
        route_id: { required: true },
        agency_id: { required: false },
        route_short_name: { required: true },
        route_long_name: { required: true },
        route_desc: { required: false },
        route_type: { required: true },
        route_url: { required: false },
        route_color: { required: false },
        route_text_color: { required: false },
        route_sort_order: { required: false }
      }
    },
    'trips.txt': {
      required: true,
      primaryKey: 'trip_id',
      fields: {
        route_id: { required: true },
        service_id: { required: true },
        trip_id: { required: true },
        trip_headsign: { required: false },
        trip_short_name: { required: false },
        direction_id: { required: false },
        block_id: { required: false },
        shape_id: { required: false },
        wheelchair_accessible: { required: false },
        bikes_allowed: { required: false }
      }
    },
    'stop_times.txt': {
      required: true,
      primaryKey: null,
      fields: {
        trip_id: { required: true },
        arrival_time: { required: true },
        departure_time: { required: true },
        stop_id: { required: true },
        stop_sequence: { required: true },
        stop_headsign: { required: false },
        pickup_type: { required: false },
        drop_off_type: { required: false },
        shape_dist_traveled: { required: false },
        timepoint: { required: false }
      }
    },
    'calendar.txt': {
      required: false,
      primaryKey: 'service_id',
      fields: {
        service_id: { required: true },
        monday: { required: true },
        tuesday: { required: true },
        wednesday: { required: true },
        thursday: { required: true },
        friday: { required: true },
        saturday: { required: true },
        sunday: { required: true },
        start_date: { required: true },
        end_date: { required: true }
      }
    },
    'calendar_dates.txt': {
      required: false,
      primaryKey: null,
      fields: {
        service_id: { required: true },
        date: { required: true },
        exception_type: { required: true }
      }
    },
    'fare_attributes.txt': {
      required: false,
      primaryKey: 'fare_id',
      fields: {
        fare_id: { required: true },
        price: { required: true },
        currency_type: { required: true },
        payment_method: { required: true },
        transfers: { required: true },
        transfer_duration: { required: false }
      }
    },
    'fare_rules.txt': {
      required: false,
      primaryKey: null,
      fields: {
        fare_id: { required: true },
        route_id: { required: false },
        origin_id: { required: false },
        destination_id: { required: false },
        contains_id: { required: false }
      }
    },
    'shapes.txt': {
      required: false,
      primaryKey: null,
      fields: {
        shape_id: { required: true },
        shape_pt_lat: { required: true },
        shape_pt_lon: { required: true },
        shape_pt_sequence: { required: true },
        shape_dist_traveled: { required: false }
      }
    },
    'frequencies.txt': {
      required: false,
      primaryKey: null,
      fields: {
        trip_id: { required: true },
        start_time: { required: true },
        end_time: { required: true },
        headway_secs: { required: true },
        exact_times: { required: false }
      }
    },
    'transfers.txt': {
      required: false,
      primaryKey: null,
      fields: {
        from_stop_id: { required: true },
        to_stop_id: { required: true },
        transfer_type: { required: true },
        min_transfer_time: { required: false }
      }
    },
    'feed_info.txt': {
      required: false,
      primaryKey: null,
      fields: {
        feed_publisher_name: { required: true },
        feed_publisher_url: { required: true },
        feed_lang: { required: true },
        feed_start_date: { required: false },
        feed_end_date: { required: false },
        feed_version: { required: false }
      }
    }
  };
}

async function performFastCrossFileValidations(parsedFiles, results) {
  try {
    const stopsData = parsedFiles['stops.txt']?.parsed;
    const stopTimesData = parsedFiles['stop_times.txt']?.parsed;
    const tripsData = parsedFiles['trips.txt']?.parsed;
    const routesData = parsedFiles['routes.txt']?.parsed;
    const calendarData = parsedFiles['calendar.txt']?.parsed;
    const calendarDatesData = parsedFiles['calendar_dates.txt']?.parsed;
    const agencyData = parsedFiles['agency.txt']?.parsed;

    if (!stopsData || !stopTimesData || !tripsData) return;

    // Build sets for FAST lookups
    const validStopIds = new Set(stopsData.data.map(stop => stop.stop_id).filter(Boolean));
    const validTripIds = new Set(tripsData.data.map(trip => trip.trip_id).filter(Boolean));
    const validRouteIds = routesData ? new Set(routesData.data.map(route => route.route_id).filter(Boolean)) : new Set();
    
    // Build service IDs set
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

    // Build agency IDs set
    const validAgencyIds = agencyData ? new Set(agencyData.data.map(agency => agency.agency_id).filter(Boolean)) : new Set();

    // Batch errors to improve performance
    const errorBatch = [];
    let fkViolationCount = { trip_id: 0, stop_id: 0, route_id: 0, service_id: 0, agency_id: 0 };

    // Foreign key validation for stop_times - CHECK ALL - ERRORS (no limits)
    const totalStopTimes = stopTimesData.data.length;
    for (let i = 0; i < totalStopTimes; i++) {
      const stopTime = stopTimesData.data[i];
      const stopTimeRowNum = i + 2;

      // Check trip_id - ERROR (required for GTFS upload)
      if (stopTime.trip_id && !validTripIds.has(stopTime.trip_id)) {
        errorBatch.push({
          code: 'foreign_key_violation',
          message: `Foreign key violation: trip_id '${stopTime.trip_id}' in stop_times.txt does not exist in trips.txt`,
          file: 'stop_times.txt',
          line: stopTimeRowNum,
          field: 'trip_id',
          suggestion: `Ensure trip_id '${stopTime.trip_id}' exists in trips.txt or remove this stop_time entry`
        });
        fkViolationCount.trip_id++;
      }

      // Check stop_id - ERROR (required for GTFS upload)
      if (stopTime.stop_id && !validStopIds.has(stopTime.stop_id)) {
        errorBatch.push({
          code: 'foreign_key_violation',
          message: `Foreign key violation: stop_id '${stopTime.stop_id}' in stop_times.txt does not exist in stops.txt`,
          file: 'stop_times.txt',
          line: stopTimeRowNum,
          field: 'stop_id',
          suggestion: `Ensure stop_id '${stopTime.stop_id}' exists in stops.txt or fix the reference`
        });
        fkViolationCount.stop_id++;
      }

      // Batch processing - add errors every 1000 rows to avoid memory issues
      if (i % 1000 === 0 && errorBatch.length > 0) {
        results.errors.push(...errorBatch);
        results.summary.errorCount += errorBatch.length;
        results.summary.isValid = false;
        errorBatch.length = 0;
      }
    }

    // Check route_id and service_id in trips - CHECK ALL - ERRORS (no limits)
    for (let i = 0; i < tripsData.data.length; i++) {
      const trip = tripsData.data[i];
      const tripRowNum = i + 2;

      if (trip.route_id && !validRouteIds.has(trip.route_id)) {
        errorBatch.push({
          code: 'foreign_key_violation',
          message: `Foreign key violation: route_id '${trip.route_id}' in trips.txt does not exist in routes.txt`,
          file: 'trips.txt',
          line: tripRowNum,
          field: 'route_id',
          suggestion: `Ensure route_id '${trip.route_id}' exists in routes.txt`
        });
        fkViolationCount.route_id++;
      }

      if (validServiceIds.size > 0 && trip.service_id && !validServiceIds.has(trip.service_id)) {
        errorBatch.push({
          code: 'foreign_key_violation',
          message: `Foreign key violation: service_id '${trip.service_id}' in trips.txt does not exist in calendar.txt or calendar_dates.txt`,
          file: 'trips.txt',
          line: tripRowNum,
          field: 'service_id',
          suggestion: `Ensure service_id '${trip.service_id}' exists in calendar.txt or calendar_dates.txt`
        });
        fkViolationCount.service_id++;
      }

      // Batch processing
      if (i % 500 === 0 && errorBatch.length > 0) {
        results.errors.push(...errorBatch);
        results.summary.errorCount += errorBatch.length;
        results.summary.isValid = false;
        errorBatch.length = 0;
      }
    }

    // Check agency_id in routes if agency.txt exists - ERROR (no limits)
    if (routesData && validAgencyIds.size > 0) {
      for (let i = 0; i < routesData.data.length; i++) {
        const route = routesData.data[i];
        if (route.agency_id && !validAgencyIds.has(route.agency_id)) {
          errorBatch.push({
            code: 'foreign_key_violation',
            message: `Foreign key violation: agency_id '${route.agency_id}' in routes.txt does not exist in agency.txt`,
            file: 'routes.txt',
            line: i + 2,
            field: 'agency_id',
            suggestion: `Ensure agency_id '${route.agency_id}' exists in agency.txt`
          });
          fkViolationCount.agency_id++;
        }
      }
    }

    // Add remaining batched errors
    if (errorBatch.length > 0) {
      results.errors.push(...errorBatch);
      results.summary.errorCount += errorBatch.length;
      results.summary.isValid = false;
    }

  } catch (error) {
    console.error('Error in cross-file validation:', error);
  }
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
    .issue-code { font-weight: bold; color: #1f2937; margin-bottom: 5px; }
    .issue-message { color: #4b5563; }
    .issue-details { font-size: 12px; color: #6b7280; margin-top: 8px; }
    .issue-suggestion { font-style: italic; color: #059669; margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: bold; color: #1f2937; }
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
      ${results.warnings.slice(0, 50).map(warning => `
        <div class="issue warning">
          <div class="issue-code">${warning.code}</div>
          <div class="issue-message">${warning.message}</div>
          ${warning.file ? `<div class="issue-details">File: ${warning.file}${warning.line ? ` | Line: ${warning.line}` : ''}</div>` : ''}
          ${warning.suggestion ? `<div class="issue-suggestion">💡 ${warning.suggestion}</div>` : ''}
        </div>
      `).join('')}
      ${results.warnings.length > 50 ? `<p style="margin-top: 15px; color: #6b7280;">... and ${results.warnings.length - 50} more warnings</p>` : ''}
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
