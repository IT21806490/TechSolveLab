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

// Parse CSV manually
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
    headers.forEach((header, idx) => obj[header] = values[idx] || '')
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

async function generateZonesAndFares() {
  if (!stopsFile.value || !tripsFile.value || !stopTimesFile.value) {
    alert('Please upload all 3 required files')
    return
  }

  processing.value = true

  try {
    const stops = parseCSV(await readFile(stopsFile.value))
    const trips = parseCSV(await readFile(tripsFile.value))
    const stopTimes = parseCSV(await readFile(stopTimesFile.value))

    const tripToRoute = {}
    trips.forEach(trip => {
      const tripId = (trip.trip_id || '').trim()
      const routeId = (trip.route_id || '').trim()
      if (tripId && routeId) tripToRoute[tripId] = routeId
    })

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

    const stopToZone = {}
    const allZones = new Set()
    Object.keys(routePatterns).forEach(routeId => {
      const patterns = routePatterns[routeId]
      Object.values(patterns).forEach(pattern => {
        const dirLabel = pattern.direction === 0 ? 'F' :
                        pattern.direction === 1 ? 'R' : `F${pattern.direction}`

        if (singleStage.value) {
          const zoneId = `${routeId}_${dirLabel}`
          allZones.add(zoneId)
          pattern.stops.forEach(stopId => {
            if (!stopToZone[stopId]) stopToZone[stopId] = zoneId
          })
        } else {
          const numStops = pattern.stops.length
          const stopsPerStage = Math.ceil(numStops / 3)
          pattern.stops.forEach((stopId, idx) => {
            const stageNum = Math.floor(idx / stopsPerStage) + 1
            const zoneId = `${routeId}_${dirLabel}_S${stageNum}`
            allZones.add(zoneId)
            if (!stopToZone[stopId]) stopToZone[stopId] = zoneId
          })
        }
      })
    })

    const updatedStops = stops.map(stop => {
      const stopId = (stop.stop_id || '').trim()
      return { ...stop, zone_id: stopToZone[stopId] || '' }
    })

    if (updatedStops.length > 0) {
      const headers = Object.keys(updatedStops[0])
      const rows = updatedStops.map(row => headers.map(header => {
        const value = row[header] || ''
        return (value.includes(',') || value.includes('"') || value.includes('\n')) ? `"${value.replace(/"/g,'""')}"` : value
      }).join(','))
      outputStops.value = [headers.join(','), ...rows].join('\n')
    }

    const fareRules = []
    allZones.forEach(zoneId => {
      const parts = zoneId.split('_')
      const routeId = parts[0]
      fareRules.push({ fare_id: fareId.value, route_id: routeId, origin_id: zoneId, destination_id: zoneId })
    })
    if (fareRules.length > 0) {
      const headers = ['fare_id','route_id','origin_id','destination_id']
      const rows = fareRules.map(rule => headers.map(h => rule[h] || '').join(','))
      outputFareRules.value = [headers.join(','), ...rows].join('\n')
    }

    const fareAttributes = [{
      fare_id: fareId.value,
      price: fareAmount.value,
      currency_type: currencyType.value,
      payment_method: '0',
      transfers: '0'
    }]
    const attrHeaders = ['fare_id','price','currency_type','payment_method','transfers']
    outputFareAttributes.value = [attrHeaders.join(','), ...fareAttributes.map(a => attrHeaders.map(h => a[h] || '').join(','))].join('\n')

    routeCount.value = new Set(Object.values(tripToRoute)).size
    stopCount.value = Object.keys(stopToZone).length
    fareRuleCount.value = fareRules.length

    alert(`✅ Success!\nGenerated:\n• ${routeCount.value} routes\n• ${stopCount.value} stops with zones\n• ${fareRuleCount.value} fare rules`)
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
    <div class="container mx-auto max-w-4xl space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">💰 GTFS Fare Zone Generator</h1>
        <p class="text-gray-600">Automatically generate zone_id, fare_rules.txt, and fare_attributes.txt</p>
      </div>

      <!-- File Upload Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 class="text-xl font-semibold text-gray-800">1. Upload GTFS Files</h2>
        <div v-for="file in [
          {label:'stops.txt', handler: handleStops, model: stopsFile, id:'stopsInput'},
          {label:'trips.txt', handler: handleTrips, model: tripsFile, id:'tripsInput'},
          {label:'stop_times.txt', handler: handleStopTimes, model: stopTimesFile, id:'stopTimesInput'}
        ]" :key="file.id" class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">{{ file.label }} <span class="text-red-500">*</span></label>
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

      <!-- Fare Settings Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 class="text-xl font-semibold text-gray-800">2. Configure Fare Settings</h2>
        <label class="flex items-center cursor-pointer">
          <input type="checkbox" v-model="singleStage" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2" />
          <span class="ml-3 text-gray-700 font-medium">Assign entire route as single fare stage (RECOMMENDED)</span>
        </label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input v-model="fareId" type="text" placeholder="FARE_NORMAL" class="w-full px-4 py-2 border rounded-lg" />
          <input v-model="fareAmount" type="number" step="0.01" placeholder="50.00" class="w-full px-4 py-2 border rounded-lg" />
          <input v-model="currencyType" type="text" maxlength="3" placeholder="LKR" class="w-full px-4 py-2 border rounded-lg uppercase" />
        </div>
      </div>

      <!-- Generate Button -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">3. Generate Fare Files</h2>
        <button @click="generateZonesAndFares" :disabled="processing || !stopsFile || !tripsFile || !stopTimesFile"
                class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {{ processing ? 'Processing...' : 'Generate Fare Files' }}
        </button>
      </div>

      <!-- Output Section -->
      <div v-if="outputStops" class="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 class="text-xl font-semibold text-gray-800">4. Review & Download Results</h2>

        <div class="grid grid-cols-3 gap-4">
          <div class="bg-blue-50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-blue-600">{{ routeCount }}</div>
            <div class="text-sm text-gray-600">Routes processed</div>
          </div>
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-green-600">{{ stopCount }}</div>
            <div class="text-sm text-gray-600">Stops with zones</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-purple-600">{{ fareRuleCount }}</div>
            <div class="text-sm text-gray-600">Fare rules created</div>
          </div>
        </div>

        <div class="space-y-2">
          <button @click="downloadFile(outputStops,'stops.txt')" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Download stops.txt</button>
          <button @click="downloadFile(outputFareRules,'fare_rules.txt')" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Download fare_rules.txt</button>
          <button @click="downloadFile(outputFareAttributes,'fare_attributes.txt')" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Download fare_attributes.txt</button>
        </div>

        <div>
          <h3 class="text-gray-800 font-semibold mb-2">Preview: stops.txt (first 10 rows)</h3>
          <pre class="bg-gray-50 p-3 text-xs font-mono overflow-auto max-h-64">{{ previewStops }}</pre>
        </div>

        <button @click="reset" class="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">Reset</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional Tailwind utilities can be enhanced here */
</style>
