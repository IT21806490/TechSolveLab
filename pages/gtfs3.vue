<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
    <div class="container mx-auto max-w-6xl">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              ⏱️ GTFS Stop Times Generator & Editor
            </h1>
            <p class="text-gray-600">
              Upload stops.txt and shapes.txt to generate stop_times.txt OR upload existing stop_times.txt to edit
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
              <svg v-if="!isLoadingShapes" class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="animate-spin w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-blue-800 font-medium">{{ shapesFileName }}</span>
              <span v-if="!isLoadingShapes" class="ml-3 text-sm text-blue-600">({{ uniqueShapeIds.length }} unique shape IDs)</span>
              <span v-else class="ml-3 text-sm text-blue-600">Loading...</span>
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
                    New Shape ID (required to create modified shape)
                  </label>
                  <input
                    type="text"
                    v-model="newShapeId"
                    @input="clearGeneratedShapes"
                    class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter new shape ID"
                  />
                  <p class="text-xs text-blue-600 mt-1">
                    Changing this will clear the preview. Click "Generate Modified Shape" to update.
                  </p>
                </div>

                <!-- Generate Button -->
                <div class="mt-4">
                  <button
                    @click="generateModifiedShape"
                    :disabled="!newShapeId.trim()"
                    :class="[
                      'px-6 py-3 rounded-lg font-semibold transition-all shadow-md flex items-center space-x-2',
                      newShapeId.trim() 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span>Generate Modified Shape</span>
                  </button>
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

          <!-- Shape Preview -->
          <div v-if="generatedShapesData.length > 0" class="mt-6">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold text-gray-800">
                Modified Shape Preview
                <span class="text-sm font-normal text-gray-600 ml-2">
                  (Showing first 5 of {{ generatedShapesData.length }} rows)
                </span>
              </h3>
            </div>

            <!-- Preview Table -->
            <div class="overflow-x-auto rounded-lg border border-gray-200 mb-4">
              <table class="w-full">
                <thead class="bg-blue-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Shape ID
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Latitude
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Longitude
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Sequence
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Distance Traveled
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="(shape, i) in generatedShapesData.slice(0, 5)" 
                    :key="i" 
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">
                      {{ shape.shape_id }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700 font-mono">
                      {{ shape.shape_pt_lat }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700 font-mono">
                      {{ shape.shape_pt_lon }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">
                      {{ shape.shape_pt_sequence }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">
                      {{ shape.shape_dist_traveled || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <div class="flex-1">
                  <p class="text-green-700 text-sm font-medium">
                    Modified shape is ready to download!
                  </p>
                  <p class="text-green-600 text-xs mt-1">
                    Original shape ID "{{ selectedShapeId }}" has been changed to "{{ newShapeId }}" across all {{ generatedShapesData.length }} points.
                  </p>
                </div>
              </div>
            </div>

            <!-- Download Button -->
            <div class="flex justify-center">
              <button
                @click="downloadShapes"
                class="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Download shapes.txt ({{ generatedShapesData.length }} rows)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 1c: Upload stop_times.txt (Optional - for editing) -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          1c. Upload stop_times.txt File (Optional - for editing existing trips)
        </h2>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
          <input
            type="file"
            accept=".txt,.csv"
            @change="handleStopTimesFile"
            id="stopTimesFileInput"
            class="hidden"
          />
          <label
            for="stopTimesFileInput"
            class="cursor-pointer flex flex-col items-center"
          >
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-lg font-medium text-gray-700 mb-1">
              Click to upload stop_times.txt
            </span>
            <span class="text-sm text-gray-500">
              CSV format with trip_id, arrival_time, departure_time, stop_id, stop_sequence
            </span>
          </label>
        </div>
        
        <div v-if="stopTimesFileName" class="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg v-if="!isLoadingStopTimes" class="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="animate-spin w-5 h-5 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-orange-800 font-medium">{{ stopTimesFileName }}</span>
              <span v-if="!isLoadingStopTimes" class="ml-3 text-sm text-orange-600">({{ uniqueTripIds.length }} unique trip IDs)</span>
              <span v-else class="ml-3 text-sm text-orange-600">Loading...</span>
            </div>
          </div>
        </div>

        <!-- Trip ID Search and Selection -->
        <div v-if="uniqueTripIds.length > 0" class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Search and Select Trip ID
          </label>
          <div class="relative mb-4">
            <input
              type="text"
              v-model="tripSearchQuery"
              @input="filterTripIds"
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Type to search trip IDs..."
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <!-- Trip ID Search Results -->
          <div v-if="tripSearchQuery && filteredTripIds.length > 0" class="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            <div
              v-for="tripIdItem in filteredTripIds"
              :key="tripIdItem"
              @click="selectTripId(tripIdItem)"
              class="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div class="flex justify-between items-center">
                <div class="font-medium text-gray-900">{{ tripIdItem }}</div>
                <button class="text-orange-600 hover:text-orange-800">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Selected Trip Info -->
          <div v-if="selectedTripId" class="p-4 bg-orange-100 border-l-4 border-orange-500 rounded-lg">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="font-semibold text-orange-900 mb-1">Selected Trip ID</h4>
                <p class="text-orange-800 font-mono">{{ selectedTripId }}</p>
                <p class="text-sm text-orange-700 mt-1">{{ selectedTripStopTimes.length }} stops loaded</p>
                
                <!-- New Trip ID Input -->
                <div class="mt-3">
                  <label class="block text-sm font-medium text-orange-900 mb-1">
                    New Trip ID (required to create modified stop_times)
                  </label>
                  <input
                    type="text"
                    v-model="newTripId"
                    @input="clearEditMode"
                    class="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                    placeholder="Enter new trip ID"
                  />
                  <p class="text-xs text-orange-600 mt-1">
                    Changing this will clear the edit mode. Click "Load for Editing" to start.
                  </p>
                </div>

                <!-- Time Configuration for Edit Mode -->
                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-orange-900 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      v-model="editStartTime"
                      class="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-orange-900 mb-1">
                      Total Trip Duration (minutes)
                    </label>
                    <input
                      type="number"
                      v-model.number="editTotalDuration"
                      class="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                      placeholder="e.g., 120"
                      min="1"
                    />
                  </div>
                </div>

                <!-- Load for Editing Button -->
                <div class="mt-4">
                  <button
                    @click="loadTripForEditing"
                    :disabled="!newTripId.trim() || !editStartTime || !editTotalDuration"
                    :class="[
                      'px-6 py-3 rounded-lg font-semibold transition-all shadow-md flex items-center space-x-2',
                      (newTripId.trim() && editStartTime && editTotalDuration)
                        ? 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span>Load for Editing with Auto-Generated Times</span>
                  </button>
                  <p class="text-xs text-orange-600 mt-2">
                    Times will be automatically distributed evenly across all stops based on start time and duration.
                  </p>
                </div>
              </div>
              <button
                @click="clearSelectedTrip"
                class="ml-4 text-orange-700 hover:text-orange-900"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Configure Trip (Only show if NOT in edit mode) -->
      <div v-if="allStops.length > 0 && !isEditMode" class="bg-white rounded-lg shadow-lg p-6 mb-6">
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

      <!-- Step 3: Search and Select Stops (Only if NOT in edit mode) -->
      <div v-if="allStops.length > 0 && !isEditMode" class="bg-white rounded-lg shadow-lg p-6 mb-6">
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

      <!-- Step 3b: Edit Mode - Edit Stop Times -->
      <div v-if="isEditMode && editableStops.length > 0" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">
            3. Edit Stop Times
            <span class="text-sm font-normal text-gray-600 ml-2">
              (Trip: {{ newTripId }})
            </span>
          </h2>
          <button
            @click="cancelEditMode"
            class="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Cancel Edit Mode</span>
          </button>
        </div>

        <div class="space-y-2">
          <div
            v-for="(stop, index) in editableStops"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div class="flex items-center space-x-3 flex-1">
              <div class="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-semibold text-sm">
                {{ stop.stop_sequence }}
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ stop.stop_name || stop.stop_id }}</div>
                <div class="text-sm text-gray-500">{{ stop.stop_id }}</div>
              </div>
            </div>
            
            <!-- Time Inputs -->
            <div class="flex items-center space-x-3 mr-4">
              <div class="flex flex-col">
                <label class="text-xs text-gray-500 mb-1">Arrival</label>
                <input
                  type="time"
                  v-model="stop.arrival_time"
                  step="1"
                  class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div class="flex flex-col">
                <label class="text-xs text-gray-500 mb-1">Departure</label>
                <input
                  type="time"
                  v-model="stop.departure_time"
                  step="1"
                  class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="moveUpEditable(index)"
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
                @click="moveDownEditable(index)"
                :disabled="index === editableStops.length - 1"
                :class="[
                  'p-1 rounded',
                  index === editableStops.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <button
                @click="removeEditableStop(index)"
                class="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button
            @click="generateFromEditedStops"
            class="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Generate Modified Stop Times</span>
          </button>
        </div>
      </div>

      <!-- Step 4: Generate and Preview -->
      <div v-if="(selectedStops.length > 0 && tripId && startTime && (timeMode === 'custom' || totalDuration) && !isEditMode) || (isEditMode && generatedStopTimes.length > 0)" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">
            4. Preview and Generate Stop Times
          </h2>
          <button
            v-if="!isEditMode"
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

        <div v-if="generatedStopTimes.length > 0" class="mt-6 flex justify-center">
          <button
            @click="downloadStopTimes"
            class="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Download stop_times.txt</span>
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
const isLoadingShapes = ref(false);

// Stop Times editing state
const stopTimesFileName = ref("");
const allStopTimes = ref([]);
const uniqueTripIds = ref([]);
const filteredTripIds = ref([]);
const tripSearchQuery = ref("");
const selectedTripId = ref("");
const selectedTripStopTimes = ref([]);
const newTripId = ref("");
const isLoadingStopTimes = ref(false);
const isEditMode = ref(false);
const editableStops = ref([]);
const editStartTime = ref("08:00");
const editTotalDuration = ref(120);

// Create a Map for faster shape lookup
const shapesByIdMap = ref(new Map());

// Create a Map for faster stop times lookup by trip_id
const stopTimesByTripIdMap = ref(new Map());

// Create a Map for stop name lookup
const stopsMap = ref(new Map());

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

  isLoadingShapes.value = true;
  shapesFileName.value = file.name;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      parseShapesFile(e.target.result);
      isLoadingShapes.value = false;
    }, 0);
  };
  reader.readAsText(file);
}

function handleStopTimesFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  isLoadingStopTimes.value = true;
  stopTimesFileName.value = file.name;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    setTimeout(() => {
      parseStopTimesFile(e.target.result);
      isLoadingStopTimes.value = false;
    }, 0);
  };
  reader.readAsText(file);
}

function parseStopTimesFile(content) {
  const lines = content.trim().split('\n');
  
  if (lines.length < 2) {
    alert("Invalid stop_times.txt file");
    return;
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Find column indices
  const tripIdIndex = headers.indexOf('trip_id');
  const arrivalTimeIndex = headers.indexOf('arrival_time');
  const departureTimeIndex = headers.indexOf('departure_time');
  const stopIdIndex = headers.indexOf('stop_id');
  const stopSequenceIndex = headers.indexOf('stop_sequence');
  const pickupTypeIndex = headers.indexOf('pickup_type');
  const dropOffTypeIndex = headers.indexOf('drop_off_type');
  const timepointIndex = headers.indexOf('timepoint');

  if (tripIdIndex === -1 || arrivalTimeIndex === -1 || departureTimeIndex === -1 || 
      stopIdIndex === -1 || stopSequenceIndex === -1) {
    alert("stop_times.txt must contain trip_id, arrival_time, departure_time, stop_id, and stop_sequence columns");
    return;
  }

  // Use Map for faster lookups
  const stopTimesMap = new Map();
  const tripIdsSet = new Set();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCSVLine(line);
    
    const tripIdValue = parts[tripIdIndex]?.trim() || '';
    const stopTime = {
      trip_id: tripIdValue,
      arrival_time: parts[arrivalTimeIndex]?.trim() || '',
      departure_time: parts[departureTimeIndex]?.trim() || '',
      stop_id: parts[stopIdIndex]?.trim() || '',
      stop_sequence: parts[stopSequenceIndex]?.trim() || '',
      pickup_type: pickupTypeIndex !== -1 ? parts[pickupTypeIndex]?.trim() || '0' : '0',
      drop_off_type: dropOffTypeIndex !== -1 ? parts[dropOffTypeIndex]?.trim() || '0' : '0',
      timepoint: timepointIndex !== -1 ? parts[timepointIndex]?.trim() || '0' : '0'
    };
    
    // Group by trip_id using Map for O(1) lookup
    if (!stopTimesMap.has(tripIdValue)) {
      stopTimesMap.set(tripIdValue, []);
    }
    stopTimesMap.get(tripIdValue).push(stopTime);
    tripIdsSet.add(tripIdValue);
  }

  // Sort each trip's stop times by sequence
  stopTimesMap.forEach((stopTimes, tripId) => {
    stopTimes.sort((a, b) => parseInt(a.stop_sequence) - parseInt(b.stop_sequence));
  });

  // Store in ref for fast access
  stopTimesByTripIdMap.value = stopTimesMap;
  uniqueTripIds.value = Array.from(tripIdsSet).sort();
  
  console.log(`Loaded ${uniqueTripIds.value.length} trip IDs with ${lines.length - 1} total stop times`);
}

