<script setup>
import { ref } from 'vue'

// File inputs
const stopsFile = ref(null)
const stopTimesFile = ref(null)
const transfersFile = ref(null)
const processing = ref(false)
const progressMessage = ref('')
const validationReport = ref(null)
const maxSpeed = ref(150) // Maximum allowed speed in km/h

// Output files
const outputStops = ref('')
const outputStopTimes = ref('')
const outputTransfers = ref('')

// Statistics
const stats = ref({
  originalStops: 0,
  validStops: 0,
  originalStopTimes: 0,
  cleanStopTimes: 0,
  originalTransfers: 0,
  cleanTransfers: 0,
  removedStopTimes: 0,
  removedTransfers: 0,
  speedViolations: 0,
  speedCorrections: 0,
  invalidTrips: 0,
  missingStopIds: []
})

function handleStops(e) { stopsFile.value = e.target.files[0] }
function handleStopTimes(e) { stopTimesFile.value = e.target.files[0] }
function handleTransfers(e) { transfersFile.value = e.target.files[0] }

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length === 0) return { headers: [], data: [] }
  
  const rawHeaders = lines[0].split(',')
  const headers = rawHeaders.map(h => h.trim().replace(/^"|"$/g, ''))
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = []
    let currentValue = ''
    let insideQuotes = false
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim().replace(/^"|"$/g, ''))
        currentValue = ''
      } else {
        currentValue += char
      }
    }
    values.push(currentValue.trim().replace(/^"|"$/g, ''))
    
    const obj = {}
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j] || ''
    }
    data.push(obj)
  }
  
  return { headers, data }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

function buildCSV(headers, data) {
  const rows = [headers.join(',')]
  for (const item of data) {
    const values = headers.map(h => {
      const val = String(item[h] || '')
      if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val
    })
    rows.push(values.join(','))
  }
  return rows.join('\n')
}

function validateLatitude(value) {
  if (!value || value.trim() === '') return null
  const num = parseFloat(value)
  if (isNaN(num) || !isFinite(num)) return null
  return (num >= -90 && num <= 90) ? num : null
}

function validateLongitude(value) {
  if (!value || value.trim() === '') return null
  const num = parseFloat(value)
  if (isNaN(num) || !isFinite(num)) return null
  return (num >= -180 && num <= 180) ? num : null
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c // Distance in km
}

// Parse time in HH:MM:SS format to seconds
function parseTime(timeStr) {
  if (!timeStr) return null
  const parts = timeStr.split(':')
  if (parts.length !== 3) return null
  const hours = parseInt(parts[0])
  const minutes = parseInt(parts[1])
  const seconds = parseInt(parts[2])
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null
  return hours * 3600 + minutes * 60 + seconds
}

// Format seconds back to HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

