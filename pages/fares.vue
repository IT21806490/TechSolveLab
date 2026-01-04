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

// Simple CSV parser using native JS
async function parseCSV(file) {
  const text = await file.text()
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '')
  const headers = lines[0].split(',')
  return lines.slice(1).map(line => {
    const values = line.split(',')
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = values[i] || ''
    })
    return obj
  })
}

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

    // Build trip_id -> route_id mapping
    const tripToRoute = {}
    trips.forEach(trip => {
      const tripId = (trip.trip_id || '').trim()
      const routeId = (trip.route_id || '').trim()
      if (tripId && routeId) tripToRoute[tripId] = routeId
    })

    // Build trip stop sequences
    const tripStops = {}
    stopTimes.forEach(st => {
      const tripId = (st.trip_id || '').trim()
      const stopId = (st.stop_id || '').trim()
      const seq = parseInt(st.stop_sequence) || 0
      if (!tripId || !stopId) return
      if (!tripStops[tripId]) tripStops[tripId] = []
      tripStops[tripId].push({ stopId, seq })
    })
    Object.keys(tripStops).forEach(tripId => {
      tripStops[tripId].sort((a, b) => a.seq - b.seq)
    })

    // Build route patterns and assign direction
    const routePatterns = {}
    Object.keys(tripStops).forEach(tripId => {
      const routeId = tripToRoute[tripId]
      if (!routeId) return
      const stopSeq = tripStops[tripId].map(s => s.stopId).join('|')
      if (!routePatterns[routeId]) routePatterns[routeId] = {}
      if (!routePatterns[routeId][stopSeq]) {
        routePatterns[routeId][stopSeq] = {
          stops: tripStops[tripId].map(s => s.stopId),
          direction: Object.keys(routePatterns[routeId]).length
        }
      }
    })

    // Assign zones
    const stopToZone = {}
    const allZones = new Set()
    Object.keys(routePatterns).forEach(routeId => {
      const patterns = routePatterns[routeId]
      Object.values(patterns).forEach(pattern => {
        const dir = pattern.direction === 0 ? 'F' : 'R'
        if (singleStage.value) {
          const zone = `${routeId}_${dir}`
          allZones.add(zone)
          pattern.stops.forEach(stopId => {
            if (!stopToZone[stopId]) stopToZone[stopId] = zone
          })
        } else {
          const numStops = pattern.stops.length
          const perStage = Math.ceil(numStops / 3)
          pattern.stops.forEach((stopId, idx) => {
            const stage = Math.floor(idx / perStage) + 1
            const zone = `${routeId}_${dir}_S${stage}`
            allZones.add(zone)
            if (!stopToZone[stopId]) stopToZone[stopId] = zone
          })
        }
      })
    })

    // Update stops.txt with zone_id
    const updatedStops = stops.map(stop => ({
      ...stop,
      zone_id: stopToZone[(stop.stop_id || '').trim()] || ''
    }))
    if (updatedStops.length) {
      const headers = Object.keys(updatedStops[0])
      const rows = updatedStops.map(row =>
        headers.map(h => row[h] || '').join(',')
      )
      outputStops.value = [headers.join(','), ...rows].join('\n')
    }

    // Fare rules
    const fareRules = []
    allZones.forEach(zone => {
      const routeId = zone.split('_')[0]
      fareRules.push({
        fare_id: fareId.value,
        route_id: routeId,
        origin_id: zone,
        destination_id: zone
      })
    })
    if (fareRules.length) {
      const headers = ['fare_id', 'route_id', 'origin_id', 'destination_id']
      const rows = fareRules.map(r => headers.map(h => r[h]).join(','))
      outputFareRules.value = [headers.join(','), ...rows].join('\n')
    }

    // Fare attributes
    const fareAttrs = [{
      fare_id: fareId.value,
      price: fareAmount.value,
      currency_type: currencyType.value,
      payment_method: '0',
      transfers: '0'
    }]
    const headersAttr = ['fare_id', 'price', 'currency_type', 'payment_method', 'transfers']
    const rowsAttr = fareAttrs.map(a => headersAttr.map(h => a[h]).join(','))
    outputFareAttributes.value = [headersAttr.join(','), ...rowsAttr].join('\n')

    // Stats
    const uniqueRoutes = new Set(Object.values(tripToRoute))
    routeCount.value = uniqueRoutes.size
    stopCount.value = Object.keys(stopToZone).length
    fareRuleCount.value = fareRules.length

  } catch (err) {
    console.error(err)
    alert('Error processing files: ' + err.message)
  } finally {
    processing.value = false
  }
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
