import React, { useState, useMemo } from 'react';
import { Upload, Search, Clock, MapPin, Download, X, ChevronUp, ChevronDown, Plus, Trash2, Map } from 'lucide-react';

const GTFSStopTimesGenerator = () => {
  // State for stops
  const [allStops, setAllStops] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [filteredStops, setFilteredStops] = useState([]);
  const [stopsFileName, setStopsFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for trip configuration
  const [tripId, setTripId] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [totalDuration, setTotalDuration] = useState(120);
  const [timeMode, setTimeMode] = useState('even'); // 'even' or 'custom'
  const [generatedStopTimes, setGeneratedStopTimes] = useState([]);
  
  // State for shapes
  const [allShapes, setAllShapes] = useState([]);
  const [shapesFileName, setShapesFileName] = useState('');
  const [uniqueShapeIds, setUniqueShapeIds] = useState([]);
  const [filteredShapeIds, setFilteredShapeIds] = useState([]);
  const [shapeSearchQuery, setShapeSearchQuery] = useState('');
  const [selectedShapeId, setSelectedShapeId] = useState('');
  const [selectedShapePoints, setSelectedShapePoints] = useState([]);
  const [newShapeId, setNewShapeId] = useState('');
  const [generatedShapesData, setGeneratedShapesData] = useState([]);

  // Computed values
  const totalCalculatedTime = useMemo(() => {
    if (timeMode !== 'custom') return 0;
    return selectedStops.reduce((sum, stop) => sum + (stop.timeGapAfter || 0), 0);
  }, [selectedStops, timeMode]);

  // Helper function to parse CSV line
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  // Handle stops file upload
  const handleStopsFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setStopsFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      parseStopsFile(e.target.result);
    };
    reader.readAsText(file);
  };

  // Parse stops.txt file
  const parseStopsFile = (content) => {
    const lines = content.trim().split('\n');
    
    if (lines.length < 2) {
      alert("Invalid stops.txt file");
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    
    const stopIdIndex = headers.indexOf('stop_id');
    const stopNameIndex = headers.indexOf('stop_name');
    const stopLatIndex = headers.indexOf('stop_lat');
    const stopLonIndex = headers.indexOf('stop_lon');

    if (stopIdIndex === -1 || stopNameIndex === -1) {
      alert("stops.txt must contain stop_id and stop_name columns");
      return;
    }

    const stops = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = parseCSVLine(line);
      
      stops.push({
        stop_id: parts[stopIdIndex]?.trim() || '',
        stop_name: parts[stopNameIndex]?.trim() || '',
        stop_lat: parts[stopLatIndex]?.trim() || '',
        stop_lon: parts[stopLonIndex]?.trim() || ''
      });
    }
    
    setAllStops(stops);
  };

  // Handle shapes file upload
  const handleShapesFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setShapesFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      parseShapesFile(e.target.result);
    };
    reader.readAsText(file);
  };

  // Parse shapes.txt file
  const parseShapesFile = (content) => {
    const lines = content.trim().split('\n');
    
    if (lines.length < 2) {
      alert("Invalid shapes.txt file");
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    
    const shapeIdIndex = headers.indexOf('shape_id');
    const shapePtLatIndex = headers.indexOf('shape_pt_lat');
    const shapePtLonIndex = headers.indexOf('shape_pt_lon');
    const shapePtSequenceIndex = headers.indexOf('shape_pt_sequence');
    const shapeDistTraveledIndex = headers.indexOf('shape_dist_traveled');

    if (shapeIdIndex === -1 || shapePtLatIndex === -1 || shapePtLonIndex === -1 || shapePtSequenceIndex === -1) {
      alert("shapes.txt must contain shape_id, shape_pt_lat, shape_pt_lon, and shape_pt_sequence columns");
      return;
    }

    const shapes = [];
    const shapeIdsSet = new Set();
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = parseCSVLine(line);
      
      const shapePoint = {
        shape_id: parts[shapeIdIndex]?.trim() || '',
        shape_pt_lat: parts[shapePtLatIndex]?.trim() || '',
        shape_pt_lon: parts[shapePtLonIndex]?.trim() || '',
        shape_pt_sequence: parts[shapePtSequenceIndex]?.trim() || '',
        shape_dist_traveled: shapeDistTraveledIndex !== -1 ? parts[shapeDistTraveledIndex]?.trim() || '' : ''
      };
      
      shapes.push(shapePoint);
      shapeIdsSet.add(shapePoint.shape_id);
    }

    setAllShapes(shapes);
    setUniqueShapeIds(Array.from(shapeIdsSet).sort());
  };

  // Filter stops based on search
  const filterStops = (query) => {
    setSearchQuery(query);
    
    if (!query) {
      setFilteredStops([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = allStops
      .filter(stop => 
        stop.stop_name.toLowerCase().includes(q) ||
        stop.stop_id.toLowerCase().includes(q)
      )
      .filter(stop => 
        !selectedStops.some(selected => selected.stop_id === stop.stop_id)
      )
      .slice(0, 20);
    
    setFilteredStops(filtered);
  };

  // Filter shapes based on search
  const filterShapes = (query) => {
    setShapeSearchQuery(query);
    
    if (!query) {
      setFilteredShapeIds([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = uniqueShapeIds
      .filter(shapeId => shapeId.toLowerCase().includes(q))
      .slice(0, 20);
    
    setFilteredShapeIds(filtered);
  };

  // Select a shape ID
  const selectShapeId = (shapeId) => {
    setSelectedShapeId(shapeId);
    const points = allShapes
      .filter(point => point.shape_id === shapeId)
      .sort((a, b) => parseInt(a.shape_pt_sequence) - parseInt(b.shape_pt_sequence));
    
    setSelectedShapePoints(points);
    setShapeSearchQuery('');
    setFilteredShapeIds([]);
    setNewShapeId('');
    setGeneratedShapesData([]);
  };

  // Clear selected shape
  const clearSelectedShape = () => {
    setSelectedShapeId('');
    setSelectedShapePoints([]);
    setNewShapeId('');
    setGeneratedShapesData([]);
  };

  // Add stop to selection
  const addStop = (stop) => {
    setSelectedStops([...selectedStops, { ...stop, timeGapAfter: 0 }]);
    setSearchQuery('');
    setFilteredStops([]);
    setGeneratedStopTimes([]);
  };

  // Remove stop from selection
  const removeStop = (index) => {
    const newStops = [...selectedStops];
    newStops.splice(index, 1);
    setSelectedStops(newStops);
    setGeneratedStopTimes([]);
  };

  // Clear all stops
  const clearAllStops = () => {
    setSelectedStops([]);
    setGeneratedStopTimes([]);
  };

  // Move stop up
  const moveUp = (index) => {
    if (index === 0) return;
    const newStops = [...selectedStops];
    [newStops[index], newStops[index - 1]] = [newStops[index - 1], newStops[index]];
    setSelectedStops(newStops);
    setGeneratedStopTimes([]);
  };

  // Move stop down
  const moveDown = (index) => {
    if (index === selectedStops.length - 1) return;
    const newStops = [...selectedStops];
    [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    setSelectedStops(newStops);
    setGeneratedStopTimes([]);
  };

  // Update time gap for a stop
  const updateTimeGap = (index, value) => {
    const newStops = [...selectedStops];
    newStops[index].timeGapAfter = parseFloat(value) || 0;
    setSelectedStops(newStops);
  };

  // Generate stop times
  const generateStopTimes = () => {
    if (!tripId || !startTime || selectedStops.length === 0) {
      alert("Please fill in all required fields and select at least one stop");
      return;
    }

    if (timeMode === "even" && !totalDuration) {
      alert("Please enter total trip duration");
      return;
    }

    const stopTimes = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    let currentMinutes = startHour * 60 + startMinute;

    if (timeMode === "even") {
      const timeInterval = selectedStops.length > 1 
        ? totalDuration / (selectedStops.length - 1)
        : 0;

      selectedStops.forEach((stop, index) => {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = Math.floor(currentMinutes % 60);
        const seconds = Math.floor((currentMinutes % 1) * 60);
        
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        stopTimes.push({
          trip_id: tripId,
          arrival_time: timeString,
          departure_time: timeString,
          stop_id: stop.stop_id,
          stop_name: stop.stop_name,
          stop_sequence: index,
          pickup_type: 0,
          drop_off_type: 0,
          timepoint: 0
        });

        currentMinutes += timeInterval;
      });
    } else {
      selectedStops.forEach((stop, index) => {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = Math.floor(currentMinutes % 60);
        const seconds = 0;
        
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        stopTimes.push({
          trip_id: tripId,
          arrival_time: timeString,
          departure_time: timeString,
          stop_id: stop.stop_id,
          stop_name: stop.stop_name,
          stop_sequence: index,
          pickup_type: 0,
          drop_off_type: 0,
          timepoint: 0
        });

        currentMinutes += stop.timeGapAfter || 0;
      });
    }

    setGeneratedStopTimes(stopTimes);

    // Generate shapes data if shape is selected
    if (selectedShapeId && selectedShapePoints.length > 0) {
      const finalShapeId = newShapeId || selectedShapeId;
      
      const shapesData = selectedShapePoints.map(point => ({
        shape_id: finalShapeId,
        shape_pt_lat: point.shape_pt_lat,
        shape_pt_lon: point.shape_pt_lon,
        shape_pt_sequence: point.shape_pt_sequence,
        shape_dist_traveled: point.shape_dist_traveled
      }));
      
      setGeneratedShapesData(shapesData);
    }
  };

  // Download stop times
  const downloadStopTimes = () => {
    if (generatedStopTimes.length === 0) return;

    const csvContent =
      "trip_id,arrival_time,departure_time,stop_id,stop_sequence,pickup_type,drop_off_type,timepoint\n" +
      generatedStopTimes
        .map(st => `${st.trip_id},${st.arrival_time},${st.departure_time},${st.stop_id},${st.stop_sequence},${st.pickup_type},${st.drop_off_type},${st.timepoint}`)
        .join("\n");

    downloadFile(csvContent, `stop_times_${tripId.replace(/\//g, '_')}.txt`);
  };

  // Download shapes
  const downloadShapes = () => {
    if (generatedShapesData.length === 0) return;

    const finalShapeId = newShapeId || selectedShapeId;
    const csvContent =
      "shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled\n" +
      generatedShapesData
        .map(sp => `${sp.shape_id},${sp.shape_pt_lat},${sp.shape_pt_lon},${sp.shape_pt_sequence},${sp.shape_dist_traveled}`)
        .join("\n");

    downloadFile(csvContent, `shapes_${finalShapeId.replace(/\//g, '_')}.txt`);
  };

  // Download file helper
  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ⏱️ GTFS Stop Times Generator
              </h1>
              <p className="text-gray-600">
                Upload stops.txt and generate stop_times.txt with automatic or custom time calculations
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Upload stops.txt */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. Upload stops.txt File
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleStopsFile}
              id="stopsFileInput"
              className="hidden"
            />
            <label
              htmlFor="stopsFileInput"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-16 h-16 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-700 mb-1">
                Click to upload stops.txt
              </span>
              <span className="text-sm text-gray-500">
                CSV format with stop_id, stop_name, stop_lat, stop_lon
              </span>
            </label>
          </div>
          
          {stopsFileName && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-green-800 font-medium">{stopsFileName}</span>
                  <span className="ml-3 text-sm text-green-600">({allStops.length} stops loaded)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 1b: Upload shapes.txt */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1b. Upload shapes.txt File (Optional)
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleShapesFile}
              id="shapesFileInput"
              className="hidden"
            />
            <label
              htmlFor="shapesFileInput"
              className="cursor-pointer flex flex-col items-center"
            >
              <Map className="w-16 h-16 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-700 mb-1">
                Click to upload shapes.txt
              </span>
              <span className="text-sm text-gray-500">
                CSV format with shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence
              </span>
            </label>
          </div>
          
          {shapesFileName && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-blue-800 font-medium">{shapesFileName}</span>
                  <span className="ml-3 text-sm text-blue-600">({uniqueShapeIds.length} unique shape IDs)</span>
                </div>
              </div>
            </div>
          )}

          {/* Shape ID Search and Selection */}
          {uniqueShapeIds.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search and Select Shape ID
              </label>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={shapeSearchQuery}
                  onChange={(e) => filterShapes(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type to search shape IDs..."
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              </div>

              {/* Shape ID Search Results */}
              {shapeSearchQuery && filteredShapeIds.length > 0 && (
                <div className="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredShapeIds.map((shapeId) => (
                    <div
                      key={shapeId}
                      onClick={() => selectShapeId(shapeId)}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-900">{shapeId}</div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Shape Info */}
              {selectedShapeId && (
                <div className="p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-1">Selected Shape ID</h4>
                      <p className="text-blue-800 font-mono">{selectedShapeId}</p>
                      <p className="text-sm text-blue-700 mt-1">{selectedShapePoints.length} shape points loaded</p>
                      
                      {/* New Shape ID Input */}
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          New Shape ID (optional - to create modified shape)
                        </label>
                        <input
                          type="text"
                          value={newShapeId}
                          onChange={(e) => setNewShapeId(e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          placeholder="Enter new shape ID or leave blank to use original"
                        />
                      </div>
                    </div>
                    <button
                      onClick={clearSelectedShape}
                      className="ml-4 text-blue-700 hover:text-blue-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Configure Trip */}
        {allStops.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              2. Configure Trip Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip ID
                </label>
                <input
                  type="text"
                  value={tripId}
                  onChange={(e) => setTripId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., WP_N_9/1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Time Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Time Calculation Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setTimeMode('even')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    timeMode === 'even' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        timeMode === 'even' ? 'border-purple-500' : 'border-gray-300'
                      }`}>
                        {timeMode === 'even' && <div className="w-3 h-3 rounded-full bg-purple-500"></div>}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">Even Distribution</h3>
                      <p className="text-sm text-gray-600">
                        Specify total trip duration and distribute time evenly across all stops
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setTimeMode('custom')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    timeMode === 'custom' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        timeMode === 'custom' ? 'border-purple-500' : 'border-gray-300'
                      }`}>
                        {timeMode === 'custom' && <div className="w-3 h-3 rounded-full bg-purple-500"></div>}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">Custom Time Gaps</h3>
                      <p className="text-sm text-gray-600">
                        Set individual time gaps (in minutes) between each stop
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Even Distribution Mode */}
            {timeMode === 'even' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Trip Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={totalDuration}
                    onChange={(e) => setTotalDuration(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 120"
                    min="1"
                  />
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                    <div className="flex-1">
                      <p className="text-blue-700 text-sm mb-2">
                        <strong>How it works:</strong> The total trip duration will be divided evenly across all selected stops.
                      </p>
                      <p className="text-blue-600 text-xs">
                        Example: 5 stops with 120 min = First stop at start time, then +30 min, +60 min, +90 min, +120 min
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Time Gaps Mode */}
            {timeMode === 'custom' && (
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  <div className="flex-1">
                    <p className="text-blue-700 text-sm mb-2">
                      <strong>How it works:</strong> After selecting stops, you can specify the time gap (in minutes) between each stop.
                    </p>
                    <p className="text-blue-600 text-xs">
                      Example: Stop 1 → 15 min → Stop 2 → 40 min → Stop 3 → 25 min → Stop 4
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Search and Select Stops */}
        {allStops.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              3. Search and Add Stops for This Trip
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Stop Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => filterStops(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Type to search stops..."
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery && filteredStops.length > 0 && (
              <div className="mb-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredStops.map((stop) => (
                  <div
                    key={stop.stop_id}
                    onClick={() => addStop(stop)}
                    className="p-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">{stop.stop_name}</div>
                        <div className="text-sm text-gray-500">{stop.stop_id}</div>
                      </div>
                      <Plus className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && filteredStops.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No stops found matching "{searchQuery}"
              </div>
            )}

            {/* Selected Stops */}
            {selectedStops.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Selected Stops ({selectedStops.length})
                    {timeMode === 'custom' && totalCalculatedTime > 0 && (
                      <span className="text-sm font-normal text-purple-600 ml-2">
                        Total: {totalCalculatedTime} minutes
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={clearAllStops}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-2">
                  {selectedStops.map((stop, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{stop.stop_name}</div>
                          <div className="text-sm text-gray-500">{stop.stop_id}</div>
                        </div>
                      </div>
                      
                      {/* Custom Time Gap Input */}
                      {timeMode === 'custom' && index < selectedStops.length - 1 && (
                        <div className="flex items-center space-x-2 mr-4">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            value={stop.timeGapAfter}
                            onChange={(e) => updateTimeGap(index, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="min"
                            min="0"
                          />
                          <span className="text-xs text-gray-500">min</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                          </svg>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className={`p-1 rounded ${
                            index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === selectedStops.length - 1}
                          className={`p-1 rounded ${
                            index === selectedStops.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => removeStop(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedStops.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No stops selected. Search and add stops above.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Generate and Preview */}
        {selectedStops.length > 0 && tripId && startTime && (timeMode === 'custom' || totalDuration) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                4. Preview and Generate
              </h2>
              <button
                onClick={generateStopTimes}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Generate Stop Times</span>
              </button>
            </div>

            {generatedStopTimes.length > 0 && (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-purple-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Seq</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trip ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Arrival Time</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Departure Time</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stop ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stop Name</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {generatedStopTimes.map((stopTime, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{stopTime.stop_sequence}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{stopTime.trip_id}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 font-mono">{stopTime.arrival_time}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 font-mono">{stopTime.departure_time}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{stopTime.stop_id}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{stopTime.stop_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={downloadStopTimes}
                    className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Download className="w-6 h-6" />
                    <span>Download stop_times.txt</span>
                  </button>

                  {selectedShapeId && generatedShapesData.length > 0 && (
                    <button
                      onClick={downloadShapes}
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Download className="w-6 h-6" />
                      <span>Download shapes.txt</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {allStops.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Upload className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No stops.txt file uploaded yet
            </h3>
            <p className="text-gray-500">
              Upload a stops.txt file to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GTFSStopTimesGenerator;
