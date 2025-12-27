<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
    <div class="container mx-auto max-w-6xl">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              ⏱️ GTFS Stop Times Generator
            </h1>
            <p class="text-gray-600">
              Upload stops.txt and shapes.txt to generate stop_times.txt and modified shapes.txt
            </p>
          </div>
        </div>
      </div>

      <!-- Step 1: Upload stops.txt -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          1. Upload stops.txt File
        </h2>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
          <input
            type="file"
            accept=".txt,.csv"
            @change="handleStopsFile"
            id="stopsFileInput"
            class="hidden"
          />
          <label
            for="stopsFileInput"
            class="cursor-pointer flex flex-col items-center"
          >
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span class="text-lg font-medium text-gray-700 mb-1">
              Click to upload stops.txt
            </span>
            <span class="text-sm text-gray-500">
              CSV format with stop_id, stop_name, stop_lat, stop_lon
            </span>
          </label>
        </div>
        
        <div v-if="stopsFileName" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-green-800 font-medium">{{ stopsFileName }}</span>
              <span class="ml-3 text-sm text-green-600">({{ allStops.length }} stops loaded)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 1b: Upload shapes.txt (Optional) -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          1b. Upload shapes.txt File (Optional)
        </h2>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept=".txt,.csv"
            @change="handleShapesFile"
            id="shapesFileInput"
            class="hidden"
            ref="shapesFileInputRef"
          />
          <label
            for="shapesFileInput"
            class="cursor-pointer flex flex-col items-center"
          >
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            <span class="text-lg font-medium text-gray-700 mb-1">
              Click to upload shapes.txt
            </span>
            <span class="text-sm text-gray-500">
              CSV format with shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence
            </span>
          </label>
        </div>
        
        <div v-if="shapesFileName" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-blue-800 font-medium">{{ shapesFileName }}</span>
              <span class="ml-3 text-sm text-blue-600">({{ uniqueShapeIds.length }} unique shape IDs)</span>
            </div>
          </div>
        </div>

        <!-- Shape ID Search and Selection -->
        <div v-if="uniqueShapeIds.length > 0" class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Search and Select Shape ID
          </label>
          <div class="relative mb-4">
            <input
              type="text"
              v-model="shapeSearchQuery"
              @input="filterShapes"
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type to search shape IDs..."
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <!-- Shape ID Search Results -->
          <div v-if="shapeSearchQuery && filteredShapeIds.length > 0" class="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            <div
              v-for="shapeId in filteredShapeIds"
              :key="shapeId"
              @click="selectShapeId(shapeId)"
              class="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div class="flex justify-between items-center">
                <div class="font-medium text-gray-900">{{ shapeId }}</div>
                <button class="text-blue-600 hover:text-blue-800">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Selected Shape Info -->
          <div v-if="selectedShapeId" class="p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="font-semibold text-blue-900 mb-1">Selected Shape ID</h4>
                <p class="text-blue-800 font-mono">{{ selectedShapeId }}</p>
                <p class="text-sm text-blue-700 mt-1">{{ selectedShapePoints.length }} shape points loaded</p>
                
                <!-- New Shape ID Input -->
                <div class="mt-3">
                  <label class="block text-sm font-medium text-blue-900 mb-1">
                    New Shape ID (optional - to create modified shape)
                  </label>
                  <input
                    type="text"
                    v-model="newShapeId"
                    class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter new shape ID or leave blank to use original"
                  />
                </div>
              </div>
              <button
                @click="clearSelectedShape"
                class="ml-4 text-blue-700 hover:text-blue-900"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Configure Trip -->
      <div v-if="allStops.length > 0" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          2. Configure Trip Details
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Trip ID
            </label>
            <input
              type="text"
              v-model="tripId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., WP_N_9/1"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              v-model="startTime"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Time Mode Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Time Calculation Mode
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              @click="timeMode = 'even'"
              :class="[
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                timeMode === 'even' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-300'
              ]"
            >
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    timeMode === 'even' ? 'border-purple-500' : 'border-gray-300'
                  ]">
                    <div v-if="timeMode === 'even'" class="w-3 h-3 rounded-full bg-purple-500"></div>
                  </div>
                </div>
                <div class="ml-3 flex-1">
                  <h3 class="font-semibold text-gray-800 mb-1">Even Distribution</h3>
                  <p class="text-sm text-gray-600">
                    Specify total trip duration and distribute time evenly across all stops
                  </p>
                </div>
              </div>
            </div>

            <div 
              @click="timeMode = 'custom'"
              :class="[
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                timeMode === 'custom' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-300'
              ]"
            >
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    timeMode === 'custom' ? 'border-purple-500' : 'border-gray-300'
                  ]">
                    <div v-if="timeMode === 'custom'" class="w-3 h-3 rounded-full bg-purple-500"></div>
                  </div>
                </div>
                <div class="ml-3 flex-1">
                  <h3 class="font-semibold text-gray-800 mb-1">Custom Time Gaps</h3>
                  <p class="text-sm text-gray-600">
                    Set individual time gaps (in minutes) between each stop
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Even Distribution Mode -->
        <div v-if="timeMode === 'even'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Total Trip Duration (minutes)
            </label>
            <input
              type="number"
              v-model.number="totalDuration"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 120"
              min="1"
            />
          </div>

          <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <div class="flex-1">
                <p class="text-blue-700 text-sm mb-2">
                  <strong>How it works:</strong> The total trip duration will be divided evenly across all selected stops.
                </p>
                <p class="text-blue-600 text-xs">
                  Example: 5 stops with 120 min = First stop at start time, then +30 min, +60 min, +90 min, +120 min
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Time Gaps Mode -->
        <div v-if="timeMode === 'custom'" class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <div class="flex-1">
              <p class="text-blue-700 text-sm mb-2">
                <strong>How it works:</strong> After selecting stops, you can specify the time gap (in minutes) between each stop.
              </p>
              <p class="text-blue-600 text-xs">
                Example: Stop 1 → 15 min → Stop 2 → 40 min → Stop 3 → 25 min → Stop 4
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Search and Select Stops -->
      <div v-if="allStops.length > 0" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          3. Search and Add Stops for This Trip
        </h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Search Stop Name
          </label>
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              @input="filterStops"
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Type to search stops..."
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Search Results -->
        <div v-if="searchQuery && filteredStops.length > 0" class="mb-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          <div
            v-for="stop in filteredStops"
            :key="stop.stop_id"
            @click="addStop(stop)"
            class="p-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
          >
            <div class="flex justify-between items-center">
              <div>
                <div class="font-medium text-gray-900">{{ stop.stop_name }}</div>
                <div class="text-sm text-gray-500">{{ stop.stop_id }}</div>
              </div>
              <button class="text-purple-600 hover:text-purple-800">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="searchQuery && filteredStops.length === 0" class="text-center py-8 text-gray-500">
          No stops found matching "{{ searchQuery }}"
        </div>

        <!-- Selected Stops -->
        <div v-if="selectedStops.length > 0" class="mt-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-semibold text-gray-800">
              Selected Stops ({{ selectedStops.length }})
              <span v-if="timeMode === 'custom' && totalCalculatedTime > 0" class="text-sm font-normal text-purple-600 ml-2">
                Total: {{ totalCalculatedTime }} minutes
              </span>
            </h3>
            <button
              @click="clearAllStops"
              class="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div class="space-y-2">
            <div
              v-for="(stop, index) in selectedStops"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex items-center space-x-3 flex-1">
                <div class="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold text-sm">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ stop.stop_name }}</div>
                  <div class="text-sm text-gray-500">{{ stop.stop_id }}</div>
                </div>
              </div>
              
              <!-- Custom Time Gap Input -->
              <div v-if="timeMode === 'custom' && index < selectedStops.length - 1" class="flex items-center space-x-2 mr-4">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <input
                  type="number"
                  v-model.number="stop.timeGapAfter"
                  class="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="min"
                  min="0"
                />
                <span class="text-xs text-gray-500">min</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  @click="moveUp(index)"
                  :disabled="index === 0"
                  :class="[
                    'p-1 rounded',
                    index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                </button>
                <button
                  @click="moveDown(index)"
                  :disabled="index === selectedStops.length - 1"
                  :class="[
                    'p-1 rounded',
                    index === selectedStops.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <button
                  @click="removeStop(index)"
                  class="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedStops.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <p class="text-gray-500">No stops selected. Search and add stops above.</p>
        </div>
      </div>

      <!-- Step 4: Generate and Preview -->
      <div v-if="selectedStops.length > 0 && tripId && startTime && (timeMode === 'custom' || totalDuration)" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">
            4. Preview and Generate
          </h2>
          <button
            @click="generateStopTimes"
            class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Generate Stop Times</span>
          </button>
        </div>

        <div v-if="generatedStopTimes.length > 0" class="overflow-x-auto rounded-lg border border-gray-200">
          <div class="max-h-96 overflow-y-auto">
            <table class="w-full">
              <thead class="bg-purple-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Seq
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Trip ID
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Arrival Time
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Departure Time
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stop ID
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stop Name
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="(stopTime, i) in generatedStopTimes" 
                  :key="i" 
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    {{ stopTime.stop_sequence }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ stopTime.trip_id }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 font-mono">
                    {{ stopTime.arrival_time }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 font-mono">
                    {{ stopTime.departure_time }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ stopTime.stop_id }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ stopTime.stop_name }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="generatedStopTimes.length > 0" class="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button
            @click="downloadStopTimes"
            class="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Download stop_times.txt</span>
          </button>

          <button
            v-if="selectedShapeId && generatedShapesData.length > 0"
            @click="downloadShapes"
            class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Download shapes.txt</span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="allStops.length === 0" class="bg-white rounded-lg shadow-lg p-12 text-center">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          No stops.txt file uploaded yet
        </h3>
        <p class="text-gray-500">
          Upload a stops.txt file to get started
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const allStops = ref([]);
const selectedStops = ref([]);
const filteredStops = ref([]);
const stopsFileName = ref("");
const searchQuery = ref("");
const tripId = ref("");
const startTime = ref("08:00");
const totalDuration = ref(120);
const generatedStopTimes = ref([]);
const timeMode = ref("even"); // "even" or "custom"

