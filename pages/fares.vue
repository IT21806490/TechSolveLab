<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="container mx-auto max-w-4xl">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              💰 GTFS Fare Zone Generator
            </h1>
            <p class="text-gray-600">
              Automatically generate zone_id, fare_rules.txt, and fare_attributes.txt for your GTFS feed
            </p>
          </div>
        </div>
      </div>

      <!-- File Upload Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          1. Upload GTFS Files
        </h2>

        <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <div class="flex-1">
              <h4 class="text-blue-800 font-semibold mb-1">Required GTFS Files</h4>
              <p class="text-blue-700 text-sm mb-2">
                Upload these three GTFS files to generate fare zones and rules:
              </p>
              <div class="bg-white rounded p-2 font-mono text-sm border border-blue-200">
                <div class="text-blue-900">• <strong>stops.txt</strong> - Stop locations and IDs</div>
                <div class="text-blue-900">• <strong>trips.txt</strong> - Trip and route mappings</div>
                <div class="text-blue-900">• <strong>stop_times.txt</strong> - Stop sequences per trip</div>
              </div>
            </div>
          </div>
        </div>

        <!-- stops.txt -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            stops.txt <span class="text-red-500">*</span>
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".txt,.csv"
              @change="handleStops"
              id="stopsInput"
              class="hidden"
            />
            <label for="stopsInput" class="cursor-pointer flex flex-col items-center">
              <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700">Click to upload stops.txt</span>
            </label>
          </div>
          <div v-if="stopsFile" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-green-800 font-medium text-sm">{{ stopsFile.name }}</span>
          </div>
        </div>

        <!-- trips.txt -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            trips.txt <span class="text-red-500">*</span>
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".txt,.csv"
              @change="handleTrips"
              id="tripsInput"
              class="hidden"
            />
            <label for="tripsInput" class="cursor-pointer flex flex-col items-center">
              <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700">Click to upload trips.txt</span>
            </label>
          </div>
          <div v-if="tripsFile" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-green-800 font-medium text-sm">{{ tripsFile.name }}</span>
          </div>
        </div>

        <!-- stop_times.txt -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            stop_times.txt <span class="text-red-500">*</span>
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".txt,.csv"
              @change="handleStopTimes"
              id="stopTimesInput"
              class="hidden"
            />
            <label for="stopTimesInput" class="cursor-pointer flex flex-col items-center">
              <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700">Click to upload stop_times.txt</span>
            </label>
          </div>
          <div v-if="stopTimesFile" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-green-800 font-medium text-sm">{{ stopTimesFile.name }}</span>
          </div>
        </div>
      </div>

      <!-- Configuration Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          2. Configure Fare Settings
        </h2>

        <div class="mb-4">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="singleStage"
              class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span class="ml-3 text-gray-700 font-medium">
              Assign entire route as single fare stage
            </span>
          </label>
          <p class="text-sm text-gray-500 ml-8 mt-1">
            Recommended for simple flat-fare systems
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Fare ID
            </label>
            <input
              v-model="fareId"
              type="text"
              placeholder="FARE_NORMAL"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Fare Amount
            </label>
            <input
              v-model="fareAmount"
              type="number"
              step="0.01"
              placeholder="50.00"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Currency Code
            </label>
            <input
              v-model="currencyType"
              type="text"
              maxlength="3"
              placeholder="LKR"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            />
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          3. Generate Fare Files
        </h2>
        <button
          @click="generateZonesAndFares"
          :disabled="processing || !stopsFile || !tripsFile || !stopTimesFile"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!processing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <svg v-else class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ processing ? 'Processing...' : 'Generate Fare Files' }}</span>
        </button>
      </div>

      <!-- Results Section -->
      <div v-if="outputStops" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          4. Review & Download Results
        </h2>

        <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <div class="flex-1">
              <h3 class="text-green-800 font-semibold mb-2">✓ Files Generated Successfully!</h3>
              <p class="text-green-700 text-sm">
                Your GTFS fare files are ready for download
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="text-3xl font-bold text-blue-600">{{ routeCount }}</div>
            <div class="text-sm text-gray-600">Routes processed</div>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <div class="text-3xl font-bold text-green-600">{{ stopCount }}</div>
            <div class="text-sm text-gray-600">Stops with zones</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-4">
            <div class="text-3xl font-bold text-purple-600">{{ fareRuleCount }}</div>
            <div class="text-sm text-gray-600">Fare rules created</div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            @click="downloadFile(outputStops, 'stops.txt')"
            class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Download stops.txt (with zone_id)</span>
          </button>

          <button
            @click="downloadFile(outputFareRules, 'fare_rules.txt')"
            class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Download fare_rules.txt</span>
          </button>

          <button
            @click="downloadFile(outputFareAttributes, 'fare_attributes.txt')"
            class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Download fare_attributes.txt</span>
          </button>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Preview: stops.txt (first 10 rows)</h3>
          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <pre class="bg-gray-50 p-4 text-xs font-mono overflow-auto max-h-64">{{ previewStops }}</pre>
          </div>
        </div>

        <button
          @click="reset"
          class="w-full mt-4 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
        >
          Reset and Start Over
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="!outputStops && !processing" class="bg-white rounded-lg shadow-lg p-12 text-center">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          Ready to Generate Fare Files
        </h3>
        <p class="text-gray-500">
          Upload your GTFS files to get started
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Papa from 'papaparse'

