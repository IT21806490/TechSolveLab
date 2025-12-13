<template>
  <div class="container">
    <h1>GTFS Frequencies Generator</h1>

    <!-- File Upload -->
    <input type="file" accept=".csv" @change="handleFile" class="mb-4 p-2 border rounded" />

    <!-- Exact Times Input -->
    <div v-if="frequencies.length" class="mb-4">
      <label class="block mb-1 font-semibold">Set exact_times for all rows:</label>
      <input
        type="number"
        v-model.number="globalExactTimes"
        class="p-2 border rounded w-32"
        placeholder="0"
      />
    </div>

    <!-- Warnings -->
    <div v-if="warnings.length">
      <h3>Warnings:</h3>
      <ul>
        <li v-for="(w, i) in warnings" :key="i" style="color: orange">{{ w }}</li>
      </ul>
    </div>

    <!-- Frequencies Table -->
    <table
      v-if="frequencies.length"
      border="1"
      cellpadding="5"
      cellspacing="0"
      class="mt-4 w-full border-collapse"
    >
      <thead>
        <tr class="bg-gray-200">
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
          <td>{{ globalExactTimes }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Download Button -->
    <button
      v-if="frequencies.length"
      @click="downloadFrequencies"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download frequencies.txt
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const frequencies = ref([]);
const warnings = ref([]);
const globalExactTimes = ref(0);

// Parse time string in "h:mm:ss AM/PM" or "hh:mm:ss" 24h format to seconds since midnight
function parseTimeToSeconds(timeStr) {
  const time = timeStr.trim();
  // Try to parse with Date object with "1970-01-01" prefix to ensure consistent parsing
  const date = new Date(`1970-01-01T${convertTo24Hour(time)}Z`);
  if (isNaN(date.getTime())) {
    warnings.value.push(`Invalid time format: ${timeStr}`);
    return null;
  }
  return date.getUTCHours() * 3600 + date.getUTCMinutes() * 60 + date.getUTCSeconds();
}

// Convert AM/PM time like "5:00:00 AM" to "05:00:00" 24-hour string
function convertTo24Hour(timeStr) {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return timeStr; // fallback

  let [_, h, m, s = "00", meridian] = match;
  h = parseInt(h, 10);
  m = parseInt(m, 10);
  s = parseInt(s, 10);

  if (meridian) {
    meridian = meridian.toUpperCase();
    if (meridian === "PM" && h !== 12) h += 12;
    if (meridian === "AM" && h === 12) h = 0;
  }
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Convert seconds since midnight to HH:MM:SS string
function secondsToHHMMSS(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((x) => String(x).padStart(2, "0")).join(":");
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    processCSV(e.target.result);
  };
  reader.readAsText(file);
}

function processCSV(csvText) {
  warnings.value = [];
  frequencies.value = [];

  const rows = csvText
    .trim()
    .split("\n")
    .map((line) => line.split(",").map((v) => v.trim()));

  const headers = rows.shift().map((h) => h.trim());
  const tripIdx = headers.indexOf("trip_id");
  const timeIdx = headers.indexOf("time");

  if (tripIdx === -1 || timeIdx === -1) {
    warnings.value.push("CSV must have 'trip_id' and 'time' columns");
    return;
  }

  const trips = {};
  for (const row of rows) {
    const trip_id = row[tripIdx];
    const time = row[timeIdx];
    if (!trip_id || !time) {
      warnings.value.push(`Skipping invalid row: ${row.join(",")}`);
      continue;
    }
    if (!trips[trip_id]) trips[trip_id] = [];
    const secs = parseTimeToSeconds(time);
    if (secs === null) continue;
    trips[trip_id].push(secs);
  }

  // Group times by trip_id and group consecutive times with same headway
  for (const trip_id in trips) {
    const times = trips[trip_id].sort((a, b) => a - b);
    if (times.length < 2) {
      warnings.value.push(`Trip ${trip_id} has less than 2 times, skipping`);
      continue;
    }

    let startIdx = 0;
    while (startIdx < times.length - 1) {
      const currentHeadway = times[startIdx + 1] - times[startIdx];
      let endIdx = startIdx + 1;

      // Extend the group while next headway is the same
      while (
        endIdx + 1 < times.length &&
        times[endIdx + 1] - times[endIdx] === currentHeadway
      ) {
        endIdx++;
      }

      frequencies.value.push({
        trip_id,
        start_time: secondsToHHMMSS(times[startIdx]),
        end_time: secondsToHHMMSS(times[endIdx]),
        headway_secs: currentHeadway,
        exact_times: globalExactTimes.value,
      });

      startIdx = endIdx;
    }
  }
}

// Update exact_times in all frequency rows when globalExactTimes changes
watch(globalExactTimes, (val) => {
  frequencies.value.forEach((row) => {
    row.exact_times = val;
  });
});

function downloadFrequencies() {
  const csvContent =
    "trip_id,start_time,end_time,headway_secs,exact_times\n" +
    frequencies.value
      .map(
        (r) =>
          `${r.trip_id},${r.start_time},${r.end_time},${r.headway_secs},${globalExactTimes.value}`
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
