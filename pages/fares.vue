<script setup>
import { ref, computed } from 'vue'

const stopsFile = ref(null)
const tripsFile = ref(null)
const stopTimesFile = ref(null)
const routesFile = ref(null)
const fareStagesFile = ref(null)
const outputStops = ref('')
const outputFareRules = ref('')
const outputFareAttributes = ref('')
const processing = ref(false)

const routeCount = ref(0)
const stopCount = ref(0)
const fareRuleCount = ref(0)
const fareAttributeCount = ref(0)

// Default fare stages (350 stages)
const defaultFareStages = ref([
  { fare_stage: 0, normal: 0, semi: 0, ac: 0, super: 0, highway: 0 },
  { fare_stage: 1, normal: 27, semi: 39, ac: 50, super: 70, highway: 80 },
  { fare_stage: 2, normal: 35, semi: 47, ac: 60, super: 85, highway: 100 },
  { fare_stage: 3, normal: 45, semi: 62, ac: 80, super: 110, highway: 130 },
  { fare_stage: 4, normal: 55, semi: 75, ac: 100, super: 135, highway: 160 },
  { fare_stage: 5, normal: 65, semi: 88, ac: 115, super: 160, highway: 190 },
  { fare_stage: 6, normal: 75, semi: 100, ac: 130, super: 180, highway: 215 },
  { fare_stage: 7, normal: 85, semi: 112, ac: 145, super: 200, highway: 240 },
  { fare_stage: 8, normal: 95, semi: 125, ac: 160, super: 220, highway: 265 },
  { fare_stage: 9, normal: 105, semi: 137, ac: 175, super: 240, highway: 290 },
  { fare_stage: 10, normal: 115, semi: 150, ac: 190, super: 260, highway: 315 }
  // Add more stages as needed up to 350
])

const previewStops = computed(() => {
  if (!outputStops.value) return ''
  return outputStops.value.split('\n').slice(0, 11).join('\n')
})

const previewFareRules = computed(() => {
  if (!outputFareRules.value) return ''
  return outputFareRules.value.split('\n').slice(0, 11).join('\n')
})

const previewFareAttributes = computed(() => {
  if (!outputFareAttributes.value) return ''
  return outputFareAttributes.value.split('\n').slice(0, 11).join('\n')
})

function handleStops(e) { stopsFile.value = e.target.files[0] }
function handleTrips(e) { tripsFile.value = e.target.files[0] }
function handleStopTimes(e) { stopTimesFile.value = e.target.files[0] }
function handleRoutes(e) { routesFile.value = e.target.files[0] }
function handleFareStages(e) { fareStagesFile.value = e.target.files[0] }

// Parse CSV manually
function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length === 0) return []
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // Handle CSV with quoted values
    const values = []
    let current = ''
    let inQuotes = false
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    const obj = {}
    headers.forEach((header, idx) => {
      obj[header] = (values[idx] || '').replace(/^"|"$/g, '')
    })
    data.push(obj)
  }
  
  return data
}

// Read file as text
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// Detect route type from route_id or route_short_name
function getRouteType(routeId, routeShortName) {
  const combined = `${routeId}_${routeShortName}`.toUpperCase()
  
  if (combined.includes('SUPER')) return 'super'
  if (combined.includes('HIGHWAY') || combined.includes('HWY')) return 'highway'
  if (combined.includes('AC')) return 'ac'
  if (combined.includes('SE') || combined.includes('SEMI')) return 'semi'
  
  // Default to normal
  return 'normal'
}

// Calculate distance-based fare stage
function calculateFareStage(stopIndex, totalStops) {
  // Distribute stops across fare stages
  // For example: if route has 100 stops, stage 0-10 might be stage 1, 11-20 stage 2, etc.
  const stageSize = Math.max(1, Math.ceil(totalStops / 10))
  const stage = Math.floor(stopIndex / stageSize)
  return Math.min(stage, 350) // Cap at 350 stages
}