// Shapes-related state
const allShapes = ref([]);
const shapesFileName = ref("");
const uniqueShapeIds = ref([]);
const filteredShapeIds = ref([]);
const shapeSearchQuery = ref("");
const selectedShapeId = ref("");
const selectedShapePoints = ref([]);
const newShapeId = ref("");
const generatedShapesData = ref([]);
const shapesFileInputRef = ref(null);

const totalCalculatedTime = computed(() => {
  if (timeMode.value !== "custom") return 0;
  return selectedStops.value.reduce((sum, stop) => sum + (stop.timeGapAfter || 0), 0);
});

function handleStopsFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  stopsFileName.value = file.name;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    parseStopsFile(e.target.result);
  };
  reader.readAsText(file);
}

function handleShapesFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  shapesFileName.value = file.name;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    parseShapesFile(e.target.result);
  };
  reader.readAsText(file);
}

function parseShapesFile(content) {
  const lines = content.trim().split('\n');
  
  if (lines.length < 2) {
    alert("Invalid shapes.txt file");
    return;
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Find column indices
  const shapeIdIndex = headers.indexOf('shape_id');
  const shapePtLatIndex = headers.indexOf('shape_pt_lat');
  const shapePtLonIndex = headers.indexOf('shape_pt_lon');
  const shapePtSequenceIndex = headers.indexOf('shape_pt_sequence');
  const shapeDistTraveledIndex = headers.indexOf('shape_dist_traveled');

  if (shapeIdIndex === -1 || shapePtLatIndex === -1 || shapePtLonIndex === -1 || shapePtSequenceIndex === -1) {
    alert("shapes.txt must contain shape_id, shape_pt_lat, shape_pt_lon, and shape_pt_sequence columns");
    return;
  }

  // Parse data rows
  allShapes.value = [];
  const shapeIdsSet = new Set();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCSVLine(line);
    
    const shapePoint = {
      shape_id: parts[shapeIdIndex]?.trim() || '',
      shape_pt_lat: parts[shapePtLatIndex]?.trim() || '',
      shape_pt_lon: parts[shapePtLonIndex]?.trim() || '',
      shape_pt_sequence: parts[shapePtSequenceIndex]?.trim() || '',
      shape_dist_traveled: shapeDistTraveledIndex !== -1 ? parts[shapeDistTraveledIndex]?.trim() || '' : ''
    };
    
    allShapes.value.push(shapePoint);
    shapeIdsSet.add(shapePoint.shape_id);
  }

  uniqueShapeIds.value = Array.from(shapeIdsSet).sort();
}