function filterTripIds() {
  if (!tripSearchQuery.value) {
    filteredTripIds.value = [];
    return;
  }

  const query = tripSearchQuery.value.toLowerCase();
  filteredTripIds.value = uniqueTripIds.value
    .filter(tripId => tripId.toLowerCase().includes(query))
    .slice(0, 20);
}

function selectTripId(tripIdValue) {
  selectedTripId.value = tripIdValue;
  
  // Use the pre-sorted stop times from Map - instant lookup!
  selectedTripStopTimes.value = stopTimesByTripIdMap.value.get(tripIdValue) || [];
  
  tripSearchQuery.value = "";
  filteredTripIds.value = [];
  newTripId.value = "";
  isEditMode.value = false;
  editableStops.value = [];
  generatedStopTimes.value = [];
}

function clearSelectedTrip() {
  selectedTripId.value = "";
  selectedTripStopTimes.value = [];
  newTripId.value = "";
  isEditMode.value = false;
  editableStops.value = [];
  generatedStopTimes.value = [];
  editStartTime.value = "08:00";
  editTotalDuration.value = 120;
}

function clearEditMode() {
  isEditMode.value = false;
  editableStops.value = [];
  generatedStopTimes.value = [];
  editStartTime.value = "08:00";
  editTotalDuration.value = 120;
}

