<script setup>
import { ref, computed } from 'vue'

// Files
const stopsFile = ref(null)
const tripsFile = ref(null)
const stopTimesFile = ref(null)

// Outputs
const outputStops = ref('')
const outputFareRules = ref('')
const outputFareAttributes = ref('')

// State
const processing = ref(false)
const singleStage = ref(true) // whole route as single fare stage

// Fare settings
const currencyType = ref('LKR')

// Route stats
const routeCount = ref(0)
const stopCount = ref(0)
const fareRuleCount = ref(0)

// Preview
const previewStops = computed(() => {
  if (!outputStops.value) return ''
  return outputStops.value.split('\n').slice(0, 11).join('\n')
})

// File handlers
function handleStops(e) { stopsFile.value = e.target.files[0] }
function handleTrips(e) { tripsFile.value = e.target.files[0] }
function handleStopTimes(e) { stopTimesFile.value = e.target.files[0] }

// Read file as text
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// CSV parser
function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (!lines.length) return []

  const headers = lines[0].split(',').map(h => h.trim())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const values = line.split(',').map(v => v.trim())
    const obj = {}
    headers.forEach((h, idx) => obj[h] = values[idx] || '')
    data.push(obj)
  }
  return data
}

// Auto-generate fares for different types (N, SE, AC)
const defaultFareValues = {
  N: 27,
  SE: 35,
  AC: 55
}

// Main processing
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

    // Build trip_id -> route_id mapping
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
      const seq = parseInt(st.stop_sequence) || 0
      if (!tripId || !stopId) return
      if (!tripStopSequences[tripId]) tripStopSequences[tripId] = []
      tripStopSequences[tripId].push({ stopId, seq })
    })

    // Sort stops by sequence
    Object.keys(tripStopSequences).forEach(tripId => {
      tripStopSequences[tripId].sort((a,b)=>a.seq-b.seq)
    })

    // Group trips by route & detect patterns (directions)
    const routePatterns = {}
    Object.keys(tripStopSequences).forEach(tripId => {
      const routeId = tripToRoute[tripId]
      if (!routeId) return
      const stopSeq = tripStopSequences[tripId].map(s=>s.stopId).join('|')
      if (!routePatterns[routeId]) routePatterns[routeId] = {}
      if (!routePatterns[routeId][stopSeq]) {
        const dir = Object.keys(routePatterns[routeId]).length
        routePatterns[routeId][stopSeq] = {
          stops: tripStopSequences[tripId].map(s=>s.stopId),
          direction: dir
        }
      }
    })

    // Assign zone_id
    const stopToZone = {}
    const allZones = new Set()
    Object.keys(routePatterns).forEach(routeId => {
      const patterns = routePatterns[routeId]
      Object.values(patterns).forEach(pattern => {
        const dirLabel = pattern.direction===0?'F':pattern.direction===1?'R':`F${pattern.direction}`
        if (singleStage.value) {
          const zoneId = `${routeId}_${dirLabel}`
          allZones.add(zoneId)
          pattern.stops.forEach(stopId => { if (!stopToZone[stopId]) stopToZone[stopId]=zoneId })
        } else {
          const numStops = pattern.stops.length
          const stopsPerStage = Math.ceil(numStops/3)
          pattern.stops.forEach((stopId,idx)=>{
            const stageNum = Math.floor(idx/stopsPerStage)+1
            const zoneId = `${routeId}_${dirLabel}_S${stageNum}`
            allZones.add(zoneId)
            if (!stopToZone[stopId]) stopToZone[stopId]=zoneId
          })
        }
      })
    })

    // Update stops.txt
    const updatedStops = stops.map(stop=>{
      const stopId = (stop.stop_id||'').trim()
      return {...stop, zone_id: stopToZone[stopId]||''}
    })
    if (updatedStops.length) {
      const headers = Object.keys(updatedStops[0])
      const rows = updatedStops.map(row => headers.map(h=>{
        const val = row[h]||''
        if (val.includes(',')||val.includes('"')||val.includes('\n')) return `"${val.replace(/"/g,'""')}"`
        return val
      }).join(','))
      outputStops.value = [headers.join(','),...rows].join('\n')
    }

    // Generate fare_rules.txt
    const fareRules = []
    allZones.forEach(zoneId=>{
      const parts = zoneId.split('_')
      const routeBase = parts[0]
      // Detect type suffix in routeId: N, SE, AC
      const routeTypeMatch = routeBase.match(/(N|SE|AC)$/i)
      const type = routeTypeMatch ? routeTypeMatch[1].toUpperCase() : 'N'
      const fareAmount = defaultFareValues[type] || 27
      fareRules.push({
        fare_id: `FARE_${type}`,
        route_id: routeBase,
        origin_id: zoneId,
        destination_id: zoneId,
        price: fareAmount
      })
    })

    if (fareRules.length) {
      const headers = ['fare_id','route_id','origin_id','destination_id','price']
      const rows = fareRules.map(f=>headers.map(h=>f[h]||'').join(','))
      outputFareRules.value = [headers.join(','),...rows].join('\n')
    }

    // Generate fare_attributes.txt (unique fares)
    const uniqueFares = {}
    fareRules.forEach(f=>{ uniqueFares[f.fare_id]=f.price })
    const fareAttributes = Object.keys(uniqueFares).map(fid=>({
      fare_id: fid,
      price: uniqueFares[fid],
      currency_type: currencyType.value,
      payment_method: '0',
      transfers: '0'
    }))
    const attrHeaders = ['fare_id','price','currency_type','payment_method','transfers']
    outputFareAttributes.value = [attrHeaders.join(','),...fareAttributes.map(a=>attrHeaders.map(h=>a[h]||'').join(','))].join('\n')

    // Stats
    routeCount.value = Object.keys(routePatterns).length
    stopCount.value = Object.keys(stopToZone).length
    fareRuleCount.value = fareRules.length

    alert(`✅ Fare generation complete!\nRoutes: ${routeCount.value}\nStops with zones: ${stopCount.value}\nFare rules: ${fareRuleCount.value}`)

  } catch (e) {
    console.error(e)
    alert('❌ Error: ' + e.message)
  } finally { processing.value = false }
}