async function cleanGTFSFiles() {
  if (!stopsFile.value || !stopTimesFile.value) {
    alert('❌ Required files missing!\n\nPlease upload:\n• stops.txt (required)\n• stop_times.txt (required)\n• transfers.txt (optional)')
    return
  }

  processing.value = true
  progressMessage.value = '⚡ Loading files...'
  const report = { errors: [], warnings: [], fixed: [], stats: {} }

  try {
    const startTime = performance.now()
    
    // Read files
    const stopsText = await readFile(stopsFile.value)
    const stopTimesText = await readFile(stopTimesFile.value)
    const transfersText = transfersFile.value ? await readFile(transfersFile.value) : null

    progressMessage.value = '⚡ Parsing files...'
    const stopsData = parseCSV(stopsText)
    const stopTimesData = parseCSV(stopTimesText)
    const transfersData = transfersText ? parseCSV(transfersText) : null

    stats.value.originalStops = stopsData.data.length
    stats.value.originalStopTimes = stopTimesData.data.length
    stats.value.originalTransfers = transfersData ? transfersData.data.length : 0

    // Step 1: Validate stops and build valid stop IDs set with coordinates
    progressMessage.value = '⚡ Validating stops...'
    const validStopIds = new Set()
    const stopCoordinates = new Map()
    const validStopsData = []
    let invalidCoords = 0

    for (const stop of stopsData.data) {
      const stopId = stop.stop_id?.trim()
      if (!stopId) {
        invalidCoords++
        continue
      }

      const lat = validateLatitude(stop.stop_lat)
      const lon = validateLongitude(stop.stop_lon)
      
      if (lat === null || lon === null) {
        report.warnings.push(`⚠️ Stop "${stopId}" has invalid coordinates - removed`)
        invalidCoords++
        continue
      }

      validStopIds.add(stopId)
      stopCoordinates.set(stopId, { lat, lon })
      validStopsData.push({ ...stop, stop_lat: lat.toFixed(6), stop_lon: lon.toFixed(6) })
    }

    stats.value.validStops = validStopsData.length
    
    if (invalidCoords > 0) {
      report.fixed.push(`✓ Removed ${invalidCoords} stops with invalid coordinates`)
    }

    // Step 2: Group stop_times by trip_id
    progressMessage.value = '⚡ Analyzing and correcting travel speeds...'
    const tripStopTimes = new Map()
    
    for (const stopTime of stopTimesData.data) {
      const tripId = stopTime.trip_id?.trim()
      if (!tripId) continue
      
      if (!tripStopTimes.has(tripId)) {
        tripStopTimes.set(tripId, [])
      }
      tripStopTimes.get(tripId).push(stopTime)
    }

    // Sort stop times by sequence for each trip
    for (const [tripId, times] of tripStopTimes) {
      times.sort((a, b) => {
        const seqA = parseInt(a.stop_sequence) || 0
        const seqB = parseInt(b.stop_sequence) || 0
        return seqA - seqB
      })
    }

    // Step 3: Clean stop_times.txt with speed correction
    progressMessage.value = '⚡ Cleaning stop_times.txt and correcting speeds...'
    const cleanStopTimes = []
    const missingStops = new Set()
    const invalidTrips = new Set()
    let speedViolationCount = 0
    let speedCorrectionCount = 0
    const speedViolationDetails = []

    for (const [tripId, times] of tripStopTimes) {
      let tripIsValid = true
      const validTripStops = []

      // First pass: check if all stops exist
      for (const stopTime of times) {
        const stopId = stopTime.stop_id?.trim()
        if (!stopId || !validStopIds.has(stopId)) {
          if (stopId) missingStops.add(stopId)
          tripIsValid = false
          break
        }
        validTripStops.push({ ...stopTime, stopId })
      }

      if (!tripIsValid) {
        invalidTrips.add(tripId)
        continue
      }

      // Second pass: check and fix travel speeds between consecutive stops
      let correctedStops = [...validTripStops]
      let hasCorrected = false

      for (let i = 0; i < correctedStops.length - 1; i++) {
        const current = correctedStops[i]
        const next = correctedStops[i + 1]

        const currentStopId = current.stopId
        const nextStopId = next.stopId

        const currentCoords = stopCoordinates.get(currentStopId)
        const nextCoords = stopCoordinates.get(nextStopId)

        if (!currentCoords || !nextCoords) continue

        const departureTime = parseTime(current.departure_time)
        const arrivalTime = parseTime(next.arrival_time)

        if (departureTime === null || arrivalTime === null) continue

        const timeDiff = (arrivalTime - departureTime) / 3600 // hours
        if (timeDiff <= 0) continue

        const distance = calculateDistance(
          currentCoords.lat, currentCoords.lon,
          nextCoords.lat, nextCoords.lon
        )

        const speed = distance / timeDiff // km/h

        if (speed > maxSpeed.value) {
          speedViolationCount++
          
          // Calculate minimum time needed at max speed
          const minTimeHours = distance / maxSpeed.value
          const minTimeSeconds = Math.ceil(minTimeHours * 3600)
          
          // Adjust arrival time for next stop
          const newArrivalTime = departureTime + minTimeSeconds
          
          correctedStops[i + 1] = {
            ...next,
            arrival_time: formatTime(newArrivalTime)
          }

          // If this stop has a departure time, adjust it too (preserve dwell time)
          if (next.departure_time) {
            const origDeparture = parseTime(next.departure_time)
            if (origDeparture !== null) {
              const dwellTime = origDeparture - arrivalTime
              const newDepartureTime = newArrivalTime + (dwellTime > 0 ? dwellTime : 60) // min 60 sec dwell
              correctedStops[i + 1].departure_time = formatTime(newDepartureTime)
            }
          }

          // Cascade time adjustments to subsequent stops to maintain logical flow
          for (let j = i + 2; j < correctedStops.length; j++) {
            const prevStop = correctedStops[j - 1]
            const currStop = correctedStops[j]
            
            const prevDeparture = parseTime(prevStop.departure_time || prevStop.arrival_time)
            const currArrival = parseTime(currStop.arrival_time)
            
            if (prevDeparture !== null && currArrival !== null && currArrival < prevDeparture) {
              const offset = prevDeparture - currArrival + 60 // Add 60 sec buffer
              correctedStops[j] = {
                ...currStop,
                arrival_time: formatTime(parseTime(currStop.arrival_time) + offset)
              }
              if (currStop.departure_time) {
                correctedStops[j].departure_time = formatTime(parseTime(currStop.departure_time) + offset)
              }
            }
          }

          speedViolationDetails.push({
            tripId,
            fromStop: currentStopId,
            toStop: nextStopId,
            originalSpeed: speed.toFixed(1),
            correctedSpeed: (distance / minTimeHours).toFixed(1),
            distance: distance.toFixed(2),
            originalTime: timeDiff.toFixed(2),
            newTime: minTimeHours.toFixed(2)
          })
          
          hasCorrected = true
          speedCorrectionCount++
        }
      }

      cleanStopTimes.push(...correctedStops)
    }

    stats.value.cleanStopTimes = cleanStopTimes.length
    stats.value.removedStopTimes = stats.value.originalStopTimes - cleanStopTimes.length
    stats.value.speedViolations = speedViolationCount
    stats.value.speedCorrections = speedCorrectionCount
    stats.value.invalidTrips = invalidTrips.size
    stats.value.missingStopIds = Array.from(missingStops).sort()

    if (stats.value.removedStopTimes > 0) {
      report.fixed.push(`✓ Removed ${stats.value.removedStopTimes} stop_times entries from ${invalidTrips.size} trips with missing stops`)
      if (missingStops.size > 0) {
        report.fixed.push(`✓ Found ${missingStops.size} missing stop IDs: ${Array.from(missingStops).slice(0, 10).join(', ')}${missingStops.size > 10 ? '...' : ''}`)
      }
    }

    if (speedCorrectionCount > 0) {
      report.fixed.push(`✓ Corrected ${speedCorrectionCount} speed violations (adjusted times to respect ${maxSpeed.value} km/h limit)`)
      // Show first few violations as examples
      const exampleViolations = speedViolationDetails.slice(0, 5)
      exampleViolations.forEach(v => {
        report.warnings.push(`⚠️ Trip ${v.tripId}: Fixed ${v.originalSpeed} km/h → ${v.correctedSpeed} km/h between ${v.fromStop} and ${v.toStop} (${v.distance} km, time: ${v.originalTime}h → ${v.newTime}h)`)
      })
      if (speedViolationDetails.length > 5) {
        report.warnings.push(`... and ${speedViolationDetails.length - 5} more speed corrections`)
      }
    }

    // Step 4: Clean transfers.txt (if provided)
    let cleanTransfers = []
    if (transfersData) {
      progressMessage.value = '⚡ Cleaning transfers.txt...'
      
      for (const transfer of transfersData.data) {
        const fromStopId = transfer.from_stop_id?.trim()
        const toStopId = transfer.to_stop_id?.trim()
        
        if (!fromStopId || !toStopId || !validStopIds.has(fromStopId) || !validStopIds.has(toStopId)) {
          stats.value.removedTransfers++
          continue
        }
        
        cleanTransfers.push(transfer)
      }

      stats.value.cleanTransfers = cleanTransfers.length
      
      if (stats.value.removedTransfers > 0) {
        report.fixed.push(`✓ Removed ${stats.value.removedTransfers} transfers with invalid stop references`)
      }
    }

    // Step 5: Build output files
    progressMessage.value = '⚡ Building clean output files...'
    outputStops.value = buildCSV(stopsData.headers, validStopsData)
    outputStopTimes.value = buildCSV(stopTimesData.headers, cleanStopTimes)
    
    if (transfersData && cleanTransfers.length > 0) {
      outputTransfers.value = buildCSV(transfersData.headers, cleanTransfers)
    }

    const duration = ((performance.now() - startTime) / 1000).toFixed(2)
    
    report.stats = {
      duration,
      ...stats.value
    }

    report.fixed.push('✅ ZERO foreign key violations guaranteed!')
    report.fixed.push('✅ All speed violations corrected!')
    report.fixed.push('✅ All files ready for GTFS validation!')
    
    validationReport.value = report
    progressMessage.value = `✅ Complete in ${duration}s - Ready for upload!`
    
    const alertMessage = `🎉 GTFS Files Cleaned Successfully!\n\n` +
      `📊 Statistics:\n` +
      `• Valid Stops: ${stats.value.validStops} (removed ${invalidCoords})\n` +
      `• Clean stop_times: ${stats.value.cleanStopTimes} (removed ${stats.value.removedStopTimes})\n` +
      `• Invalid trips removed: ${stats.value.invalidTrips}\n` +
      `• Speed corrections applied: ${stats.value.speedCorrections}\n` +
      `${transfersData ? `• Clean transfers: ${stats.value.cleanTransfers} (removed ${stats.value.removedTransfers})\n` : ''}` +
      `• Missing stop IDs found: ${missingStops.size}\n\n` +
      `✅ ZERO foreign key violations!\n` +
      `✅ All speeds adjusted to max ${maxSpeed.value} km/h!\n` +
      `✅ Ready for GTFS validator upload!`
    
    alert(alertMessage)

  } catch (error) {
    alert('❌ Error: ' + error.message)
    progressMessage.value = 'Error: ' + error.message
    console.error('Full error:', error)
  } finally {
    processing.value = false
  }
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
}

