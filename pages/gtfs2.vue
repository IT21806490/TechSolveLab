<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4">
    <div class="container mx-auto max-w-5xl">
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
  <div class="flex justify-between items-start flex-wrap gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        🗺️ GTFS Shapes & Stops Generator
      </h1>
      <p class="text-gray-600">
        Upload KML file to generate GTFS shapes.txt and stops.txt files
      </p>
    </div>

    <!-- Back Button -->
    <a
  href="/gtfs"
  class="
    mt-1 ml-4 flex-shrink-0
    bg-gradient-to-r from-blue-600 to-indigo-600
    text-white
    px-6 py-3
    rounded-lg
    font-semibold
    hover:from-blue-700 hover:to-indigo-700
    transition-all
    shadow-md hover:shadow-lg
    flex items-center justify-center space-x-2
    focus:outline-none
    focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
  "
>
  <svg
    class="w-5 h-5 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
  <span>GTFS Frequencies Generator</span>
</a>
  </div>
</div>

      

      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          1. Upload KML File
        </h2>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <div class="flex-1">
              <h4 class="text-blue-800 font-semibold mb-1">KML File Requirements</h4>
              <p class="text-blue-700 text-sm mb-2">
                Your KML file should contain:
              </p>
              <ul class="text-blue-700 text-sm space-y-1">
                <li>• <strong>LineString</strong> elements for route shapes (coordinates)</li>
                <li>• <strong>Point</strong> elements (Placemarks) for stops with names</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
          <input
            type="file"
            accept=".kml"
            @change="handleFile"
            id="fileInput"
            class="hidden"
          />
          <label
            for="fileInput"
            class="cursor-pointer flex flex-col items-center"
          >
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            <span class="text-lg font-medium text-gray-700 mb-1">
              Click to upload or drag and drop
            </span>
            <span class="text-sm text-gray-500">
              KML file with route shapes and stops
            </span>
          </label>
        </div>
        
        <div v-if="fileName" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-green-800 font-medium">{{ fileName }}</span>
        </div>
      </div>

      <div v-if="upShapes.length || downShapes.length" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          2. Configure Shape IDs
        </h2>
        
        <div v-if="upShapes.length" class="mb-4">
          <div class="flex items-center space-x-4">
            <label class="text-gray-700 font-medium w-32">
              Up Trip:
            </label>
            <input
              type="text"
              v-model="upShapeId"
              @input="updateUpShapeId"
              class="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Shape_A003_Up"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1 ml-36">
            {{ upShapes.length }} shape points
          </p>
        </div>
        
        <div v-if="downShapes.length">
          <div class="flex items-center space-x-4">
            <label class="text-gray-700 font-medium w-32">
              Down Trip:
            </label>
            <input
              type="text"
              v-model="downShapeId"
              @input="updateDownShapeId"
              class="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Shape_A003_Down"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1 ml-36">
            {{ downShapes.length }} shape points
          </p>
        </div>
      </div>

      <div v-if="warnings.length" class="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-orange-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-orange-800 font-semibold mb-2">Warnings</h3>
            <ul class="space-y-1">
              <li v-for="(w, i) in warnings" :key="i" class="text-orange-700 text-sm">
                • {{ w }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="upShapes.length || downShapes.length || upStops.length || downStops.length" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          3. Review Generated Data
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-green-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-green-600">{{ upShapes.length }}</div>
            <div class="text-xs text-gray-600">Up Trip Shapes</div>
          </div>
          <div class="bg-teal-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-teal-600">{{ downShapes.length }}</div>
            <div class="text-xs text-gray-600">Down Trip Shapes</div>
          </div>
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-blue-600">{{ upStops.length }}</div>
            <div class="text-xs text-gray-600">Up Trip Stops</div>
          </div>
          <div class="bg-indigo-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-indigo-600">{{ downStops.length }}</div>
            <div class="text-xs text-gray-600">Down Trip Stops</div>
          </div>
        </div>

        <div class="border-b border-gray-200 mb-4">
          <nav class="-mb-px flex space-x-4">
            <button
              v-if="upShapes.length"
              @click="activeTab = 'upShapes'"
              :class="[
                'py-3 px-4 border-b-2 font-medium text-sm transition-colors flex flex-col items-center',
                activeTab === 'upShapes'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="text-2xl font-bold mb-1">{{ upShapes.length }}</span>
              <span class="text-xs">Up Trip Shapes</span>
            </button>
            <button
              v-if="downShapes.length"
              @click="activeTab = 'downShapes'"
              :class="[
                'py-3 px-4 border-b-2 font-medium text-sm transition-colors flex flex-col items-center',
                activeTab === 'downShapes'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="text-2xl font-bold mb-1">{{ downShapes.length }}</span>
              <span class="text-xs">Down Trip Shapes</span>
            </button>
            <button
              v-if="upStops.length"
              @click="activeTab = 'upStops'"
              :class="[
                'py-3 px-4 border-b-2 font-medium text-sm transition-colors flex flex-col items-center',
                activeTab === 'upStops'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="text-2xl font-bold mb-1">{{ upStops.length }}</span>
              <span class="text-xs">Up Trip Stops</span>
            </button>
            <button
              v-if="downStops.length"
              @click="activeTab = 'downStops'"
              :class="[
                'py-3 px-4 border-b-2 font-medium text-sm transition-colors flex flex-col items-center',
                activeTab === 'downStops'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="text-2xl font-bold mb-1">{{ downStops.length }}</span>
              <span class="text-xs">Down Trip Stops</span>
            </button>
          </nav>
        </div>

        <div v-if="activeTab === 'upShapes'" class="overflow-x-auto rounded-lg border border-gray-200">
          <div class="max-h-96 overflow-y-auto">
            <table class="w-full">
              <thead class="bg-green-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Shape ID
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Longitude
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Latitude
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sequence
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="(shape, i) in upShapes" 
                  :key="i" 
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    {{ shape.shape_id }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ shape.shape_pt_lon }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ shape.shape_pt_lat }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ shape.shape_pt_sequence }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab === 'downShapes'" class="overflow-x-auto rounded-lg border border-gray-200">
          <div class="max-h-96 overflow-y-auto">
            <table class="w-full">
              <thead class="bg-teal-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Shape ID
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Longitude
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Latitude
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sequence
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="(shape, i) in downShapes" 
                  :key="i" 
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    {{ shape.shape_id }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ shape.shape_pt_lon }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ shape.shape_pt_lat }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ shape.shape_pt_sequence }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab === 'upStops'" class="overflow-x-auto rounded-lg border border-gray-200">
          <div class="max-h-96 overflow-y-auto">
            <table class="w-full">
              <thead class="bg-blue-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stop ID
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stop Name
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Latitude
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Longitude
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="(stop, i) in upStops" 
                  :key="i" 
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    <input
                      type="text"
                      v-model="stop.stop_id"
                      class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter stop ID"
                    />
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ stop.stop_name }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ stop.stop_lat }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ stop.stop_lon }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              💡 Tip: Edit the Stop ID column to assign unique identifiers to each stop
            </p>
          </div>
        </div>

        <div v-if="activeTab === 'downStops'" class="overflow-x-auto rounded-lg border border-gray-200">
          <div class="max-h-96 overflow-y-auto">
            <table class="w-full">
              <thead class="bg-indigo-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stop ID
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stop Name
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Latitude
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Longitude
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="(stop, i) in downStops" 
                  :key="i" 
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    <input
                      type="text"
                      v-model="stop.stop_id"
                      class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter stop ID"
                    />
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ stop.stop_name }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ stop.stop_lat }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ stop.stop_lon }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-4 bg-gray-50 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              💡 Tip: Edit the Stop ID column to assign unique identifiers to each stop
            </p>
          </div>
        </div>
      </div>

      <div v-if="upShapes.length || downShapes.length || upStops.length || downStops.length" class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          4. Download Files
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            v-if="upShapes.length"
            @click="downloadUpShapes"
            class="bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
          >
            <div class="flex items-center justify-center space-x-2 text-white">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span class="text-white">Download Up Trip Shapes</span>
            </div>
            <div class="text-xs mt-1 text-white opacity-90">shapes_up.txt ({{ upShapes.length }} points)</div>
          </button>
          
          <button
            v-if="downShapes.length"
            @click="downloadDownShapes"
            class="bg-teal-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all shadow-md hover:shadow-lg"
          >
            <div class="flex items-center justify-center space-x-2 text-white">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span class="text-white">Download Down Trip Shapes</span>
            </div>
            <div class="text-xs mt-1 text-white opacity-90">shapes_down.txt ({{ downShapes.length }} points)</div>
          </button>
          
          <button
            v-if="upStops.length"
            @click="downloadUpStops"
            class="bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <div class="flex items-center justify-center space-x-2 text-white">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span class="text-white">Download Up Trip Stops</span>
            </div>
            <div class="text-xs mt-1 text-white opacity-90">stops_up.txt ({{ upStops.length }} stops)</div>
          </button>
          
          <button
            v-if="downStops.length"
            @click="downloadDownStops"
            class="bg-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <div class="flex items-center justify-center space-x-2 text-white">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span class="text-white">Download Down Trip Stops</span>
            </div>
            <div class="text-xs mt-1 text-white opacity-90">stops_down.txt ({{ downStops.length }} stops)</div>
          </button>
        </div>
      </div>

      <div v-if="!upShapes.length && !downShapes.length && !upStops.length && !downStops.length && !warnings.length" class="bg-white rounded-lg shadow-lg p-12 text-center">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          No file uploaded yet
        </h3>
        <p class="text-gray-500">
          Upload a KML file to get started
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const upShapes = ref([]);
const downShapes = ref([]);
const upStops = ref([]);
const downStops = ref([]);
const warnings = ref([]);
const fileName = ref("");
const upShapeId = ref("Shape_A003_Up");
const downShapeId = ref("Shape_A003_Down");
const activeTab = ref("upShapes");

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  fileName.value = file.name;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    parseKML(e.target.result);
  };
  reader.readAsText(file);
}

