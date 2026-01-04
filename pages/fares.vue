<script setup>
import { ref, computed } from 'vue'

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

function handleStops(e) { stopsFile.value = e.target.files[0] }
function handleTrips(e) { tripsFile.value = e.target.files[0] }
function handleStopTimes(e) { stopTimesFile.value = e.target.files[0] }

// Parse CSV manually without external libraries
function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length === 0) return []
  const headers = lines[0].split(',').map(h => h.trim())
  const data = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const values = line.split(',').map(v => v.trim())
    const obj = {}
    headers.forEach((header, idx) => { obj[header] = values[idx] || '' })
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

// Helper: extract base route and variant (N, SE, AC)
function getRouteVariant(routeId) {
  const match = routeId.match(/(\d+)_?(N|SE|AC)?/)
  return {
    baseRoute: match ? match[1] : routeId,
    variant: match && match[2] ? match[2] : ''
  }
}

async function generateZonesAndFares() {
  if (!stopsFile.value || !tripsFile.value || !stopTimesFile.value) {
    alert('Please upload all 3 required files')
    return
  }

  processing.value = true

  try {
    const stopsText = await readFile(stopsFile.value)
    const tripsText = await readFile(tripsFile.value)
    const stopTimesText = await readFile(stopTimesFile.value)

    const stops = parseCSV(stopsText)
    const trips = parseCSV(tripsText)
    const stopTimes = parseCSV(stopTimesText)

    // Build trip -> route mapping
    const tripToRoute = {}
    trips.forEach(trip => {
      const tripId = (trip.trip_id || '').trim()
      const routeId = (trip.route_id || '').trim()
      if (tripId && routeId) tripToRoute[tripId] = routeId
    })

    // Build trip stop sequences
    const tripStopSequences = {}
    stopTimes.forEach(st => {
      const tripId = (st.trip_id || '').trim()
      const stopId = (st.stop_id || '').trim()
      const sequence = parseInt(st.stop_sequence) || 0
      if (!tripId || !stopId) return
      if (!tripStopSequences[tripId]) tripStopSequences[tripId] = []
      tripStopSequences[tripId].push({ stopId, sequence })
    })
    Object.keys(tripStopSequences).forEach(tripId => {
      tripStopSequences[tripId].sort((a, b) => a.sequence - b.sequence)
    })

    // Group trips by route and detect unique patterns
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

    // Assign zone_id per route variant and stage
    const stopToZone = {}
    const allZones = new Set()

    Object.keys(routePatterns).forEach(routeId => {
      const { baseRoute, variant } = getRouteVariant(routeId)
      const patterns = routePatterns[routeId]

      Object.values(patterns).forEach(pattern => {
        const dirLabel = pattern.direction === 0 ? 'F' : pattern.direction === 1 ? 'R' : `F${pattern.direction}`

        if (singleStage.value) {
          const zoneId = `${baseRoute}_${variant}_${dirLabel}`
          allZones.add(zoneId)
          pattern.stops.forEach(stopId => {
            if (!stopToZone[stopId]) stopToZone[stopId] = zoneId
          })
        } else {
          const numStops = pattern.stops.length
          const stopsPerStage = Math.ceil(numStops / 3) // adjust number of stages if needed
          pattern.stops.forEach((stopId, idx) => {
            const stageNum = Math.floor(idx / stopsPerStage) + 1
            const zoneId = `${baseRoute}_${variant}_${dirLabel}_S${stageNum}`
            allZones.add(zoneId)
            if (!stopToZone[stopId]) stopToZone[stopId] = zoneId
          })
        }
      })
    })

    // Update stops.txt
    const updatedStops = stops.map(stop => {
      const stopId = (stop.stop_id || '').trim()
      return { ...stop, zone_id: stopToZone[stopId] || '' }
    })
    if (updatedStops.length > 0) {
      const headers = Object.keys(updatedStops[0])
      const rows = updatedStops.map(row => {
        return headers.map(h => {
          const value = row[h] || ''
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      })
      outputStops.value = [headers.join(','), ...rows].join('\n')
    }

    // Generate fare_rules.txt per zone
    const fareRules = []
    allZones.forEach(zoneId => {
      const parts = zoneId.split('_')
      const routeId = parts[0] + (parts[1] && ['N','SE','AC'].includes(parts[1]) ? `_${parts[1]}` : '')

      fareRules.push({
        fare_id: fareId.value,
        route_id: routeId,
        origin_id: zoneId,
        destination_id: zoneId
      })
    })
    if (fareRules.length > 0) {
      const headers = ['fare_id','route_id','origin_id','destination_id']
      const rows = fareRules.map(r => headers.map(h => r[h] || '').join(','))
      outputFareRules.value = [headers.join(','), ...rows].join('\n')
    }

    // Generate fare_attributes.txt
    const fareAttributes = [{
      fare_id: fareId.value,
      price: fareAmount.value,
      currency_type: currencyType.value,
      payment_method: '0',
      transfers: '0'
    }]
    const attrHeaders = ['fare_id','price','currency_type','payment_method','transfers']
    outputFareAttributes.value = [attrHeaders.join(','), ...fareAttributes.map(attr => attrHeaders.map(h => attr[h] || '').join(','))].join('\n')

    // Update stats
    const uniqueRoutes = new Set(Object.values(tripToRoute))
    routeCount.value = uniqueRoutes.size
    stopCount.value = Object.keys(stopToZone).length
    fareRuleCount.value = fareRules.length

    alert(`✅ Success!\n\nGenerated:\n• ${uniqueRoutes.size} routes\n• ${Object.keys(stopToZone).length} stops with zones\n• ${fareRules.length} fare rules\n\nSingle-stage: ${singleStage.value ? 'Yes' : 'No'}`)
  } catch (err) {
    console.error(err)
    alert('❌ Error: ' + err.message)
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
  document.querySelectorAll('input[type="file"]').forEach(i => i.value = '')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="container mx-auto max-w-4xl">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">💰 GTFS Fare Zone Generator</h1>
        <p class="text-gray-600">Generate zone_id, fare_rules.txt, fare_attributes.txt</p>
      </div>

      <!-- Upload GTFS files -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">1. Upload GTFS Files</h2>
        <div class="mb-4" v-for="file in ['stops','trips','stop_times']" :key="file">
          <label :for="file+'Input'" class="block text-sm font-semibold text-gray-700 mb-2">{{ file }}.txt <span class="text-red-500">*</span></label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input type="file" :id="file+'Input'" accept=".txt,.csv" class="hidden" :onChange="file==='stops'?handleStops:file==='trips'?handleTrips:handleStopTimes"/>
            <label :for="file+'Input'" class="cursor-pointer flex flex-col items-center">
              <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700">Click to upload {{ file }}.txt</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Fare settings -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">2. Fare Settings</h2>
        <label class="flex items-center cursor-pointer mb-4">
          <input type="checkbox" v-model="singleStage" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2" />
          <span class="ml-3 text-gray-700 font-medium">Single-stage per route</span>
        </label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input v-model="fareId" placeholder="FARE_NORMAL" class="px-4 py-2 border rounded" />
          <input v-model="fareAmount" type="number" step="0.01" placeholder="50.00" class="px-4 py-2 border rounded" />
          <input v-model="currencyType" placeholder="LKR" maxlength="3" class="px-4 py-2 border rounded uppercase" />
        </div>
      </div>

      <!-- Generate -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">3. Generate Fare Files</h2>
        <button @click="generateZonesAndFares" :disabled="processing || !stopsFile || !tripsFile || !stopTimesFile" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          {{ processing ? 'Processing...' : 'Generate Fare Files' }}
        </button>
      </div>

      <!-- Review & download -->
      <div v-if="outputStops" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">4. Review & Download</h2>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="bg-blue-50 p-4 rounded text-center"><div class="text-3xl font-bold">{{ routeCount }}</div><div class="text-sm">Routes</div></div>
          <div class="bg-green-50 p-4 rounded text-center"><div class="text-3xl font-bold">{{ stopCount }}</div><div class="text-sm">Stops with zones</div></div>
          <div class="bg-purple-50 p-4 rounded text-center"><div class="text-3xl font-bold">{{ fareRuleCount }}</div><div class="text-sm">Fare rules</div></div>
        </div>
        <button @click="downloadFile(outputStops,'stops.txt')" class="w-full bg-green-600 text-white py-2 mb-2 rounded">Download stops.txt</button>
        <button @click="downloadFile(outputFareRules,'fare_rules.txt')" class="w-full bg-green-600 text-white py-2 mb-2 rounded">Download fare_rules.txt</button>
        <button @click="downloadFile(outputFareAttributes,'fare_attributes.txt')" class="w-full bg-green-600 text-white py-2 mb-2 rounded">Download fare_attributes.txt</button>

        <h3 class="mt-4 font-semibold text-gray-800">Preview: stops.txt</h3>
        <pre class="bg-gray-50 p-3 text-xs font-mono max-h-64 overflow-auto">{{ previewStops }}</pre>
      </div>
    </div>
  </div>
</template>