function filterShapes() {
  if (!shapeSearchQuery.value) {
    filteredShapeIds.value = [];
    return;
  }

  const query = shapeSearchQuery.value.toLowerCase();
  filteredShapeIds.value = uniqueShapeIds.value
    .filter(shapeId => shapeId.toLowerCase().includes(query))
    .slice(0, 20);
}

function selectShapeId(shapeId) {
  selectedShapeId.value = shapeId;
  selectedShapePoints.value = allShapes.value
    .filter(point => point.shape_id === shapeId)
    .sort((a, b) => parseInt(a.shape_pt_sequence) - parseInt(b.shape_pt_sequence));
  
  shapeSearchQuery.value = "";
  filteredShapeIds.value = [];
  newShapeId.value = "";
  generatedShapesData.value = [];
}

function clearSelectedShape() {
  selectedShapeId.value = "";
  selectedShapePoints.value = [];
  newShapeId.value = "";
  generatedShapesData.value = [];
}

function parseStopsFile(content) {
  const lines = content.trim().split('\n');
  
  if (lines.length < 2) {
    alert("Invalid stops.txt file");
    return;
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Find column indices
  const stopIdIndex = headers.indexOf('stop_id');
  const stopNameIndex = headers.indexOf('stop_name');
  const stopLatIndex = headers.indexOf('stop_lat');
  const stopLonIndex = headers.indexOf('stop_lon');

  if (stopIdIndex === -1 || stopNameIndex === -1) {
    alert("stops.txt must contain stop_id and stop_name columns");
    return;
  }

  // Parse data rows - use proper CSV parsing
  allStops.value = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCSVLine(line);
    
    allStops.value.push({
      stop_id: parts[stopIdIndex]?.trim() || '',
      stop_name: parts[stopNameIndex]?.trim() || '',
      stop_lat: parts[stopLatIndex]?.trim() || '',
      stop_lon: parts[stopLonIndex]?.trim() || ''
    });
  }
}

