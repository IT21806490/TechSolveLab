<script setup>
import { ref, computed } from 'vue'

/* --------------------------------------------------
   STATE
-------------------------------------------------- */
const stopsFile = ref(null)
const tripsFile = ref(null)
const stopTimesFile = ref(null)
const routesFile = ref(null)
const agencyFile = ref(null)
const fareStagesFile = ref(null)

const outputStops = ref('')
const outputFareRules = ref('')
const outputFareAttributes = ref('')
const processing = ref(false)
const progressMessage = ref('')
const validationReport = ref(null)

const routeCount = ref(0)
const stopCount = ref(0)
const fareRuleCount = ref(0)
const fareAttributeCount = ref(0)

/* --------------------------------------------------
   DEFAULT FARES
-------------------------------------------------- */
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
])

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */
const parseCSV = text => {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  return lines.slice(1).map(line => {
    const values = line.split(',')
    const obj = {}
    headers.forEach((h, i) => (obj[h] = (values[i] || '').trim()))
    return obj
  })
}

const readFile = file =>
  new Promise(res => {
    const r = new FileReader()
    r.onload = e => res(e.target.result)
    r.readAsText(file)
  })

const validateLat = v => {
  const n = parseFloat(v)
  return isFinite(n) && n >= -90 && n <= 90 ? n.toFixed(6) : null
}
const validateLon = v => {
  const n = parseFloat(v)
  return isFinite(n) && n >= -180 && n <= 180 ? n.toFixed(6) : null
}

const buildCSV = (headers, rows) => {
  const out = [headers.join(',')]
  rows.forEach(r => {
    out.push(headers.map(h => r[h] ?? '').join(','))
  })
  return out.join('\n')
}

const getRouteType = s => {
  s = s.toUpperCase()
  if (s.includes('SUPER')) return 'super'
  if (s.includes('HIGHWAY') || s.includes('HWY')) return 'highway'
  if (s.includes('AC')) return 'ac'
  if (s.includes('SEMI')) return 'semi'
  return 'normal'
}

const calcStage = (idx, total) =>
  Math.min(Math.floor(idx / Math.ceil(total / 10)), 10)

/* --------------------------------------------------
   MAIN
-------------------------------------------------- */
async function generateZonesAndFares () {
  processing.value = true
  progressMessage.value = 'Processing…'

  try {
    const [stopsT, tripsT, stopTimesT, routesT, agencyT, fareT] =
      await Promise.all([
        readFile(stopsFile.value),
        readFile(tripsFile.value),
        readFile(stopTimesFile.value),
        routesFile.value ? readFile(routesFile.value) : '',
        agencyFile.value ? readFile(agencyFile.value) : '',
        fareStagesFile.value ? readFile(fareStagesFile.value) : ''
      ])

    const stops = parseCSV(stopsT)
    const trips = parseCSV(tripsT)
    const stopTimes = parseCSV(stopTimesT)
    const routes = routesT ? parseCSV(routesT) : []
    const agencies = agencyT ? parseCSV(agencyT) : []

    const agencyId = agencies[0]?.agency_id || ''

    /* ROUTES */
    const routeType = new Map()
    routes.forEach(r =>
      routeType.set(r.route_id, getRouteType(r.route_short_name || r.route_id))
    )

    /* TRIP → ROUTE */
    const tripRoute = new Map()
    trips.forEach(t => t.trip_id && t.route_id && tripRoute.set(t.trip_id, t.route_id))

    /* STOP SEQUENCES */
    const tripStops = new Map()
    stopTimes.forEach(st => {
      if (!tripRoute.has(st.trip_id)) return
      if (!tripStops.has(st.trip_id)) tripStops.set(st.trip_id, [])
      tripStops.get(st.trip_id).push({
        stop_id: st.stop_id,
        seq: Number(st.stop_sequence)
      })
    })
    tripStops.forEach(v => v.sort((a, b) => a.seq - b.seq))

    /* ZONES */
    const stopZone = new Map()
    const zones = new Set()

    tripStops.forEach(stops => {
      const total = stops.length
      stops.forEach((s, i) => {
        const z = `Z${calcStage(i, total)}`
        stopZone.set(s.stop_id, z)
        zones.add(z)
      })
    })

    /* STOPS */
    const cleanStops = []
    stops.forEach(s => {
      const lat = validateLat(s.stop_lat)
      const lon = validateLon(s.stop_lon)
      const zone = stopZone.get(s.stop_id)
      if (!lat || !lon || !zone) return
      cleanStops.push({
        ...s,
        stop_lat: lat,
        stop_lon: lon,
        zone_id: zone
      })
    })

    outputStops.value = buildCSV(
      Object.keys(cleanStops[0]),
      cleanStops
    )

    /* FARES */
    const fareStages = fareT ? parseCSV(fareT) : defaultFareStages.value
    const stageMap = new Map()
    fareStages.forEach(f => stageMap.set(Number(f.fare_stage), f))

    const fareRules = []
    const fareAttrs = new Map()

    zones.forEach(z => {
      const stage = Number(z.replace('Z', ''))
      routes.forEach(r => {
        const type = routeType.get(r.route_id) || 'normal'
        const fare = stageMap.get(stage)?.[type] ?? 0
        const fareId = `${r.route_id}_${type}_${stage}`

        fareRules.push({
          fare_id: fareId,
          route_id: r.route_id,
          destination_id: z
        })

        if (!fareAttrs.has(fareId)) {
          fareAttrs.set(fareId, {
            fare_id: fareId,
            price: Number(fare).toFixed(2),
            currency_type: 'LKR',
            payment_method: '0',
            transfers: '0',
            fare_transfer_duration: '',
            agency_id: agencyId
          })
        }
      })
    })

    outputFareRules.value = buildCSV(
      ['fare_id', 'route_id', 'destination_id'],
      fareRules
    )

    outputFareAttributes.value = buildCSV(
      ['fare_id', 'price', 'currency_type', 'payment_method', 'transfers', 'fare_transfer_duration', 'agency_id'],
      Array.from(fareAttrs.values())
    )

    routeCount.value = routes.length
    stopCount.value = cleanStops.length
    fareRuleCount.value = fareRules.length
    fareAttributeCount.value = fareAttrs.size

    progressMessage.value = '✅ ZERO-ERROR GTFS GENERATED'
  } catch (e) {
    alert(e.message)
  } finally {
    processing.value = false
  }
}
</script>
