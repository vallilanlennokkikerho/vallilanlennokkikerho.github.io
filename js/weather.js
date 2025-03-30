(function() {
    'use strict'; // Enforce stricter parsing and error handling

    // --- Constants ---
    const CACHE_KEY = 'windData';
    const CACHE_TIME_KEY = 'windDataTime';
    const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

    const API_SERVICE = 'WFS';
    const API_VERSION = '2.0.0';
    const API_REQUEST = 'GetFeature';
    const API_STORED_QUERY_ID = 'fmi::observations::weather::multipointcoverage';
    const API_FMISID = '151028'; // Helsinki Vuosaaren satama
    const API_PARAMETERS = 'windspeedms,winddirection';
    const API_BASE_URL = 'https://opendata.fmi.fi/wfs';

    const DOM_ELEMENT_IDS = {
        windData: 'wind-data',
        directionArrow: 'direction-arrow',
        arrowContainer: '.wind-arrow-container', // Note: This is a selector, not just ID
        loading: 'loading',
        error: 'error'
    };

    const WIND_SPEED_THRESHOLDS = {
        low: 4,
        medium: 6
    };

    const ARROW_COLORS = {
        low: '#28a745',    // Green
        medium: '#ffc107', // Yellow
        high: '#dc3545'    // Red
    };

    const DIRECTIONS = [
        { name: 'Pohjoinen', short: 'N', from: 348.75, to: 11.25 },
        { name: 'Pohjoiskoillinen', short: 'NNE', from: 11.25, to: 33.75 },
        { name: 'Koillinen', short: 'NE', from: 33.75, to: 56.25 },
        { name: 'Itäkoillinen', short: 'ENE', from: 56.25, to: 78.75 },
        { name: 'Itä', short: 'E', from: 78.75, to: 101.25 },
        { name: 'Itäkaakko', short: 'ESE', from: 101.25, to: 123.75 },
        { name: 'Kaakko', short: 'SE', from: 123.75, to: 146.25 },
        { name: 'Eteläkaakko', short: 'SSE', from: 146.25, to: 168.75 },
        { name: 'Etelä', short: 'S', from: 168.75, to: 191.25 },
        { name: 'Etelälounas', short: 'SSW', from: 191.25, to: 213.75 },
        { name: 'Lounas', short: 'SW', from: 213.75, to: 236.25 },
        { name: 'Länsilounas', short: 'WSW', from: 236.25, to: 258.75 },
        { name: 'Länsi', short: 'W', from: 258.75, to: 281.25 },
        { name: 'Länsiluode', short: 'WNW', from: 281.25, to: 303.75 },
        { name: 'Luode', short: 'NW', from: 303.75, to: 326.25 },
        { name: 'Pohjoisluode', short: 'NNW', from: 326.25, to: 348.75 }
    ];

    // --- Helper Functions ---

    function getCardinalDirection(degree) {
        degree = (degree + 360) % 360;
        if (degree >= DIRECTIONS[0].from || degree < DIRECTIONS[0].to) {
             return DIRECTIONS[0];
        }
        for (let i = 1; i < DIRECTIONS.length; i++) {
            const dir = DIRECTIONS[i];
            if (degree >= dir.from && degree < dir.to) {
                return dir;
            }
        }
        return DIRECTIONS[0];
    }

    function formatDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('fi-FI', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }

    function formatTimeRemaining(milliseconds) {
        if (milliseconds <= 0) return '0 sekuntia';
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return minutes > 0 ? `${minutes} minuuttia ${seconds} sekuntia` : `${seconds} sekuntia`;
    }

    // --- UI Update Functions ---

    function displayWindData(windSpeed, windDirection, source = 'live', timestamp = Date.now(), remainingTime = null) {
        const directionDeg = parseFloat(windDirection);
        const directionInfo = getCardinalDirection(directionDeg);
        const directionText = directionInfo ? directionInfo.name : 'Tuntematon';
        const formattedTime = formatDateTime(timestamp);
        let timeInfo = '';

        if (source === 'cache' && remainingTime !== null && remainingTime > 0) {
            const timeRemainingText = formatTimeRemaining(remainingTime);
            timeInfo = `<small style="color: #888">välimuistista (${formattedTime}), seuraava päivitys ${timeRemainingText}<br>tuulitiedon tarjoaa Ilmatieteenlaitos</small>`;
        } else if (source === 'live') {
             timeInfo = `<small style="color: #888">ajantasainen (${formattedTime})<br>tuulitiedon tarjoaa Ilmatieteenlaitos</small>`;
        } else { // Stale cache case
             timeInfo = `<small style="color: #cc8800">vanhentunut (${formattedTime}), yritetään päivittää...<br>tuulitiedon tarjoaa Ilmatieteenlaitos</small>`;
        }

        const windDataElement = document.getElementById(DOM_ELEMENT_IDS.windData);
        if (windDataElement) {
            windDataElement.innerHTML = `Tuulennopeus nyt: ${windSpeed} m/s<br>Tuulensuunta: ${windDirection}° (${directionText})<br>${timeInfo}`;
            windDataElement.style.display = 'block';
        }

        const arrow = document.getElementById(DOM_ELEMENT_IDS.directionArrow);
        const arrowContainer = document.querySelector(DOM_ELEMENT_IDS.arrowContainer);
        if (arrow && arrowContainer) {
            let arrowColor;
            const windSpeedNum = parseFloat(windSpeed);
            if (windSpeedNum < WIND_SPEED_THRESHOLDS.low) arrowColor = ARROW_COLORS.low;
            else if (windSpeedNum <= WIND_SPEED_THRESHOLDS.medium) arrowColor = ARROW_COLORS.medium;
            else arrowColor = ARROW_COLORS.high;
            arrow.style.fill = arrowColor;
            arrowContainer.style.setProperty('--wind-direction', `${(directionDeg + 180) % 360}deg`);
        }
    }

    function showLoading() {
        const el = document.getElementById(DOM_ELEMENT_IDS.loading);
        if (el) el.style.display = 'block';
    }

    function hideLoading() {
        const el = document.getElementById(DOM_ELEMENT_IDS.loading);
        if (el) el.style.display = 'none';
    }

     function showError(message) {
        const el = document.getElementById(DOM_ELEMENT_IDS.error);
        if (el) {
            el.textContent = message;
            el.style.display = 'block';
        }
    }

    function hideError() {
        const el = document.getElementById(DOM_ELEMENT_IDS.error);
        if (el) el.style.display = 'none';
    }

    // --- Data Handling Functions ---

    function getCachedData() {
        const cachedDataStr = localStorage.getItem(CACHE_KEY);
        const cachedTimeStr = localStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (cachedDataStr && cachedTimeStr) {
            const cachedTime = parseInt(cachedTimeStr);
            if (now - cachedTime < CACHE_DURATION_MS) {
                try {
                    const cachedData = JSON.parse(cachedDataStr);
                    // Ensure required properties exist
                    if (cachedData.hasOwnProperty('windSpeed') && cachedData.hasOwnProperty('windDirection')) {
                        const remainingTime = CACHE_DURATION_MS - (now - cachedTime);
                        return { ...cachedData, timestamp: cachedTime, remainingTime };
                    } else {
                         console.warn("Cached data missing required properties.");
                         localStorage.removeItem(CACHE_KEY); // Clear invalid cache
                         localStorage.removeItem(CACHE_TIME_KEY);
                    }
                } catch (e) {
                    console.error("Error parsing cached data:", e);
                    localStorage.removeItem(CACHE_KEY); // Clear corrupted cache
                    localStorage.removeItem(CACHE_TIME_KEY);
                }
            } else {
                 console.log("Cache expired.");
            }
        }
        return null; // No valid/fresh cache found
    }

    async function fetchApiData() {
        const now = new Date();
        const endtime = now.toISOString().split('.')[0] + 'Z';
        const starttime = new Date(now.getTime() - 60 * 60 * 1000).toISOString().split('.')[0] + 'Z'; // Last hour

        const params = new URLSearchParams({
            service: API_SERVICE, version: API_VERSION, request: API_REQUEST,
            storedquery_id: API_STORED_QUERY_ID, fmisid: API_FMISID,
            starttime: starttime, endtime: endtime, parameters: API_PARAMETERS
        });
        const url = `${API_BASE_URL}?${params.toString()}`;
        console.log(`Fetching FMI data from: ${url}`); // Log URL for debugging

        const response = await fetch(url);
        if (!response.ok) {
            // Attempt to get more specific error text if available
            let errorText = `Verkkovastaus ei ollut ok: ${response.status} ${response.statusText}`;
            try {
                const errorBody = await response.text();
                // Look for common XML error patterns if possible, otherwise use the raw text
                 const parser = new DOMParser();
                 const xmlDoc = parser.parseFromString(errorBody, "text/xml");
                 const exception = xmlDoc.getElementsByTagName("ows:ExceptionText")[0];
                 if (exception) {
                     errorText += ` - FMI: ${exception.textContent}`;
                 } else if (errorBody.length < 200) { // Show short error bodies
                     errorText += ` - Body: ${errorBody}`;
                 }
            } catch (e) {
                 console.warn("Could not parse error response body:", e);
            }
            throw new Error(errorText);
        }
        return await response.text(); // Return raw XML text
    }

    function parseWindDataXml(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        const exception = xmlDoc.getElementsByTagName("ows:ExceptionText")[0];
        if (exception) {
            throw new Error(`FMI API Error: ${exception.textContent}`);
        }

        const tupleList = xmlDoc.getElementsByTagName("gml:doubleOrNilReasonTupleList")[0];
        if (!tupleList) {
            // Check if it's a different type of valid response (e.g., empty feature collection)
            if (xmlDoc.getElementsByTagName("wfs:FeatureCollection").length > 0 && xmlDoc.getElementsByTagName("wfs:member").length === 0) {
                 console.warn("Received empty FeatureCollection from FMI, treating as no data.");
                 return []; // Return empty array, indicating no data points found
            }
            throw new Error('Tuulidataa (gml:doubleOrNilReasonTupleList) ei löytynyt vastauksesta');
        }

        const textContent = tupleList.textContent.trim();
        const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length === 0 && textContent.length > 0) {
             // Handle case where tupleList might contain something other than line breaks but no valid data
             console.warn("Tuple list content present but no valid lines found:", textContent);
             return [];
        }
         if (lines.length === 0) {
             console.warn("No data lines found in tuple list.");
             return []; // Return empty array
         }


        const recentLines = lines.slice(-3); // Get last 1-3 lines
        const dataPoints = recentLines.map(line => {
            const parts = line.split(/\s+/);
            if (parts.length >= 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
                 return { speed: parseFloat(parts[0]), direction: parseFloat(parts[1]) };
            } else {
                console.warn(`Ohitetaan virheellinen datarivi: ${line}`);
                return null;
            }
        }).filter(point => point !== null);

        // It's okay if dataPoints is empty here, the caller should handle it
        // if (dataPoints.length === 0) {
        //     throw new Error('Viimeisimmissä tiedoissa ei löytynyt kelvollisia tuulidata pisteitä');
        // }
        return dataPoints;
    }

    function calculateAverageWindData(dataPoints) {
         // Handle case with no valid data points
         if (!dataPoints || dataPoints.length === 0) {
             console.warn("Cannot calculate average: No valid data points provided.");
             return null; // Indicate failure to calculate
         }

        let weightedSpeedSum = 0;
        let weightedDirXSum = 0;
        let weightedDirYSum = 0;
        let totalWeight = 0;
        const weights = dataPoints.length === 1 ? [1] : (dataPoints.length === 2 ? [1, 2] : [1, 2, 3]);

        dataPoints.forEach((point, index) => {
            const weight = weights[index];
            weightedSpeedSum += point.speed * weight;
            const dirRad = point.direction * Math.PI / 180;
            weightedDirXSum += Math.cos(dirRad) * weight;
            weightedDirYSum += Math.sin(dirRad) * weight;
            totalWeight += weight;
        });

        // Avoid division by zero if totalWeight somehow ends up as 0 (shouldn't happen with current logic)
        if (totalWeight === 0) {
             console.error("Total weight is zero during average calculation.");
             return null;
        }


        const avgSpeed = (weightedSpeedSum / totalWeight).toFixed(1);
        const avgDirRad = Math.atan2(weightedDirYSum / totalWeight, weightedDirXSum / totalWeight);
        let avgDirection = (avgDirRad * 180 / Math.PI);
        avgDirection = ((avgDirection % 360) + 360) % 360; // Normalize 0-360
        avgDirection = avgDirection.toFixed(0); // Round

        return { windSpeed: avgSpeed, windDirection: avgDirection };
    }

    function updateCache(data) {
        // Only update cache if data is valid
        if (!data || !data.hasOwnProperty('windSpeed') || !data.hasOwnProperty('windDirection')) {
             console.warn("Attempted to update cache with invalid data:", data);
             return;
        }
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            console.log("Cache updated successfully.");
        } catch (e) {
            console.error("Error writing to localStorage:", e);
            // Consider clearing cache if quota exceeded
            if (e.name === 'QuotaExceededError') {
                 console.warn("LocalStorage quota exceeded. Clearing cache.");
                 localStorage.clear(); // Drastic, maybe clear only weather keys?
            }
        }
    }

    // --- Main Fetch Orchestration ---

    async function fetchWindData() {
        console.log("fetchWindData called");
        // 1. Try cache first
        const cached = getCachedData();
        if (cached) {
            console.log("Displaying data from cache.");
            displayWindData(cached.windSpeed, cached.windDirection, 'cache', cached.timestamp, cached.remainingTime);
            hideLoading(); // Ensure loading is hidden if cache is used
            return; // Done if cache is fresh
        }

        // 2. If cache is stale or missing, fetch from API
        console.log("Cache miss or expired. Fetching from API...");
        showLoading();
        hideError(); // Hide previous errors
        let fetchedData = null;
        const fetchTimestamp = Date.now(); // Record time before fetch

        try {
            const xmlString = await fetchApiData();
            const dataPoints = parseWindDataXml(xmlString);

            // Handle case where API returns data, but no valid points could be parsed
            if (dataPoints.length === 0) {
                 console.warn("API fetch successful, but no valid data points found/parsed.");
                 // Decide how to handle this - show error? Show stale?
                 // For now, let's show an error indicating no current data.
                 throw new Error("Tuoreita havaintoja ei saatavilla FMI:ltä tällä hetkellä.");
            }


            fetchedData = calculateAverageWindData(dataPoints);

            // Check if calculation failed
            if (!fetchedData) {
                 throw new Error("Keskiarvon laskenta epäonnistui.");
            }


            // 3. Display fresh data & update cache
            console.log("Displaying fresh data:", fetchedData);
            displayWindData(fetchedData.windSpeed, fetchedData.windDirection, 'live', fetchTimestamp);
            updateCache(fetchedData);

        } catch (error) {
            console.error('Virhe haettaessa tai käsiteltäessä tuulitietoja:', error);
            showError(`Tuulitiedon haku epäonnistui: ${error.message}`); // More user-friendly prefix

            // 4. Attempt to display stale data on error ONLY IF it exists
            const staleDataStr = localStorage.getItem(CACHE_KEY);
            const staleTimeStr = localStorage.getItem(CACHE_TIME_KEY);
            if (staleDataStr && staleTimeStr) {
                try {
                    const staleData = JSON.parse(staleDataStr);
                     if (staleData.hasOwnProperty('windSpeed') && staleData.hasOwnProperty('windDirection')) {
                        console.warn("Displaying potentially stale data due to fetch error.");
                        // Display stale data without hiding the error message
                        displayWindData(staleData.windSpeed, staleData.windDirection, 'cache', parseInt(staleTimeStr), -1); // Indicate stale
                     } else {
                         console.warn("Stale cached data is invalid.");
                     }
                } catch (parseError) {
                    console.error("Error parsing stale cached data:", parseError);
                    // Don't show an additional error, the main fetch error is already visible
                }
            } else {
                 console.log("No stale data available to display on error.");
                 // Ensure the main data display area is cleared or shows nothing if there's no stale data
                 const windDataElement = document.getElementById(DOM_ELEMENT_IDS.windData);
                 if (windDataElement) {
                     // Optionally clear it or leave the error message as the primary info
                     // windDataElement.innerHTML = '';
                     // windDataElement.style.display = 'none';
                 }
            }
        } finally {
            hideLoading(); // Ensure loading is hidden regardless of outcome
        }
    }

    // --- Initialisation ---
    // Add event listener to run fetchWindData when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', fetchWindData);

    // Optional: Refresh data periodically
    // setInterval(fetchWindData, CACHE_DURATION_MS + 1000); // Add a small buffer

})(); // End of IIFE