function parseKML(kmlText) {
  warnings.value = [];
  upShapes.value = [];
  downShapes.value = [];
  upStops.value = [];
  downStops.value = [];

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, "text/xml");

    // Check for parsing errors
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      warnings.value.push("Invalid KML file format");
      return;
    }

    // Extract all LineStrings for shapes
    const allLineStrings = xmlDoc.querySelectorAll("LineString");
    
    allLineStrings.forEach((lineString, lineIndex) => {
      const coordElement = lineString.querySelector("coordinates");
      if (!coordElement) return;

      const coordText = coordElement.textContent.trim();
      const coordLines = coordText.split("\n").filter(line => line.trim());
      
      let shapeSequence = 0;

      coordLines.forEach((line) => {
        const parts = line.trim().split(",");
        if (parts.length >= 2) {
          const lon = parseFloat(parts[0]);
          const lat = parseFloat(parts[1]);

          if (!isNaN(lon) && !isNaN(lat)) {
            const shapePoint = {
              shape_id: lineIndex === 0 ? upShapeId.value : downShapeId.value,
              shape_pt_lon: lon.toFixed(5),
              shape_pt_lat: lat.toFixed(5),
              shape_pt_sequence: shapeSequence++
            };

            // First LineString is Up trip
            // Second LineString is Down trip
            if (lineIndex === 0) {
              upShapes.value.push(shapePoint);
            } else if (lineIndex === 1) {
              downShapes.value.push(shapePoint);
            }
          }
        }
      });
    });

    // Extract all Folders to find stops (Primary Logic: Use Folders)
    const folders = xmlDoc.querySelectorAll("Folder");
    
    folders.forEach((folder) => {
      const folderName = folder.querySelector("name")?.textContent.trim().toLowerCase() || "";
      
      // Determine if this folder contains stops and which direction
      const isStopsUpFolder = folderName.includes("stops") && (folderName.includes("up") || folderName.includes("pettah"));
      const isStopsDownFolder = folderName.includes("stops") && (folderName.includes("down") || folderName.includes("maharagama"));
      
      // Extract Point placemarks for stops within this folder
      const placemarks = folder.querySelectorAll("Placemark");

      placemarks.forEach((placemark, placemarkIndex) => {
        const point = placemark.querySelector("Point coordinates");
        if (point) {
          const name = placemark.querySelector("name")?.textContent.trim() || "Unnamed Stop";
          const coordText = point.textContent.trim();
          const parts = coordText.split(",");

          if (parts.length >= 2) {
            const lon = parseFloat(parts[0]);
            const lat = parseFloat(parts[1]);

            if (!isNaN(lon) && !isNaN(lat)) {
              const stopData = {
                stop_id: `${(placemarkIndex + 1).toString().padStart(8, '0')}SP`,
                stop_name: name,
                stop_lat: lat.toFixed(7),
                stop_lon: lon.toFixed(7)
              };

              // Add to appropriate stops array based on folder name
              if (isStopsUpFolder) {
                upStops.value.push(stopData);
              } else if (isStopsDownFolder) {
                downStops.value.push(stopData);
              }
            }
          }
        }
      });
    });

    // --- FALLBACK LOGIC (Corrected) ---
    // If no stops found in specific folders, apply fallback logic
    if (upStops.value.length === 0 && downStops.value.length === 0) {
      const allPlacemarks = xmlDoc.querySelectorAll("Placemark");
      const combinedStops = []; // Temporary array to hold all parsed stops

      allPlacemarks.forEach((placemark) => {
        const point = placemark.querySelector("Point coordinates");
        if (point) {
          const name = placemark.querySelector("name")?.textContent.trim() || "Unnamed Stop";
          const coordText = point.textContent.trim();
          const parts = coordText.split(",");

          if (parts.length >= 2) {
            const lon = parseFloat(parts[0]);
            const lat = parseFloat(parts[1]);

            if (!isNaN(lon) && !isNaN(lat)) {
              // Collect all stops temporarily
              combinedStops.push({
                stop_name: name,
                stop_lat: lat.toFixed(7),
                stop_lon: lon.toFixed(7)
              });
            }
          }
        }
      });
      
      // HEURISTIC SPLIT: If both shapes are present, assume all stops are combined and split them.
      if (combinedStops.length > 0 && upShapes.value.length > 0 && downShapes.value.length > 0) {
        // Split the stops into two halves. Using Math.ceil for uneven splits.
        const splitIndex = Math.ceil(combinedStops.length / 2);
        
        // Assign first half to Up Stops, generating stop_id
        upStops.value = combinedStops.slice(0, splitIndex).map((stop, i) => ({
            ...stop,
            // Assign a directional default ID (e.g., UP_001)
            stop_id: `UP_${(i + 1).toString().padStart(3, '0')}`, 
        }));
        
        // Assign second half to Down Stops, generating stop_id
        downStops.value = combinedStops.slice(splitIndex).map((stop, i) => ({
            ...stop,
            // Assign a directional default ID (e.g., DN_001)
            stop_id: `DN_${(i + 1).toString().padStart(3, '0')}`, 
        }));

        warnings.value.push(`Stops were not separated by direction in KML folders. Heuristically split ${combinedStops.length} stops: ${upStops.value.length} assigned to 'Up' and ${downStops.value.length} to 'Down'. Please review and edit Stop IDs in section 3.`);

      } else if (combinedStops.length > 0) {
        // Fallback for single-direction (or no second shape): all stops go to upStops.
        upStops.value = combinedStops.map((stop, i) => ({
            ...stop,
            // Assign a generic stop ID (e.g., STOP_001SP)
            stop_id: `${(i + 1).toString().padStart(3, '0')}SP`,
        }));
      }
    }
    // --- END FALLBACK LOGIC ---

    // Add warnings if no data found
    if (upShapes.value.length === 0 && downShapes.value.length === 0) {
      warnings.value.push("No route shapes found in KML file");
    } else {
      if (upShapes.value.length === 0) {
        warnings.value.push("No up trip (Pettah to Maharagama) shape found");
      }
      if (downShapes.value.length === 0) {
        warnings.value.push("No down trip (Maharagama to Pettah) shape found");
      }
    }

    if (upStops.value.length === 0 && downStops.value.length === 0) {
      warnings.value.push("No stops found in KML file. Add Placemark points for stops.");
    }

    // Set default active tab
    if (upShapes.value.length > 0) {
      activeTab.value = "upShapes";
    } else if (downShapes.value.length > 0) {
      activeTab.value = "downShapes";
    } else if (upStops.value.length > 0) {
      activeTab.value = "upStops";
    } else if (downStops.value.length > 0) {
      activeTab.value = "downStops";
    }

  } catch (error) {
    warnings.value.push(`Error parsing KML: ${error.message}`);
  }
}