async function generateZonesAndFares() {
  if (!stopsFile.value || !tripsFile.value || !stopTimesFile.value) {
    alert('Please upload stops.txt, trips.txt, and stop_times.txt')
    return
  }

  processing.value = true

  try {
    // Load fare stages if uploaded
    let fareStages = [...defaultFareStages.value]
    if (fareStagesFile.value) {
      const fareStagesText = await readFile(fareStagesFile.value)
      const uploadedStages = parseCSV(fareStagesText)
      if (uploadedStages.length > 0) {
        fareStages = uploadedStages.map(stage => ({
          fare_stage: parseInt(stage.fare_stage) || 0,
          normal: parseFloat(stage.normal) || 0,
          semi: parseFloat(stage.semi) || 0,
          ac: parseFloat(stage.ac) || 0,
          super: parseFloat(stage.super) || 0,
          highway: parseFloat(stage.highway) || 0
        }))
      }
    }

    const stops = parseCSV(await readFile(stopsFile.value))
    const trips = parseCSV(await readFile(tripsFile.value))
    const stopTimes = parseCSV(await readFile(stopTimesFile.value))
    
    let routes = []
    if (routesFile.value) {
      routes = parseCSV(await readFile(routesFile.value))
    }

    // Create route type mapping
    const routeTypeMap = {}
    if (routes.length > 0) {
      routes.forEach(route => {
        const routeId = (route.route_id || '').trim()
        const routeShortName = (route.route_short_name || '').trim()
        routeTypeMap[routeId] = getRouteType(routeId, routeShortName)
      })
    }

    // Map trip to route
    const tripToRoute = {}
    trips.forEach(trip => {
      const tripId = (trip.trip_id || '').trim()
      const routeId = (trip.route_id || '').trim()
      if (tripId && routeId) {
        tripToRoute[tripId] = routeId
        // If no routes.txt provided, try to detect from route_id
        if (!routeTypeMap[routeId]) {
          routeTypeMap[routeId] = getRouteType(routeId, routeId)
        }
      }
    })

    // Group stop_times by trip
    const tripStopSequences = {}
    stopTimes.forEach(st => {
      const tripId = (st.trip_id || '').trim()
      const stopId = (st.stop_id || '').trim()
      const sequence = parseInt(st.stop_sequence) || 0
      if (!tripId || !stopId) return
      if (!tripStopSequences[tripId]) tripStopSequences[tripId] = []
      tripStopSequences[tripId].push({ stopId, sequence })
    })
    
    // Sort by sequence
    Object.keys(tripStopSequences).forEach(tripId => {
      tripStopSequences[tripId].sort((a, b) => a.sequence - b.sequence)
    })

    // Create route patterns with directions
    const routePatterns = {}
    Object.keys(tripStopSequences).forEach(tripId => {
      const routeId = tripToRoute[tripId]
      if (!routeId) return
      const stopSequence = tripStopSequences[tripId].map(s => s.stopId).join('|')
      if (!routePatterns[routeId]) routePatterns[routeId] = {}
      if (!routePatterns[routeId][stopSequence]) {
        const directionNumber = Object.keys(routePatterns[routeId]).length
        routePatterns[routeId][stopSequence] = {
          stops: tripStopSequences[tripId].map(s => s.stopId),
          direction: directionNumber
        }
      }
    })

    // Assign zones with fare stages
    const stopToZone = {}
    const stopToFareStage = {}
    const allZones = new Set()
    
    Object.keys(routePatterns).forEach(routeId => {
      const patterns = routePatterns[routeId]
      Object.values(patterns).forEach(pattern => {
        const dirLabel = pattern.direction === 0 ? 'F' :
                        pattern.direction === 1 ? 'R' : `D${pattern.direction}`
        
        const totalStops = pattern.stops.length
        
        pattern.stops.forEach((stopId, idx) => {
          const fareStage = calculateFareStage(idx, totalStops)
          const zoneId = `${routeId}_${dirLabel}_S${fareStage}`
          
          allZones.add(zoneId)
          
          // Use first assignment (primary route)
          if (!stopToZone[stopId]) {
            stopToZone[stopId] = zoneId
            stopToFareStage[stopId] = fareStage
          }
        })
      })
    })

    // Update stops with zone_id
    const updatedStops = stops.map(stop => {
      const stopId = (stop.stop_id || '').trim()
      return { ...stop, zone_id: stopToZone[stopId] || '' }
    })

    // Generate stops.txt
    if (updatedStops.length > 0) {
      const headers = Object.keys(updatedStops[0])
      const rows = updatedStops.map(row => headers.map(header => {
        const value = row[header] || ''
        return (value.includes(',') || value.includes('"') || value.includes('\n')) 
          ? `"${value.replace(/"/g,'""')}"` 
          : value
      }).join(','))
      outputStops.value = [headers.join(','), ...rows].join('\n')
    }

    // Generate fare_rules.txt and fare_attributes.txt
    const fareRulesMap = new Map()
    const fareAttributesMap = new Map()
    
    // Create fare rules based on zone pairs and route types
    const zoneArray = Array.from(allZones)
    
    zoneArray.forEach(originZone => {
      const originParts = originZone.split('_')
      const originRoute = originParts[0]
      const originStage = parseInt(originParts[originParts.length - 1].replace('S', '')) || 0
      const routeType = routeTypeMap[originRoute] || 'normal'
      
      zoneArray.forEach(destZone => {
        const destParts = destZone.split('_')
        const destRoute = destParts[0]
        const destStage = parseInt(destParts[destParts.length - 1].replace('S', '')) || 0
        
        // Only create rules for same route
        if (originRoute !== destRoute) return
        
        // Calculate fare stage difference
        const stageDiff = Math.abs(destStage - originStage)
        
        // Find fare for this stage
        const fareStageData = fareStages.find(f => f.fare_stage === stageDiff)
        if (!fareStageData) return
        
        const fareAmount = fareStageData[routeType] || 0
        const fareId = `${routeType.toUpperCase()}_${stageDiff}`
        
        // Add fare rule
        const ruleKey = `${fareId}_${originRoute}_${originZone}_${destZone}`
        if (!fareRulesMap.has(ruleKey)) {
          fareRulesMap.set(ruleKey, {
            fare_id: fareId,
            route_id: originRoute,
            origin_id: originZone,
            destination_id: destZone
          })
        }
        
        // Add fare attribute
        if (!fareAttributesMap.has(fareId)) {
          fareAttributesMap.set(fareId, {
            fare_id: fareId,
            price: fareAmount.toFixed(2),
            currency_type: 'LKR',
            payment_method: '0',
            transfers: '0'
          })
        }
      })
    })

    // Convert to CSV
    const fareRules = Array.from(fareRulesMap.values())
    if (fareRules.length > 0) {
      const headers = ['fare_id', 'route_id', 'origin_id', 'destination_id']
      const rows = fareRules.map(rule => headers.map(h => rule[h] || '').join(','))
      outputFareRules.value = [headers.join(','), ...rows].join('\n')
    }

    const fareAttributes = Array.from(fareAttributesMap.values())
    if (fareAttributes.length > 0) {
      const headers = ['fare_id', 'price', 'currency_type', 'payment_method', 'transfers']
      const rows = fareAttributes.map(attr => headers.map(h => attr[h] || '').join(','))
      outputFareAttributes.value = [headers.join(','), ...rows].join('\n')
    }

    routeCount.value = new Set(Object.values(tripToRoute)).size
    stopCount.value = Object.keys(stopToZone).length
    fareRuleCount.value = fareRules.length
    fareAttributeCount.value = fareAttributes.length

    alert(`✅ Success!\nGenerated:\n• ${routeCount.value} routes\n• ${stopCount.value} stops with zones\n• ${fareRuleCount.value} fare rules\n• ${fareAttributeCount.value} fare attributes`)
  } catch (error) {
    console.error(error)
    alert('❌ Error: ' + error.message)
  } finally {
    processing.value = false
  }
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadFareStagesTemplate() {
  const headers = ['fare_stage', 'normal', 'semi', 'ac', 'super', 'highway']
  const rows = defaultFareStages.value.map(stage => 
    `${stage.fare_stage},${stage.normal},${stage.semi},${stage.ac},${stage.super},${stage.highway}`
  )
  const content = [headers.join(','), ...rows].join('\n')
  downloadFile(content, 'fare_stages_template.csv')
}

function reset() {
  stopsFile.value = null
  tripsFile.value = null
  stopTimesFile.value = null
  routesFile.value = null
  fareStagesFile.value = null
  outputStops.value = ''
  outputFareRules.value = ''
  outputFareAttributes.value = ''
  routeCount.value = 0
  stopCount.value = 0
  fareRuleCount.value = 0
  fareAttributeCount.value = 0
  document.querySelectorAll('input[type="file"]').forEach(i => i.value = '')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4">
    <div class="container mx-auto max-w-5xl space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-xl p-6 border-t-4 border-blue-600">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">🎫 GTFS Distance-Based Fare Generator</h1>
        <p class="text-gray-600">Generate zone-based fares with distance calculation and route type classification (Normal, Semi-Luxury, AC, Super-Luxury, Highway)</p>
      </div>

      <!-- File Upload Section -->
      <div class="bg-white rounded-xl shadow-xl p-6 space-y-4">
        <h2 class="text-2xl font-semibold text-gray-800 flex items-center">
          <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
          Upload GTFS Files
        </h2>
        
        <!-- Required Files -->
        <div class="space-y-4">
          <div v-for="file in [
            {label:'stops.txt', handler: handleStops, model: stopsFile, id:'stopsInput', required: true},
            {label:'trips.txt', handler: handleTrips, model: tripsFile, id:'tripsInput', required: true},
            {label:'stop_times.txt', handler: handleStopTimes, model: stopTimesFile, id:'stopTimesInput', required: true}
          ]" :key="file.id" class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ file.label }} 
              <span v-if="file.required" class="text-red-500">*</span>
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input type="file" accept=".txt,.csv" :id="file.id" class="hidden" @change="file.handler" />
              <label :for="file.id" class="cursor-pointer flex flex-col items-center">
                <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span class="text-sm font-medium text-gray-700">Click to upload {{ file.label }}</span>
              </label>
            </div>
            <div v-if="file.model" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"></path>
              </svg>
              <span class="text-green-800 font-medium text-sm">{{ file.model.name }}</span>
            </div>
          </div>
        </div>

        <!-- Optional Files -->
        <div class="border-t pt-4 mt-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Optional Files (for better accuracy)</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                routes.txt <span class="text-gray-500 text-xs">(optional - helps detect route types)</span>
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                <input type="file" accept=".txt,.csv" id="routesInput" class="hidden" @change="handleRoutes" />
                <label for="routesInput" class="cursor-pointer flex flex-col items-center">
                  <svg class="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span class="text-sm font-medium text-gray-700">Click to upload routes.txt</span>
                </label>
              </div>
              <div v-if="routesFile" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"></path>
                </svg>
                <span class="text-green-800 font-medium text-sm">{{ routesFile.name }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                fare_stages.csv <span class="text-gray-500 text-xs">(optional - custom fare matrix)</span>
              </label>
              <div class="flex gap-2 mb-2">
                <button @click="downloadFareStagesTemplate" 
                        class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors">
                  📥 Download Template
                </button>
              </div>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                <input type="file" accept=".csv" id="fareStagesInput" class="hidden" @change="handleFareStages" />
                <label for="fareStagesInput" class="cursor-pointer flex flex-col items-center">
                  <svg class="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span class="text-sm font-medium text-gray-700">Click to upload fare_stages.csv</span>
                </label>
              </div>
              <div v-if="fareStagesFile" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"></path>
                </svg>
                <span class="text-green-800 font-medium text-sm">{{ fareStagesFile.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Box -->
      <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
        <div class="flex">
          <svg class="w-6 h-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <h3 class="font-semibold text-blue-900 mb-1">How it works:</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• Routes are automatically classified as Normal, Semi-Luxury, AC, Super-Luxury, or Highway based on route names</li>
              <li>• Each stop is assigned a fare stage based on its position in the route</li>
              <li>• Fare is calculated based on the distance (stage difference) between origin and destination</li>
              <li>• You can customize fare prices by uploading your own fare_stages.csv file</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="bg-white rounded-xl shadow-xl p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
          Generate Fare Files
        </h2>
        <button @click="generateZonesAndFares" 
                :disabled="processing || !stopsFile || !tripsFile || !stopTimesFile"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg transition-all transform hover:scale-105">
          {{ processing ? '⏳ Processing...' : '🚀 Generate Complete GTFS Fare System' }}
        </button>
      </div>

      <!-- Output Section -->
      <div v-if="outputStops" class="bg-white rounded-xl shadow-xl p-6 space-y-6">
        <h2 class="text-2xl font-semibold text-gray-800 flex items-center">
          <span class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">✓</span>
          Results & Download
        </h2>

        <!-- Statistics -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
            <div class="text-3xl font-bold text-blue-600">{{ routeCount }}</div>
            <div class="text-sm text-gray-600 mt-1">Routes</div>
          </div>
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
            <div class="text-3xl font-bold text-green-600">{{ stopCount }}</div>
            <div class="text-sm text-gray-600 mt-1">Stops with Zones</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center border border-purple-200">
            <div class="text-3xl font-bold text-purple-600">{{ fareRuleCount }}</div>
            <div class="text-sm text-gray-600 mt-1">Fare Rules</div>
          </div>
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center border border-orange-200">
            <div class="text-3xl font-bold text-orange-600">{{ fareAttributeCount }}</div>
            <div class="text-sm text-gray-600 mt-1">Fare Types</div>
          </div>
        </div>

        <!-- Download Buttons -->
        <div class="space-y-3">
          <h3 class="font-semibold text-gray-800 text-lg">Download Generated Files:</h3>
          <button @click="downloadFile(outputStops,'stops.txt')" 
                  class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            Download stops.txt (with zone_id)
          </button>
          <button @click="downloadFile(outputFareRules,'fare_rules.txt')" 
                  class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            Download fare_rules.txt
          </button>
          <button @click="downloadFile(outputFareAttributes,'fare_attributes.txt')" 
                  class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            Download fare_attributes.txt
          </button>
        </div>

        <!-- Previews -->
        <div class="space-y-4">
          <div>
            <h3 class="text-gray-800 font-semibold mb-2 flex items-center">
              <span class="text-blue-600 mr-2">📄</span>
              Preview: stops.txt (first 10 rows)
            </h3>
            <pre class="bg-gray-50 p-4 text-xs font-mono overflow-auto max-h-64 rounded-lg border border-gray-200">{{ previewStops }}</pre>
          </div>

          <div>
            <h3 class="text-gray-800 font-semibold mb-2 flex items-center">
              <span class="text-purple-600 mr-2">📋</span>
              Preview: fare_rules.txt (first 10 rows)
            </h3>
            <pre class="bg-gray-50 p-4 text-xs font-mono overflow-auto max-h-64 rounded-lg border border-gray-200">{{ previewFareRules }}</pre>
          </div>

          <div>
            <h3 class="text-gray-800 font-semibold mb-2 flex items-center">
              <span class="text-orange-600 mr-2">💰</span>
              Preview: fare_attributes.txt (first 10 rows)
            </h3>
            <pre class="bg-gray-50 p-4 text-xs font-mono overflow-auto max-h-64 rounded-lg border border-gray-200">{{ previewFareAttributes }}</pre>
          </div>
        </div>

        <!-- Reset Button -->
        <button @click="reset" 
                class="w-full mt-4 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-md">
          🔄 Reset & Start Over
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="file"] {
  cursor: pointer;
}
</style>
