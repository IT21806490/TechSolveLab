<template>
  <div class="container">
    <h1>GTFS Frequencies Generator</h1>

    <input type="file" accept=".csv" @change="handleFile" />

    <div v-if="warnings.length">
      <h3>Warnings:</h3>
      <ul>
        <li v-for="(w, i) in warnings" :key="i" style="color: orange">{{ w }}</li>
      </ul>
    </div>

    <button v-if="frequencies.length" @click="downloadFrequencies">
      Download frequencies.txt
    </button>

    <table v-if="frequencies.length" border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>trip_id</th>
          <th>start_time</th>
          <th>end_time</th>
          <th>headway_secs</th>
          <th>exact_times</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in frequencies" :key="i">
          <td>{{ row.trip_id }}</td>
          <td>{{ row.start_time }}</td>
          <td>{{ row.end_time }}</td>
          <td>{{ row.headway_secs }}</td>
          <td>{{ row.exact_times }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue";

const frequencies = ref([]);
const warnings = ref([]);

// Convert decimal time (5.12) to seconds for calculations
function decimalToSeconds(decimalStr) {
  const num = parseFloat(decimalStr);
  const h = Math.floor(num);
  const m = Math.round((num - h) * 100);
  return h * 3600 + m * 60;
}

// Convert decimal hours to HH.MM:SS format
function decimalToHHMMSS(decimalStr) {
  const num = parseFloat(decimalStr);
  const h = Math.floor(num);
  const m = Math.round((num - h) * 100);
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}.${mm}:00`;
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    processCSV(text);
  };
  reader.readAsText(file);
}

function processCSV(csvText) {
  warnings.value = [];
  frequencies.value = [];

  const rows = csvText
    .trim()
    .split("\n")
    .map((line) => line.split(","))
    .filter((r) => r.length >= 2);

  const headers = rows.shift().map((h) => h.trim());
  const tripIdx = headers.indexOf("trip_id");
  const timeIdx = headers.indexOf("time");

  if (tripIdx === -1 || timeIdx === -1) {
    warnings.value.push("CSV must have 'trip_id' and 'time' columns");
    return;
  }

  // Group times by trip_id
  const trips = {};
  for (const row of rows) {
    const trip_id = row[tripIdx].trim();
    const time = row[timeIdx].trim();
    if (!trip_id || !time) {
      warnings.value.push(`Skipping invalid row: ${row.join(",")}`);
      continue;
    }
    if (!trips[trip_id]) trips[trip_id] = [];
    trips[trip_id].push(time);
  }

  // Generate frequencies in **pairs** (0-1, 2-3, 4-5...)
  for (const trip_id in trips) {
    const times = trips[trip_id];
    if (times.length < 2) {
      warnings.value.push(`Trip ${trip_id} has less than 2 times, skipping`);
      continue;
    }

    for (let i = 0; i < times.length; i += 2) {
      if (i + 1 >= times.length) break; // ignore last if no pair
      const start = times[i];
      const end = times[i + 1];
      frequencies.value.push({
        trip_id,
        start_time: decimalToHHMMSS(start),
        end_time: decimalToHHMMSS(end),
        headway_secs: decimalToSeconds(end) - decimalToSeconds(start),
        exact_times: 0,
      });
    }
  }
}

function downloadFrequencies() {
  const csvContent =
    "trip_id,start_time,end_time,headway_secs,exact_times\n" +
    frequencies.value
      .map(
        (r) =>
          `${r.trip_id},${r.start_time},${r.end_time},${r.headway_secs},${r.exact_times}`
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "frequencies.txt");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  font-family: sans-serif;
}
h1 {
  margin-bottom: 20px;
}
table {
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px 12px;
  text-align: left;
}
</style>