const stopsFile = ref(null)
const tripsFile = ref(null)
const stopTimesFile = ref(null)
const outputStops = ref('')
const outputFareRules = ref('')
const outputFareAttributes = ref('')
const processing = ref(false)

const singleStage = ref(true)
const fareId = ref('FARE_NORMAL')
const fareAmount = ref('50.00')
const currencyType = ref('LKR')

const routeCount = ref(0)
const stopCount = ref(0)
const fareRuleCount = ref(0)

const previewStops = computed(() => {
  if (!outputStops.value) return ''
  return outputStops.value.split('\n').slice(0, 11).join('\n')
})

// File handlers
function handleStops(e) { stopsFile.value = e.target.files[0] }
function handleTrips(e) { tripsFile.value = e.target.files[0] }
function handleStopTimes(e) { stopTimesFile.value = e.target.files[0] }

// Parse CSV
async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: results => resolve(results.data),
      error: err => reject(err)
    })
  })
}

// Generate zones and fare_rules
async function generateZonesAndFares() {
  if (!stopsFile.value || !tripsFile.value || !stopTimesFile.value) {
    alert('Please upload all 3 required files')
    return
  }

  processing.value = true

  try {
    const stops = await parseCSV(stopsFile.value)
    const trips = await parseCSV(tripsFile.value)
    const stopTimes = await parseCSV(stopTimesFile.value)

    // Build route_id -> trip_ids mapping
    const routeTrips = {}
    trips.forEach(trip => {
      const routeId = (trip.route_id || '').trim()
      if (!routeId) return
      if (!routeTrips[routeId]) routeTrips[routeId] = []
      routeTrips[routeId].push((trip.trip_id || '').trim())
    })

    // Build route_id -> stop_ids mapping with direction detection
    const routeStops = {}
    stopTimes.forEach(st => {
      const tripId = (st.trip_id || '').trim()
      const stopId = (st.stop_id || '').trim()
      
      if (!tripId || !stopId) return

      // Find which route this trip belongs to
      for (const routeId in routeTrips) {
        if (routeTrips[routeId].includes(tripId)) {
          if (!routeStops[routeId]) routeStops[routeId] = new Set()
          routeStops[routeId].add(stopId)
          break
        }
      }
    })

    // Assign zone_id to stops
    const stopZoneMap = {}
    for (const routeId in routeStops) {
      routeStops[routeId].forEach(stopId => {
        // Detect direction: if stop_id ends with -R or _R, it's reverse
        const isReverse = stopId.match(/[-_]R$/i)
        const direction = isReverse ? 'R' : 'F'
        
        if (singleStage.value) {
          stopZoneMap[stopId] = `${routeId}_${direction}`
        } else {
          stopZoneMap[stopId] = `STAGE_${routeId}_${direction}_1`
        }
      })
    }

    // Update stops with zone_id
    const updatedStops = stops.map(stop => {
      const stopId = (stop.stop_id || '').trim()
      return {
        ...stop,
        zone_id: stopZoneMap[stopId] || ''
      }
    })

    // Generate stops.txt output
    if (updatedStops.length > 0) {
      const stopHeaders = Object.keys(updatedStops[0])
      const stopRows = updatedStops.map(row => 
        stopHeaders.map(header => {
          const value = row[header] || ''
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
      outputStops.value = [stopHeaders.join(','), ...stopRows].join('\n')
    }

    // Generate fare_rules.txt
    const fareRules = []
    
    for (const routeId in routeStops) {
      const zoneF = `${routeId}_F`
      fareRules.push({
        fare_id: fareId.value,
        route_id: routeId,
        origin_id: zoneF,
        destination_id: zoneF
      })
      
      const zoneR = `${routeId}_R`
      fareRules.push({
        fare_id: fareId.value,
        route_id: routeId,
        origin_id: zoneR,
        destination_id: zoneR
      })
    }

    if (fareRules.length > 0) {
      const fareHeaders = ['fare_id', 'route_id', 'origin_id', 'destination_id']
      const fareRows = fareRules.map(rule => 
        fareHeaders.map(header => rule[header] || '').join(',')
      )
      outputFareRules.value = [fareHeaders.join(','), ...fareRows].join('\n')
    }

    // Generate fare_attributes.txt
    const fareAttributes = [{
      fare_id: fareId.value,
      price: fareAmount.value,
      currency_type: currencyType.value,
      payment_method: '0',
      transfers: '0'
    }]

    const attrHeaders = ['fare_id', 'price', 'currency_type', 'payment_method', 'transfers']
    const attrRows = fareAttributes.map(attr => 
      attrHeaders.map(header => attr[header] || '').join(',')
    )
    outputFareAttributes.value = [attrHeaders.join(','), ...attrRows].join('\n')

    // Update stats
    routeCount.value = Object.keys(routeStops).length
    stopCount.value = Object.keys(stopZoneMap).length
    fareRuleCount.value = fareRules.length

  } catch (error) {
    console.error('Error processing files:', error)
    alert('Error processing files. Please check console for details.')
  } finally {
    processing.value = false
  }
}

// Download function
function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// Reset function
function reset() {
  stopsFile.value = null
  tripsFile.value = null
  stopTimesFile.value = null
  outputStops.value = ''
  outputFareRules.value = ''
  outputFareAttributes.value = ''
  routeCount.value = 0
  stopCount.value = 0
  fareRuleCount.value = 0
  document.querySelectorAll('input[type="file"]').forEach(input => input.value = '')
}
</script>

<style scoped>
/* Tailwind classes handle all styling */
</style>