// Helper function to parse CSV line properly
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Push the last field
  return result;
}

function filterStops() {
  if (!searchQuery.value) {
    filteredStops.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();
  filteredStops.value = allStops.value
    .filter(stop => 
      stop.stop_name.toLowerCase().includes(query) ||
      stop.stop_id.toLowerCase().includes(query)
    )
    .filter(stop => 
      !selectedStops.value.some(selected => selected.stop_id === stop.stop_id)
    )
    .slice(0, 20); // Limit to 20 results
}

function addStop(stop) {
  selectedStops.value.push({ 
    ...stop, 
    timeGapAfter: 0 // Minutes to next stop
  });
  searchQuery.value = "";
  filteredStops.value = [];
  generatedStopTimes.value = []; // Clear generated times when stops change
}

function removeStop(index) {
  selectedStops.value.splice(index, 1);
  generatedStopTimes.value = []; // Clear generated times when stops change
}

function clearAllStops() {
  selectedStops.value = [];
  generatedStopTimes.value = [];
}

function moveUp(index) {
  if (index === 0) return;
  const temp = selectedStops.value[index];
  selectedStops.value[index] = selectedStops.value[index - 1];
  selectedStops.value[index - 1] = temp;
  generatedStopTimes.value = []; // Clear generated times when order changes
}

function moveDown(index) {
  if (index === selectedStops.value.length - 1) return;
  const temp = selectedStops.value[index];
  selectedStops.value[index] = selectedStops.value[index + 1];
  selectedStops.value[index + 1] = temp;
  generatedStopTimes.value = []; // Clear generated times when order changes
}

function generateStopTimes() {
  if (!tripId.value || !startTime.value || selectedStops.value.length === 0) {
    alert("Please fill in all required fields and select at least one stop");
    return;
  }

  if (timeMode.value === "even" && !totalDuration.value) {
    alert("Please enter total trip duration");
    return;
  }

  generatedStopTimes.value = [];

  // Parse start time
  const [startHour, startMinute] = startTime.value.split(':').map(Number);
  let currentMinutes = startHour * 60 + startMinute;

  if (timeMode.value === "even") {
    // Even distribution mode
    const timeInterval = selectedStops.value.length > 1 
      ? totalDuration.value / (selectedStops.value.length - 1)
      : 0;

    selectedStops.value.forEach((stop, index) => {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = Math.floor(currentMinutes % 60);
      const seconds = Math.floor((currentMinutes % 1) * 60);
      
      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      generatedStopTimes.value.push({
        trip_id: tripId.value,
        arrival_time: timeString,
        departure_time: timeString,
        stop_id: stop.stop_id,
        stop_name: stop.stop_name,
        stop_sequence: index,
        pickup_type: 0,
        drop_off_type: 0,
        timepoint: 0
      });

      // Add time interval for next stop
      currentMinutes += timeInterval;
    });
  } else {
    // Custom time gaps mode
    selectedStops.value.forEach((stop, index) => {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = Math.floor(currentMinutes % 60);
      const seconds = 0;
      
      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      generatedStopTimes.value.push({
        trip_id: tripId.value,
        arrival_time: timeString,
        departure_time: timeString,
        stop_id: stop.stop_id,
        stop_name: stop.stop_name,
        stop_sequence: index,
        pickup_type: 0,
        drop_off_type: 0,
        timepoint: 0
      });

      // Add custom time gap to next stop
      currentMinutes += stop.timeGapAfter || 0;
    });
  }

  // Generate shapes data if shape is selected
  if (selectedShapeId.value && selectedShapePoints.value.length > 0) {
    const finalShapeId = newShapeId.value || selectedShapeId.value;
    
    generatedShapesData.value = selectedShapePoints.value.map(point => ({
      shape_id: finalShapeId,
      shape_pt_lat: point.shape_pt_lat,
      shape_pt_lon: point.shape_pt_lon,
      shape_pt_sequence: point.shape_pt_sequence,
      shape_dist_traveled: point.shape_dist_traveled
    }));
  }
}

function downloadStopTimes() {
  if (generatedStopTimes.value.length === 0) return;

  const csvContent =
    "trip_id,arrival_time,departure_time,stop_id,stop_sequence,pickup_type,drop_off_type,timepoint\n" +
    generatedStopTimes.value
      .map(st => `${st.trip_id},${st.arrival_time},${st.departure_time},${st.stop_id},${st.stop_sequence},${st.pickup_type},${st.drop_off_type},${st.timepoint}`)
      .join("\n");

  downloadFile(csvContent, `stop_times_${tripId.value.replace(/\//g, '_')}.txt`);
}

function downloadShapes() {
  if (generatedShapesData.value.length === 0) return;

  const finalShapeId = newShapeId.value || selectedShapeId.value;
  const csvContent =
    "shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled\n" +
    generatedShapesData.value
      .map(sp => `${sp.shape_id},${sp.shape_pt_lat},${sp.shape_pt_lon},${sp.shape_pt_sequence},${sp.shape_dist_traveled}`)
      .join("\n");

  downloadFile(csvContent, `shapes_${finalShapeId.replace(/\//g, '_')}.txt`);
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
