<script setup>
import { ref } from 'vue'

const fileContent = ref('')
const outputCsv = ref('')
const routeName = ref('ROUTE_1')

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    fileContent.value = e.target.result
  }
  reader.readAsText(file)
}

function generateZones() {
  if (!fileContent.value) return

  const lines = fileContent.value.trim().split('\n')
  const header = lines[0].split(',')

  // Add zone_id if not present
  if (!header.includes('zone_id')) {
    header.push('zone_id')
  }

  const updatedLines = [header.join(',')]

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',')
    row.push(routeName.value) // single-stage zone
    updatedLines.push(row.join(','))
  }

  outputCsv.value = updatedLines.join('\n')
}

function downloadFile() {
  const blob = new Blob([outputCsv.value], { type: 'text/plain;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'stops_with_zones.txt'
  link.click()

  URL.revokeObjectURL(url)
}
</script>

<template>
  <div style="max-width: 600px; margin: auto; padding: 2rem;">
    <h2>GTFS Stops → Single Fare Stage</h2>

    <input type="file" accept=".txt,.csv" @change="handleFileUpload" />

    <div style="margin-top: 1rem;">
      <label>Zone ID (Entire Route)</label>
      <input
        v-model="routeName"
        placeholder="ROUTE_31054"
        style="width: 100%; padding: 0.5rem;"
      />
    </div>

    <button style="margin-top: 1rem;" @click="generateZones">
      Generate zone_id
    </button>

    <button
      v-if="outputCsv"
      style="margin-top: 1rem; margin-left: 1rem;"
      @click="downloadFile"
    >
      Download stops.txt
    </button>

    <pre v-if="outputCsv" style="margin-top: 2rem; max-height: 300px; overflow: auto;">
{{ outputCsv }}
    </pre>
  </div>
</template>
