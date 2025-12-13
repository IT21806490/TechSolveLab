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

// Handles file upload and reads it as text
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

// Converts time strings into seconds from midnight
// Supports both "HH:MM:SS", "HH:MM" and decimal hours like "5.00"
function timeToSeconds(timeStr) {
  timeStr = timeStr.trim();
  if (timeStr.includes(":")) {
    const parts = timeStr.split(":").map(Number);
    // Handle HH:MM or HH:MM:SS
    const h = parts[0];
    const m = parts[1] || 0;
    const s = parts[2] || 0;
    return h * 3600 + m * 60 + s;
  } else {
    // If decimal hours format e.g. 5.00, convert to HH:MM:SS
    const decimalHours = parseFloat(timeStr);
    if (isNaN(decimalHours)) return 0;
    const h = Math.floor(decimalHours);
    const m = Math.floor((decimalHours - h) * 60);
    const s = Math.round(((decimalHours - h) * 60 - m) * 60);
    return h * 3600 + m * 60 + s;
  }
}

// Converts seconds back to HH:MM:SS string format
function secondsToTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((x) => String(x).padStart(2, "0")).join(":");
}

// Parses CSV text, validates, groups by trip_id, and calculates frequencies
function processCSV(csvText) {
  warnings.value = [];
  frequencies.value = [];

  // Split CSV lines, support CRLF and LF
  const rows = csvText
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((c) => c.trim()))
    .filter((r) => r.length >= 2);

  if (rows.length === 0) {
    warnings.value.push("Empty or invalid CSV file");
    return;
  }

  const headers = rows.shift();
  const tripIdx = headers.findIndex((h) => h.toLowerCase() === "trip_id");
  const timeIdx = headers.findIndex((h) => h.toLowerCase() === "time");

  if (tripIdx === -1 || timeIdx === -1) {
    warnings.value.push("CSV must have 'trip_id' and 'time' columns");
    return;
  }

  // Group times by trip_id
  const trips = {};
  for (const row of rows) {
    const trip_id = row[tripIdx];
    const time = row[timeIdx];
    if (!trip_id || !time) {
      warnings.value.push(`Skipping invalid row: ${row.join(",")}`);
      continue;
    }
    if (!trips[trip_id]) trips[trip_id] = [];
    trips[trip_id].push(timeToSeconds(time));
  }

  for (const trip_id in trips) {
    const times = trips[trip_id].sort((a, b) => a - b);

    if (times.length < 2) {
      warnings.value.push(`Trip ${trip_id} has less than 2 times, skipping`);
      continue;
    }

    const headways = times.slice(1).map((t, i) => t - times[i]);
    const uniqueHeadways = [...new Set(headways)];

    if (uniqueHeadways.length === 1) {
      // all headways equal
      frequencies.value.push({
        trip_id,
        start_time: secondsToTime(times[0]),
        end_time: secondsToTime(times[times.length - 1]),
        headway_secs: uniqueHeadways[0],
        exact_times: 0,
      });
    } else {
      // different headways, split into multiple rows
      for (let i = 1; i < times.length; i++) {
        frequencies.value.push({
          trip_id,
          start_time: secondsToTime(times[i - 1]),
          end_time: secondsToTime(times[i]),
          headway_secs: times[i] - times[i - 1],
          exact_times: 0,
        });
      }
    }
  }
}

// Trigger CSV download with frequencies.txt content
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
