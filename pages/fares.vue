<script setup>
import { ref } from 'vue'

const stopsFile = ref(null)
const tripsFile = ref(null)
const stopTimesFile = ref(null)

const outputStops = ref('')
const outputFareRules = ref('')
const outputFareAttributes = ref('')

const processing = ref(false)

// Default fares for route types
const defaultFares = {
  N: 27,
  SE: 35,
  AC: 55
}

function handleStops(e) { stopsFile.value = e.target.files[0] }
function handleTrips(e) { tripsFile.value = e.target.files[0] }
function handleStopTimes(e) { stopTimesFile.value = e.target.files[0] }

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function parseCSV(text) {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  const data = []
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(v => v.trim())
    const obj = {}
    headers.forEach((h, idx) => obj[h] = row[idx] || '')
    data.push(obj)
  }
  return data
}

async function generateFareFiles() {
  if (!stopsFile.value || !tripsFile.value || !stopTimesFile.value) {
    alert('Please upload all required files')
    return
  }
  processing.value = true
  try {
    const [stopsText, tripsText, stopTimesText] = await Promise.all([
      readFile(stopsFile.value),
      readFile(tripsFile.value),
      readFile(stopTimesFile.value)
    ])

    const stops = parseCSV(stopsText)
    const trips = parseCSV(tripsText)
    const stopTimes = parseCSV(stopTimesText)

    // Map trip_id -> route_id
    const tripToRoute = {}
    trips.forEach(t => { tripToRoute[t.trip_id] = t.route_id })

    // Map trip_id -> stop sequence
    const tripStops = {}
    stopTimes.forEach(st => {
      if (!tripStops[st.trip_id]) tripStops[st.trip_id] = []
      tripStops[st.trip_id].push({ stopId: st.stop_id, seq: parseInt(st.stop_sequence) })
    })
    Object.values(tripStops).forEach(seq => seq.sort((a,b)=>a.seq-b.seq))

    // Assign zones per route
    const stopToZone = {}
    const allZones = new Set()
    Object.keys(tripStops).forEach(tripId => {
      const routeId = tripToRoute[tripId]
      if (!routeId) return
      const stopsSeq = tripStops[tripId].map(s=>s.stopId)
      const zoneId = `${routeId}_Z`
      allZones.add(zoneId)
      stopsSeq.forEach(stopId => { stopToZone[stopId] = zoneId })
    })

    // Update stops.txt
    const updatedStops = stops.map(s => ({...s, zone_id: stopToZone[s.stop_id]||''}))
    const headersStops = Object.keys(updatedStops[0])
    outputStops.value = [headersStops.join(','), ...updatedStops.map(r=>headersStops.map(h=>r[h]).join(','))].join('\n')

    // Generate fare_rules.txt
    const fareRules = []
    allZones.forEach(zoneId => {
      const routeBase = zoneId.split('_')[0]
      const typeMatch = routeBase.match(/(N|SE|AC)$/i)
      const type = typeMatch ? typeMatch[1].toUpperCase() : 'N'
      fareRules.push({
        fare_id: `FARE_${type}`,
        route_id: routeBase,
        origin_id: zoneId,
        destination_id: zoneId,
        price: defaultFares[type]
      })
    })
    const headersFareRules = ['fare_id','route_id','origin_id','destination_id','price']
    outputFareRules.value = [headersFareRules.join(','), ...fareRules.map(f=>headersFareRules.map(h=>f[h]).join(','))].join('\n')

    // Generate fare_attributes.txt
    const uniqueFares = {}
    fareRules.forEach(f => uniqueFares[f.fare_id] = f.price)
    const fareAttrs = Object.keys(uniqueFares).map(fid=>({
      fare_id: fid,
      price: uniqueFares[fid],
      currency_type: 'LKR',
      payment_method: '0',
      transfers: '0'
    }))
    const headersAttr = ['fare_id','price','currency_type','payment_method','transfers']
    outputFareAttributes.value = [headersAttr.join(','), ...fareAttrs.map(a=>headersAttr.map(h=>a[h]).join(','))].join('\n')

    alert('✅ Fare files generated successfully!')
  } catch(e) {
    console.error(e)
    alert('Error generating fare files: '+e.message)
  } finally { processing.value = false }
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
</script>

<template>
  <div class="my-4 p-4 border rounded bg-white">
    <h2 class="text-lg font-bold mb-2">Upload GTFS Files</h2>
    <div class="mb-2">
      <label>stops.txt:</label>
      <input type="file" @change="handleStops">
    </div>
    <div class="mb-2">
      <label>trips.txt:</label>
      <input type="file" @change="handleTrips">
    </div>
    <div class="mb-2">
      <label>stop_times.txt:</label>
      <input type="file" @change="handleStopTimes">
    </div>

    <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded" @click="generateFareFiles" :disabled="processing">
      {{ processing ? 'Processing...' : 'Generate Fare Files' }}
    </button>

    <div v-if="outputStops" class="mt-4">
      <h3 class="font-semibold">Download Generated Files</h3>
      <button class="px-3 py-1 bg-green-500 text-white rounded mr-2" @click="downloadFile(outputStops,'stops.txt')">stops.txt</button>
      <button class="px-3 py-1 bg-green-500 text-white rounded mr-2" @click="downloadFile(outputFareRules,'fare_rules.txt')">fare_rules.txt</button>
      <button class="px-3 py-1 bg-green-500 text-white rounded" @click="downloadFile(outputFareAttributes,'fare_attributes.txt')">fare_attributes.txt</button>
    </div>
  </div>
</template>