// Download helper
function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Reset form
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
  document.querySelectorAll('input[type="file"]').forEach(i=>i.value='')
}

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="container mx-auto max-w-4xl">
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">💰 GTFS Fare Zone Generator</h1>
        <p class="text-gray-600">Automatically generate zone_id, fare_rules.txt, and fare_attributes.txt</p>
      </div>

      <!-- File Upload Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">1. Upload GTFS Files</h2>
        <div class="grid gap-4">
          <div v-for="file in ['stops','trips','stopTimes']" :key="file">
            <label class="block text-sm font-semibold text-gray-700 mb-2">{{ file }}.txt <span class="text-red-500">*</span></label>
            <input type="file" :id="file+'Input'" class="border p-2 rounded w-full" :accept="'.txt,.csv'" 
              @change="file==='stops'?handleStops(file):file==='trips'?handleTrips(file):handleStopTimes(file)">
          </div>
        </div>
      </div>

      <!-- Fare Generation -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">2. Generate Fare Files</h2>
        <button @click="generateZonesAndFares" :disabled="processing || !stopsFile || !tripsFile || !stopTimesFile" class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          {{ processing?'Processing...':'Generate Fare Files' }}
        </button>
      </div>

      <!-- Download Section -->
      <div v-if="outputStops" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">3. Download Generated Files</h2>
        <button @click="downloadFile(outputStops,'stops.txt')" class="px-4 py-2 bg-green-500 text-white rounded mb-2 block">Download stops.txt</button>
        <button @click="downloadFile(outputFareRules,'fare_rules.txt')" class="px-4 py-2 bg-green-500 text-white rounded mb-2 block">Download fare_rules.txt</button>
        <button @click="downloadFile(outputFareAttributes,'fare_attributes.txt')" class="px-4 py-2 bg-green-500 text-white rounded mb-2 block">Download fare_attributes.txt</button>

        <h3 class="mt-4 text-gray-700 font-semibold">Preview stops.txt (first 10 rows)</h3>
        <pre class="bg-gray-100 p-2 overflow-auto text-xs font-mono">{{ previewStops }}</pre>
      </div>
    </div>
  </div>
</template>
