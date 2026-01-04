<script setup>
import { ref } from 'vue'
import Papa from 'papaparse'

const stopsFile = ref(null)
const tripsFile = ref(null)
const stopTimesFile = ref(null)
const outputStops = ref('')
const outputFareRules = ref('')

const singleStage = ref(true)
const fareId = ref('FARE_NORMAL')

let stops = [], trips = [], stopTimes = []

// File handlers
function handleStops(e) { stopsFile.value = e.target.files[0] }
function handleTrips(e) { tripsFile.value = e.target.files[0] }
function handleStopTimes(e) { stopTimesFile.value = e.target.files[0] }

// Parse CSV
async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      Papa.parse(e.target.result, { header: true, skipEmptyLines: true, complete: results => resolve(results.data) })
    }
    reader.onerror = err => reject(err)
    reader.readAsText(file)
  })
}

// Generate zones and fare_rules
async function generateZonesAndFares() {
  if (!stopsFile.value || !tripsFile.value || !stopTimesFile.value)
    return alert('Upload all 3 files')

  stops = await parseCSV(stopsFile.value)
  trips = await parseCSV(tripsFile.value)
  stopTimes = await parseCSV(stopTimesFile.value)

  // Build route_id -> stop_ids mapping
  const routeStops = {}
  for (const trip of trips) {
    const routeId = trip.route_id
    if (!routeStops[routeId]) routeStops[routeId] = new Set()
    const tripId = trip.trip_id
    const stopsForTrip = stopTimes.filter(s => s.trip_id === tripId).map(s => s.stop_id)
    stopsForTrip.forEach(sid => routeStops[routeId].add(sid))
  }

  // Assign zone_id in stops
  const updatedStops = stops.map(s => {
    let zone = ''
    for (const routeId in routeStops) {
      if (routeStops[routeId].has(s.stop_id)) {
        // Detect reverse route by stop_id suffix
        const direction = s.stop_id.endsWith('-R') ? 'R' : 'F'
        zone = singleStage.value ? `${routeId}_${direction}` : `STAGE_${routeId}_${direction}_1`
        break
      }
    }
    return { ...s, zone_id: zone }
  })

  const stopHeader = Object.keys(updatedStops[0])
  outputStops.value = [stopHeader.join(','), ...updatedStops.map(r => stopHeader.map(h => r[h] || '').join(','))].join('\n')

  // Generate fare_rules.txt (single-stage per route)
  const fareRules = []
  for (const routeId in routeStops) {
    // Forward
    fareRules.push({
      fare_id: fareId.value,
      route_id: routeId,
      origin_id: `${routeId}_F`,
      destination_id: `${routeId}_F`
    })
    // Reverse
    fareRules.push({
      fare_id: fareId.value,
      route_id: routeId,
      origin_id: `${routeId}_R`,
      destination_id: `${routeId}_R`
    })
  }
  const fareHeader = Object.keys(fareRules[0])
  outputFareRules.value = [fareHeader.join(','), ...fareRules.map(r => fareHeader.map(h => r[h] || '').join(','))].join('\n')
}

// Download function
function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div style="max-width:700px; margin:auto; padding:2rem">
    <h2>GTFS: Generate zone_id & fare_rules automatically</h2>

    <div style="margin-top:1rem">
      <label>Upload stops.txt</label>
      <input type="file" accept=".txt,.csv" @change="handleStops" />
    </div>

    <div style="margin-top:1rem">
      <label>Upload trips.txt</label>
      <input type="file" accept=".txt,.csv" @change="handleTrips" />
    </div>

    <div style="margin-top:1rem">
      <label>Upload stop_times.txt</label>
      <input type="file" accept=".txt,.csv" @change="handleStopTimes" />
    </div>

    <div style="margin-top:1rem">
      <label>
        <input type="checkbox" v-model="singleStage" />
        Assign entire route as single stage
      </label>
    </div>

    <div style="margin-top:1rem">
      <label>Fare ID</label>
      <input v-model="fareId" placeholder="FARE_NORMAL" style="width:100%; padding:0.5rem;" />
    </div>

    <button style="margin-top:1rem" @click="generateZonesAndFares">Generate zone_id & fare_rules</button>

    <div v-if="outputStops" style="margin-top:1rem;">
      <button @click="downloadFile(outputStops, 'stops_with_zones.txt')">Download stops.txt</button>
      <button @click="downloadFile(outputFareRules, 'fare_rules.txt')" style="margin-left:1rem">Download fare_rules.txt</button>
    </div>

    <pre v-if="outputStops" style="margin-top:2rem; max-height:300px; overflow:auto">
{{ outputStops }}
    </pre>
  </div>
</template>
