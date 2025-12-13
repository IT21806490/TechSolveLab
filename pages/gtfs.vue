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
          <th>direction</th>
          <th>start_time</th>
          <th>end_time</th>
          <th>headway_secs</th>
          <th>exact_times</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in frequencies" :key="i">
          <td>{{ row.trip_id }}</td>
          <td>{{ row.direction }}</td>
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

// --- parse CSV manually ---
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  const headers = lines[0].split(",").map(h => h.trim());
  const data = lines.slice(1).map(line => {
    const cols = line.split(",").map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i];
    });
    return obj;
  });
  return data;
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const data = parseCSV(text);
    processCSV(data);
  };
  reader.readAsText(file);
}

function timeToSeconds(timeStr) {
  const [h, m, s = 0] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function secondsToTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(x => String(x).padStart(2, "0")).join(":");
}

function processCSV(data) {
  warnings.value = [];
  frequencies.value = [];

  const trips = {};
  for (const row of data) {
    if (!row.trip_id || !row.time) {
      warnings.value.push("Missing trip_id or time: " + JSON.stringify(row));
      continue;
    }
    const key = `${row.trip_id}-${row.direction || "0"}`;
    if (!trips[key]) trips[key] = [];
    trips[key].push(timeToSeconds(row.time));
  }

  for (const key in trips) {
    const [trip_id, direction] = key.split("-");
    const times = trips[key].sort((a, b) => a - b);

    if (times.length < 2) {
      warnings.value.push(`Trip ${trip_id} (direction ${direction}) has less than 2 times, skipping`);
      continue;
    }

    const headways = [];
    for (let i = 1; i < times.length; i++) headways.push(times[i] - times[i - 1]);
    const uniqueHeadways = [...new Set(headways)];

    if (uniqueHeadways.length === 1) {
      frequencies.value.push({
        trip_id,
        direction,
        start_time: secondsToTime(times[0]),
        end_time: secondsToTime(times[times.length - 1]),
        headway_secs: uniqueHeadways[0],
        exact_times: 0,
      });
    } else {
      for (let i = 1; i < times.length; i++) {
        frequencies.value.push({
          trip_id,
          direction,
          start_time: secondsToTime(times[i - 1]),
          end_time: secondsToTime(times[i]),
          headway_secs: times[i] - times[i - 1],
          exact_times: 0,
        });
      }
    }
  }
}

function downloadFrequencies() {
  const csvContent =
    "trip_id,direction,start_time,end_time,headway_secs,exact_times\n" +
    frequencies.value
      .map(r => `${r.trip_id},${r.direction},${r.start_time},${r.end_time},${r.headway_secs},${r.exact_times}`)
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
  max-width: 900px;
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
th, td {
  padding: 8px 12px;
  text-align: left;
}
</style>
