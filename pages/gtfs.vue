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
import Papa from "papaparse";

const frequencies = ref([]);
const warnings = ref([]);

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      processCSV(results.data);
    },
  });
}

function timeToSeconds(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60;
}

function secondsToTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((x) => String(x).padStart(2, "0")).join(":");
}

function processCSV(data) {
  warnings.value = [];
  frequencies.value = [];

  // group by trip_id
  const trips = {};
  for (const row of data) {
    if (!row.trip_id || !row.time) {
      warnings.value.push("Missing trip_id or time in row: " + JSON.stringify(row));
      continue;
    }
    if (!trips[row.trip_id]) trips[row.trip_id] = [];
    trips[row.trip_id].push(timeToSeconds(row.time));
  }

  for (const trip_id in trips) {
    const times = trips[trip_id].sort((a, b) => a - b);

    if (times.length < 2) {
      warnings.value.push(`Trip ${trip_id} has less than 2 times, skipping`);
      continue;
    }

    // check if headways are equal
    const headways = [];
    for (let i = 1; i < times.length; i++) headways.push(times[i] - times[i - 1]);

    const uniqueHeadways = [...new Set(headways)];

    if (uniqueHeadways.length === 1) {
      frequencies.value.push({
        trip_id,
        start_time: secondsToTime(times[0]),
        end_time: secondsToTime(times[times.length - 1]),
        headway_secs: uniqueHeadways[0],
        exact_times: 0,
      });
    } else {
      // split into multiple rows for different headways
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
th, td {
  padding: 8px 12px;
  text-align: left;
}
</style>