function loadTripForEditing() {
  if (!newTripId.value.trim()) {
    alert("Please enter a new trip ID");
    return;
  }

  if (!editStartTime.value || !editTotalDuration.value) {
    alert("Please enter start time and total duration");
    return;
  }

  if (!selectedTripId.value || selectedTripStopTimes.value.length === 0) {
    alert("Please select a trip first");
    return;
  }

  // Parse start time
  const [startHour, startMinute] = editStartTime.value.split(':').map(Number);
  let currentMinutes = startHour * 60 + startMinute;

  // Calculate time interval for even distribution
  const numStops = selectedTripStopTimes.value.length;
  const timeInterval = numStops > 1 ? editTotalDuration.value / (numStops - 1) : 0;

  // Load stops into editable mode with auto-generated times
  editableStops.value = selectedTripStopTimes.value.map((st, index) => {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = Math.floor(currentMinutes % 60);
    const seconds = Math.floor((currentMinutes % 1) * 60);
    
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Add time interval for next stop
    currentMinutes += timeInterval;

    return {
      ...st,
      arrival_time: timeString,
      departure_time: timeString,
      stop_name: stopsMap.value.get(st.stop_id)?.stop_name || '',
      stop_sequence: index.toString()
    };
  });
  
  isEditMode.value = true;
  generatedStopTimes.value = [];

  console.log(`Loaded ${editableStops.value.length} stops for editing with auto-generated times`);
}

function moveUpEditable(index) {
  if (index === 0) return;
  const temp = editableStops.value[index];
  editableStops.value[index] = editableStops.value[index - 1];
  editableStops.value[index - 1] = temp;
  
  // Update stop sequences
  editableStops.value.forEach((stop, i) => {
    stop.stop_sequence = i.toString();
  });
}

function moveDownEditable(index) {
  if (index === editableStops.value.length - 1) return;
  const temp = editableStops.value[index];
  editableStops.value[index] = editableStops.value[index + 1];
  editableStops.value[index + 1] = temp;
  
  // Update stop sequences
  editableStops.value.forEach((stop, i) => {
    stop.stop_sequence = i.toString();
  });
}

function removeEditableStop(index) {
  editableStops.value.splice(index, 1);
  
  // Update stop sequences
  editableStops.value.forEach((stop, i) => {
    stop.stop_sequence = i.toString();
  });
}

function cancelEditMode() {
  isEditMode.value = false;
  editableStops.value = [];
  generatedStopTimes.value = [];
  editStartTime.value = "08:00";
  editTotalDuration.value = 120;
}

