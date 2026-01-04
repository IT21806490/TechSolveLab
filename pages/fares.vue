<script setup>
import { ref } from 'vue'
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

let stops = [], trips = [], stopTimes = []

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
    stops = await parseCSV(stopsFile.value)
    trips = await parseCSV(tripsFile.value)
    stopTimes = await parseCSV(stopTimesFile.value)

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
          // Multi-stage logic: would need stop_times sequence for proper staging
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
          // Escape commas and quotes in CSV
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
      outputStops.value = [stopHeaders.join(','), ...stopRows].join('\n')
    }

    // Generate fare_rules.txt (one rule per route per direction)
    const fareRules = []
    const uniqueZones = new Set()
    
    for (const routeId in routeStops) {
      // Forward direction
      const zoneF = `${routeId}_F`
      uniqueZones.add(zoneF)
      fareRules.push({
        fare_id: fareId.value,
        route_id: routeId,
        origin_id: zoneF,
        destination_id: zoneF
      })
      
      // Reverse direction
      const zoneR = `${routeId}_R`
      uniqueZones.add(zoneR)
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

    alert(`Success! Generated zones for ${Object.keys(routeStops).length} routes`)
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
  // Reset file inputs
  document.querySelectorAll('input[type="file"]').forEach(input => input.value = '')
}
</script>

<template>
  <div style="max-width:800px; margin:auto; padding:2rem; font-family: system-ui, -apple-system, sans-serif;">
    <h1 style="color: #2563eb; margin-bottom: 0.5rem;">GTFS Fare Zone Generator</h1>
    <p style="color: #64748b; margin-bottom: 2rem;">Automatically generate zone_id, fare_rules.txt, and fare_attributes.txt for your GTFS feed</p>

    <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <h3 style="margin-top: 0; color: #334155;">Upload GTFS Files</h3>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #475569;">
          stops.txt <span style="color: #ef4444;">*</span>
        </label>
        <input type="file" accept=".txt,.csv" @change="handleStops" 
          style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;" />
      </div>

      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #475569;">
          trips.txt <span style="color: #ef4444;">*</span>
        </label>
        <input type="file" accept=".txt,.csv" @change="handleTrips" 
          style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;" />
      </div>

      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #475569;">
          stop_times.txt <span style="color: #ef4444;">*</span>
        </label>
        <input type="file" accept=".txt,.csv" @change="handleStopTimes" 
          style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;" />
      </div>
    </div>

    <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <h3 style="margin-top: 0; color: #334155;">Fare Configuration</h3>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" v-model="singleStage" 
            style="width: 18px; height: 18px; margin-right: 0.5rem; cursor: pointer;" />
          <span style="font-weight: 500; color: #475569;">Assign entire route as single fare stage</span>
        </label>
        <small style="color: #64748b; margin-left: 1.6rem; display: block; margin-top: 0.25rem;">
          Recommended for simple flat-fare systems
        </small>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #475569;">
            Fare ID
          </label>
          <input v-model="fareId" placeholder="FARE_NORMAL" 
            style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #475569;">
            Fare Amount
          </label>
          <input v-model="fareAmount" type="number" step="0.01" placeholder="50.00" 
            style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px;" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #475569;">
            Currency
          </label>
          <input v-model="currencyType" placeholder="LKR" maxlength="3" 
            style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; text-transform: uppercase;" />
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
      <button @click="generateZonesAndFares" :disabled="processing"
        style="flex: 1; padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; 
               border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem;
               opacity: 1; transition: all 0.2s;"
        :style="processing ? 'opacity: 0.6; cursor: not-allowed;' : ''"
        @mouseover="e => !processing && (e.target.style.background = '#1d4ed8')"
        @mouseout="e => e.target.style.background = '#2563eb'">
        {{ processing ? 'Processing...' : 'Generate Fare Files' }}
      </button>

      <button @click="reset" :disabled="processing"
        style="padding: 0.75rem 1.5rem; background: #64748b; color: white; border: none; 
               border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem;"
        :style="processing ? 'opacity: 0.6; cursor: not-allowed;' : ''"
        @mouseover="e => !processing && (e.target.style.background = '#475569')"
        @mouseout="e => e.target.style.background = '#64748b'">
        Reset
      </button>
    </div>

    <div v-if="outputStops" style="background: #f0fdf4; border: 1px solid #86efac; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <h3 style="margin-top: 0; color: #166534;">✓ Files Generated Successfully!</h3>
      <p style="color: #15803d; margin-bottom: 1rem;">Download your generated GTFS fare files:</p>
      
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button @click="downloadFile(outputStops, 'stops.txt')"
          style="padding: 0.625rem 1.25rem; background: #16a34a; color: white; border: none; 
                 border-radius: 6px; font-weight: 600; cursor: pointer;"
          @mouseover="e => e.target.style.background = '#15803d'"
          @mouseout="e => e.target.style.background = '#16a34a'">
          📥 Download stops.txt
        </button>
        
        <button @click="downloadFile(outputFareRules, 'fare_rules.txt')"
          style="padding: 0.625rem 1.25rem; background: #16a34a; color: white; border: none; 
                 border-radius: 6px; font-weight: 600; cursor: pointer;"
          @mouseover="e => e.target.style.background = '#15803d'"
          @mouseout="e => e.target.style.background = '#16a34a'">
          📥 Download fare_rules.txt
        </button>
        
        <button @click="downloadFile(outputFareAttributes, 'fare_attributes.txt')"
          style="padding: 0.625rem 1.25rem; background: #16a34a; color: white; border: none; 
                 border-radius: 6px; font-weight: 600; cursor: pointer;"
          @mouseover="e => e.target.style.background = '#15803d'"
          @mouseout="e => e.target.style.background = '#16a34a'">
          📥 Download fare_attributes.txt
        </button>
      </div>
    </div>

    <div v-if="outputStops" style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
      <h4 style="margin-top: 0; color: #334155;">Preview: stops.txt (first 10 lines)</h4>
      <pre style="background: white; padding: 1rem; border-radius: 4px; overflow: auto; 
                  max-height: 300px; font-size: 0.875rem; border: 1px solid #e2e8f0;">{{ outputStops.split('\n').slice(0, 10).join('\n') }}</pre>
    </div>
  </div>
</template>
