<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">GTFS Frequencies Generator</h1>

    <!-- File Upload -->
    <input
      type="file"
      accept=".csv"
      @change="handleFile"
      class="mb-4 p-2 border rounded"
    />

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
    <div v-if="warnings.length" class="mb-4">
      <h3 class="text-lg font-semibold text-orange-600">Warnings:</h3>
      <ul class="list-disc list-inside">
        <li v-for="(w, i) in warnings" :key="i" class="text-orange-600">
          {{ w }}
        </li>
      </ul>
    </div>

    <!-- Frequencies Table -->
    <div v-if="frequencies.length" class="overflow-x-auto">
      <table class="table-auto border border-gray-300 w-full text-left">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2 border">trip_id</th>
            <th class="px-4 py-2 border">start_time</th>
            <th class="px-4 py-2 border">end_time</th>
            <th class="px-4 py-2 border">headway_secs</th>
            <th class="px-4 py-2 border">exact_times</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in frequencies" :key="i">
            <td class="px-4 py-2 border">{{ row.trip_id }}</td>
            <td class="px-4 py-2 border">{{ row.start_time }}</td>
            <td class="px-4 py-2 border">{{ row.end_time }}</td>
            <td class="px-4 py-2 border">{{ row.headway_secs }}</td>
            <td class="px-4 py-2 border">{{ globalExactTimes }}</td>
          </tr>
        </tbody>
      </table>
    </div>

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

// Watch globalExactTimes and update all rows if needed
watch(globalExactTimes, (val) => {
  frequencies.value.forEach((row) => {
    row.exact_times = val;
  });
});

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    processCSV(e.target.result);
  };
  reader.readAsText(file);
}

// Convert time string (like 5.00 or 5:12) to seconds
function timeToSeconds(timeStr) {
  let h, m;
  if (timeStr.includes(".")) {
    [h, m] = timeStr.split(".").map(Number);
  } else if (timeStr.includes(":")) {
    [h, m] = timeStr.split(":").map(Number);
  } else {
    h = Number(timeStr);
    m = 0;
  }
  return h * 3600 + m * 60;
}

// Convert seconds to HH:MM:SS
function secondsToTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((x) => String(x).padStart(2, "0")).join(":");
}

function processCSV(csvText) {
  warnings.value = [];
  frequencies.value = [];

  const rows = csvText
    .trim()
    .split("\n")
    .map((line) => line.split(",").map((v) => v.trim()));

  const headers = rows.shift();
  const tripIdx = headers.indexOf("trip_id");
  const timeIdx = headers.indexOf("time");

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

    // Create frequency rows
    for (let i = 1; i < times.length; i++) {
      frequencies.value.push({
        trip_id,
        start_time: secondsToTime(times[i - 1]),
        end_time: secondsToTime(times[i]),
        headway_secs: times[i] - times[i - 1],
        exact_times: globalExactTimes.value,
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
/* Tailwind CSS is already used via classes */
</style>