function generateFromEditedStops() {
  if (editableStops.value.length === 0) {
    alert("No stops to generate");
    return;
  }

  generatedStopTimes.value = editableStops.value.map((stop, index) => ({
    trip_id: newTripId.value.trim(),
    arrival_time: stop.arrival_time,
    departure_time: stop.departure_time,
    stop_id: stop.stop_id,
    stop_name: stop.stop_name,
    stop_sequence: index,
    pickup_type: stop.pickup_type || 0,
    drop_off_type: stop.drop_off_type || 0,
    timepoint: stop.timepoint || 0
  }));

  console.log(`Generated ${generatedStopTimes.value.length} stop times from edited stops`);
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

  // Use Map for faster lookups
  const shapesMap = new Map();
  const shapeIdsSet = new Set();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCSVLine(line);
    
    const shapeId = parts[shapeIdIndex]?.trim() || '';
    const shapePoint = {
      shape_id: shapeId,
      shape_pt_lat: parts[shapePtLatIndex]?.trim() || '',
      shape_pt_lon: parts[shapePtLonIndex]?.trim() || '',
      shape_pt_sequence: parts[shapePtSequenceIndex]?.trim() || '',
      shape_dist_traveled: shapeDistTraveledIndex !== -1 ? parts[shapeDistTraveledIndex]?.trim() || '' : ''
    };
    
    // Group by shape_id using Map for O(1) lookup
    if (!shapesMap.has(shapeId)) {
      shapesMap.set(shapeId, []);
    }
    shapesMap.get(shapeId).push(shapePoint);
    shapeIdsSet.add(shapeId);
  }

  // Sort each shape's points once during parsing
  shapesMap.forEach((points, shapeId) => {
    points.sort((a, b) => parseInt(a.shape_pt_sequence) - parseInt(b.shape_pt_sequence));
  });

  // Store in ref for fast access
  shapesByIdMap.value = shapesMap;
  uniqueShapeIds.value = Array.from(shapeIdsSet).sort();
  
  console.log(`Loaded ${uniqueShapeIds.value.length} shape IDs with ${lines.length - 1} total points`);
}

function filterShapes() {
  if (!shapeSearchQuery.value) {
    filteredShapeIds.value = [];
    return;
  }

  const query = shapeSearchQuery.value.toLowerCase();
  // Limit results immediately for better performance
  filteredShapeIds.value = uniqueShapeIds.value
    .filter(shapeId => shapeId.toLowerCase().includes(query))
    .slice(0, 20);
}

function selectShapeId(shapeId) {
  selectedShapeId.value = shapeId;
  
  // Use the pre-sorted points from Map - instant lookup!
  selectedShapePoints.value = shapesByIdMap.value.get(shapeId) || [];
  
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

function clearGeneratedShapes() {
  // Clear the preview when user changes the new shape ID
  generatedShapesData.value = [];
}

function generateModifiedShape() {
  if (!newShapeId.value.trim()) {
    alert("Please enter a new shape ID");
    return;
  }

  if (!selectedShapeId.value || selectedShapePoints.value.length === 0) {
    alert("Please select a shape first");
    return;
  }

  // Generate the modified shapes data
  generatedShapesData.value = selectedShapePoints.value.map(point => ({
    shape_id: newShapeId.value.trim(),
    shape_pt_lat: point.shape_pt_lat,
    shape_pt_lon: point.shape_pt_lon,
    shape_pt_sequence: point.shape_pt_sequence,
    shape_dist_traveled: point.shape_dist_traveled
  }));

  console.log(`Generated ${generatedShapesData.value.length} shape points with new ID: ${newShapeId.value}`);
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
  const tempStopsMap = new Map();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCSVLine(line);
    
    const stop = {
      stop_id: parts[stopIdIndex]?.trim() || '',
      stop_name: parts[stopNameIndex]?.trim() || '',
      stop_lat: parts[stopLatIndex]?.trim() || '',
      stop_lon: parts[stopLonIndex]?.trim() || ''
    };
    
    allStops.value.push(stop);
    tempStopsMap.set(stop.stop_id, stop);
  }
  
  stopsMap.value = tempStopsMap;
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
}

function downloadStopTimes() {
  if (generatedStopTimes.value.length === 0) return;

  const csvContent =
    "trip_id,arrival_time,departure_time,stop_id,stop_sequence,pickup_type,drop_off_type,timepoint\n" +
    generatedStopTimes.value
      .map(st => `${st.trip_id},${st.arrival_time},${st.departure_time},${st.stop_id},${st.stop_sequence},${st.pickup_type},${st.drop_off_type},${st.timepoint}`)
      .join("\n");

  const filename = isEditMode.value 
    ? `stop_times_${newTripId.value.replace(/\//g, '_')}.txt`
    : `stop_times_${tripId.value.replace(/\//g, '_')}.txt`;

  downloadFile(csvContent, filename);
}

function downloadShapes() {
  if (generatedShapesData.value.length === 0) return;

  const csvContent =
    "shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled\n" +
    generatedShapesData.value
      .map(sp => `${sp.shape_id},${sp.shape_pt_lat},${sp.shape_pt_lon},${sp.shape_pt_sequence},${sp.shape_dist_traveled}`)
      .join("\n");

  downloadFile(csvContent, `shapes_${newShapeId.value.replace(/\//g, '_')}.txt`);
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
