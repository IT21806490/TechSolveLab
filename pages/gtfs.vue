<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="container mx-auto max-w-4xl">
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-start"> 
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              📊 GTFS Frequencies Generator
            </h1>
            <p class="text-gray-600">
              Upload your CSV file with trip_id and time columns to generate GTFS frequencies.txt
            </p>
          </div>
          
          <a
            href="/gtfs2"
            class="
              mt-1 ml-4 flex-shrink-0
              bg-gradient-to-r from-blue-600 to-indigo-600
              text-white
              px-6 py-3
              rounded-lg
              font-semibold
              hover:from-blue-700 hover:to-indigo-700
              transition-all
              shadow-md hover:shadow-lg
              flex items-center justify-center space-x-2
              focus:outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            "
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>GTFS Shapes & Stops Generator</span>
          </a>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          1. Upload CSV File
        </h2>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <div class="flex-1">
              <h4 class="text-blue-800 font-semibold mb-1">Required CSV Format</h4>
              <p class="text-blue-700 text-sm mb-2">
                Your CSV file must contain these two columns:
              </p>
              <div class="bg-white rounded p-2 font-mono text-sm border border-blue-200">
                <div class="text-blue-900"><strong>trip_id</strong>, <strong>time</strong></div>
                <div class="text-gray-600 text-xs mt-1">Example: route_1_001, 08:00:00</div>
              </div>
              <p class="text-blue-700 text-xs mt-2">
                Time format: HH:MM:SS (24-hour) or H:MM:SS AM/PM (12-hour)
              </p>
            </div>
          </div>
        </div>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept=".csv"
            @change="handleFile"
            id="fileInput"
            class="hidden"
          />
          <label
            for="fileInput"
            class="cursor-pointer flex flex-col items-center"
          >
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span class="text-lg font-medium text-gray-700 mb-1">
              Click to upload or drag and drop
            </span>
            <span class="text-sm text-gray-500">
              CSV file with trip_id and time columns
            </span>
          </label>
        </div>
        
        <div v-if="fileName" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-green-800 font-medium">{{ fileName }}</span>
        </div>
      </div>

      <div v-if="frequencies.length" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          2. Configure exact_times
        </h2>
        <div class="flex items-center space-x-4">
          <label class="text-gray-700 font-medium">
            Set exact_times value for all rows:
          </label>
          <div class="flex items-center space-x-2">
            <button
              @click="globalExactTimes = 0"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                globalExactTimes === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              0 (Frequency-based)
            </button>
            <button
              @click="globalExactTimes = 1"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                globalExactTimes === 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              1 (Schedule-based)
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-3">
          <strong>0:</strong> Trips are not exactly scheduled (frequency-based service) |
          <strong>1:</strong> Trips are exactly scheduled (timetable-based service)
        </p>
      </div>

      <div v-if="warnings.length" class="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-orange-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-orange-800 font-semibold mb-2">Warnings</h3>
            <ul class="space-y-1">
              <li v-for="(w, i) in warnings" :key="i" class="text-orange-700 text-sm">
                • {{ w }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="frequencies.length" class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          3. Review Generated Frequencies
        </h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="text-3xl font-bold text-blue-600">{{ frequencies.length }}</div>
            <div class="text-sm text-gray-600">Frequency entries</div>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <div class="text-3xl font-bold text-green-600">{{ uniqueTrips }}</div>
            <div class="text-sm text-gray-600">Unique trips</div>
          </div>
        </div>

        <div class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Trip ID
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Start Time
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  End Time
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Headway (sec)
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Exact Times
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="(row, i) in frequencies" 
                :key="i" 
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  {{ row.trip_id }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ row.start_time }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ row.end_time }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ row.headway_secs }}
                  <span class="text-xs text-gray-500">({{ formatHeadway(row.headway_secs) }})</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ globalExactTimes }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="frequencies.length" class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          4. Download Result
        </h2>
        <button
          @click="downloadFrequencies"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          <span>Download frequencies.txt</span>
        </button>
      </div>

      <div v-if="!frequencies.length && !warnings.length" class="bg-white rounded-lg shadow-lg p-12 text-center">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          No file uploaded yet
        </h3>
        <p class="text-gray-500">
          Upload a CSV file to get started
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const frequencies = ref([]);
const warnings = ref([]);
const globalExactTimes = ref(0);
const fileName = ref("");

const uniqueTrips = computed(() => {
  const trips = new Set(frequencies.value.map(f => f.trip_id));
  return trips.size;
});

// Format headway in minutes and seconds
function formatHeadway(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m`;
  return `${secs}s`;
}

// Parse time string in "h:mm:ss AM/PM" or "hh:mm:ss" 24h format to seconds since midnight
function parseTimeToSeconds(timeStr) {
  const time = timeStr.trim();
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
  if (!match) return timeStr;

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

// Convert seconds since midnight to HH:MM:SS string (24-hour format)
function secondsToHHMMSS(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((x) => String(x).padStart(2, "0")).join(":");
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  fileName.value = file.name;
  
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

  // Merge consecutive times with same headway
  for (const trip_id in trips) {
    const times = trips[trip_id].sort((a, b) => a - b);
    if (times.length < 2) {
      warnings.value.push(`Trip ${trip_id} has less than 2 times, skipping`);
      continue;
    }

    let startIdx = 0;
    
    while (startIdx < times.length - 1) {
      let endIdx = startIdx + 1;
      let currentHeadway = times[endIdx] - times[startIdx];

      // Merge intervals while headway is the same
      while (
        endIdx + 1 < times.length &&
        times[endIdx + 1] - times[endIdx] === currentHeadway
      ) {
        endIdx++;
      }

      // Create a frequency record for the merged times
      frequencies.value.push({
        trip_id,
        start_time: secondsToHHMMSS(times[startIdx]),
        end_time: secondsToHHMMSS(times[endIdx]),
        headway_secs: currentHeadway,
        exact_times: globalExactTimes.value,
      });

      // Move to the next unmerged time
      startIdx = endIdx + 1;
    }

    // Always add wrap-around entry from last time to first time of next day
    const lastTime = times[times.length - 1];
    const firstTime = times[0];
    const nextDayFirstTime = firstTime + 86400; // Add 24 hours
    const wrapHeadway = nextDayFirstTime - lastTime;

    frequencies.value.push({
      trip_id,
      start_time: secondsToHHMMSS(lastTime),
      end_time: secondsToHHMMSS(nextDayFirstTime),
      headway_secs: wrapHeadway,
      exact_times: globalExactTimes.value,
    });
  }
}

// Update exact_times when globalExactTimes changes
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
/* Additional custom styles if needed */
</style>