function updateUpShapeId() {
  upShapes.value.forEach(shape => {
    shape.shape_id = upShapeId.value;
  });
}

function updateDownShapeId() {
  downShapes.value.forEach(shape => {
    shape.shape_id = downShapeId.value;
  });
}

function downloadUpShapes() {
  if (upShapes.value.length === 0) return;

  const csvContent =
    "shape_id,shape_pt_lon,shape_pt_lat,shape_pt_sequence\n" +
    upShapes.value
      .map(s => `${s.shape_id},${s.shape_pt_lon},${s.shape_pt_lat},${s.shape_pt_sequence}`)
      .join("\n");

  downloadFile(csvContent, "shapes_up.txt");
}

function downloadDownShapes() {
  if (downShapes.value.length === 0) return;

  const csvContent =
    "shape_id,shape_pt_lon,shape_pt_lat,shape_pt_sequence\n" +
    downShapes.value
      .map(s => `${s.shape_id},${s.shape_pt_lon},${s.shape_pt_lat},${s.shape_pt_sequence}`)
      .join("\n");

  downloadFile(csvContent, "shapes_down.txt");
}

function downloadUpStops() {
  if (upStops.value.length === 0) return;

  const csvContent =
    "stop_id,stop_name,stop_lat,stop_lon\n" +
    upStops.value
      .map(s => `${s.stop_id},${s.stop_name},${s.stop_lat},${s.stop_lon}`)
      .join("\n");

  downloadFile(csvContent, "stops_up.txt");
}

function downloadDownStops() {
  if (downStops.value.length === 0) return;

  const csvContent =
    "stop_id,stop_name,stop_lat,stop_lon\n" +
    downStops.value
      .map(s => `${s.stop_id},${s.stop_name},${s.stop_lat},${s.stop_lon}`)
      .join("\n");

  downloadFile(csvContent, "stops_down.txt");
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