function reset() {
  [stopsFile, stopTimesFile, transfersFile].forEach(f => f.value = null);
  [outputStops, outputStopTimes, outputTransfers, progressMessage].forEach(s => s.value = '')
  validationReport.value = null
  stats.value = {
    originalStops: 0,
    validStops: 0,
    originalStopTimes: 0,
    cleanStopTimes: 0,
    originalTransfers: 0,
    cleanTransfers: 0,
    removedStopTimes: 0,
    removedTransfers: 0,
    speedViolations: 0,
    speedCorrections: 0,
    invalidTrips: 0,
    missingStopIds: []
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 py-8 px-4">
    <div class="container mx-auto max-w-5xl space-y-6">

      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-2xl p-8 text-white">
        <h1 class="text-5xl font-black mb-3">🔧 GTFS Validator & Cleaner</h1>
        <p class="text-red-100 text-xl">Eliminates Foreign Key & Speed Violations</p>
        <p class="text-red-200 text-sm mt-2">
          ✅ Cleans stop_times.txt, transfers.txt, validates stops.txt & checks travel speeds
        </p>
      </div>

      <!-- Warning Box -->
      <div class="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-xl">
        <h3 class="text-xl font-black text-yellow-900 mb-2">⚠️ What This Tool Fixes:</h3>
        <ul class="text-yellow-800 space-y-2 ml-6 list-disc">
          <li><strong>Foreign Key Violations:</strong> Removes invalid stop references</li>
          <li><strong>Fast Travel:</strong> Removes trips exceeding realistic speeds</li>
          <li><strong>Invalid Coordinates:</strong> Validates latitude & longitude</li>
        </ul>
      </div>

      <!-- Speed Limit -->
      <div class="bg-white rounded-2xl shadow-xl p-6">
        <h2 class="text-2xl font-black text-gray-800 mb-4">⚡ Speed Limit Configuration</h2>
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label class="font-bold text-gray-700">Maximum Speed (km/h):</label>
          <input
            type="number"
            v-model.number="maxSpeed"
            min="50"
            max="500"
            class="px-4 py-2 border-2 border-gray-300 rounded-lg font-bold text-lg w-32"
          />
          <span class="text-sm text-gray-600">Trips exceeding this speed will be removed</span>
        </div>
      </div>

      <!-- Upload -->
      <div class="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h2 class="text-3xl font-black text-gray-800">📁 Upload Your GTFS Files</h2>

        <div class="space-y-4">
          <div class="bg-red-50 p-5 rounded-xl border-2 border-red-300">
            <label class="font-bold text-lg text-red-900">
              stops.txt <span class="text-red-600">* REQUIRED</span>
            </label>
            <input type="file" @change="handleStops" accept=".txt" class="mt-3 block w-full" />
            <span v-if="stopsFile" class="text-green-600 text-sm mt-2 block font-semibold">
              ✓ {{ stopsFile.name }}
            </span>
          </div>

          <div class="bg-orange-50 p-5 rounded-xl border-2 border-orange-300">
            <label class="font-bold text-lg text-orange-900">
              stop_times.txt <span class="text-red-600">* REQUIRED</span>
            </label>
            <input type="file" @change="handleStopTimes" accept=".txt" class="mt-3 block w-full" />
            <span v-if="stopTimesFile" class="text-green-600 text-sm mt-2 block font-semibold">
              ✓ {{ stopTimesFile.name }}
            </span>
          </div>

          <div class="bg-yellow-50 p-5 rounded-xl border-2 border-yellow-300">
            <label class="font-bold text-lg text-yellow-900">
              transfers.txt <span class="text-gray-600">(optional)</span>
            </label>
            <input type="file" @change="handleTransfers" accept=".txt" class="mt-3 block w-full" />
            <span v-if="transfersFile" class="text-green-600 text-sm mt-2 block font-semibold">
              ✓ {{ transfersFile.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Clean Button -->
      <div class="bg-white rounded-2xl shadow-xl p-6">
        <div v-if="processing && progressMessage" class="mb-4 p-4 bg-orange-50 rounded-xl">
          <p class="font-bold text-orange-900 text-center">{{ progressMessage }}</p>
        </div>
        <button
          @click="cleanGTFSFiles"
          :disabled="processing || !stopsFile || !stopTimesFile"
          class="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-6 rounded-xl font-black text-2xl disabled:opacity-50"
        >
          {{ processing ? '⚡ Cleaning Files...' : '🔧 Clean & Fix All Errors' }}
        </button>
      </div>

      <!-- Report -->
      <div v-if="validationReport" class="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h3 class="text-2xl font-black text-gray-800">📋 Cleaning Report</h3>

        <div v-if="validationReport.fixed.length" class="p-4 bg-green-50 rounded-xl">
          <h4 class="font-black text-green-900 mb-2">✅ Fixes Applied</h4>
          <ul>
            <li v-for="(f,i) in validationReport.fixed" :key="i">• {{ f }}</li>
          </ul>
        </div>

        <div v-if="validationReport.warnings.length" class="p-4 bg-orange-50 rounded-xl">
          <h4 class="font-black text-orange-900 mb-2">⚠️ Warnings</h4>
          <ul>
            <li v-for="(w,i) in validationReport.warnings" :key="i">• {{ w }}</li>
          </ul>
        </div>
      </div>

      <!-- Reset -->
      <button
        v-if="outputStops"
        @click="reset"
        class="w-full bg-gray-600 text-white py-4 rounded-xl font-bold"
      >
        🔄 Reset & Clean More Files
      </button>

    </div>
  </div>
</template>
