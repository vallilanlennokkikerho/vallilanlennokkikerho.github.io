(function() {
    'use strict'; // Tvinga striktare parsning och felhantering

    // --- Konstanter ---
    const CACHE_KEY = 'windData';
    const CACHE_TIME_KEY = 'windDataTime';
    const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minuter

    const API_SERVICE = 'WFS';
    const API_VERSION = '2.0.0';
    const API_REQUEST = 'GetFeature';
    const API_STORED_QUERY_ID = 'fmi::observations::weather::multipointcoverage';
    const API_FMISID = '151028'; // Helsingfors Vuosaari hamn
    const API_PARAMETERS = 'windspeedms,winddirection';
    const API_BASE_URL = 'https://opendata.fmi.fi/wfs';

    const DOM_ELEMENT_IDS = {
        windData: 'wind-data',
        directionArrow: 'direction-arrow',
        arrowContainer: '.wind-arrow-container', // Obs: Detta är en väljare, inte bara ett ID
        loading: 'loading',
        error: 'error'
    };

    const WIND_SPEED_THRESHOLDS = {
        low: 4,
        medium: 6
    };

    const ARROW_COLORS = {
        low: '#28a745',    // Grön
        medium: '#ffc107', // Gul
        high: '#dc3545'    // Röd
    };

    const DIRECTIONS = [
        { name: 'Norr', short: 'N', from: 348.75, to: 11.25 },
        { name: 'Nord-nordost', short: 'NNO', from: 11.25, to: 33.75 },
        { name: 'Nordost', short: 'NO', from: 33.75, to: 56.25 },
        { name: 'Öst-nordost', short: 'ÖNO', from: 56.25, to: 78.75 },
        { name: 'Öst', short: 'Ö', from: 78.75, to: 101.25 },
        { name: 'Öst-sydost', short: 'ÖSO', from: 101.25, to: 123.75 },
        { name: 'Sydost', short: 'SO', from: 123.75, to: 146.25 },
        { name: 'Syd-sydost', short: 'SSO', from: 146.25, to: 168.75 },
        { name: 'Syd', short: 'S', from: 168.75, to: 191.25 },
        { name: 'Syd-sydväst', short: 'SSV', from: 191.25, to: 213.75 },
        { name: 'Sydväst', short: 'SV', from: 213.75, to: 236.25 },
        { name: 'Väst-sydväst', short: 'VSV', from: 236.25, to: 258.75 },
        { name: 'Väst', short: 'V', from: 258.75, to: 281.25 },
        { name: 'Väst-nordväst', short: 'VNV', from: 281.25, to: 303.75 },
        { name: 'Nordväst', short: 'NV', from: 303.75, to: 326.25 },
        { name: 'Nord-nordväst', short: 'NNV', from: 326.25, to: 348.75 }
    ];

    // --- Hjälpfunktioner ---

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
        return date.toLocaleString('sv-SE', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }

    function formatTimeRemaining(milliseconds) {
        if (milliseconds <= 0) return '0 sekunder';
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return minutes > 0 ? `${minutes} minuter ${seconds} sekunder` : `${seconds} sekunder`;
    }

    // --- Funktioner för UI-uppdatering ---

    function displayWindData(windSpeed, windDirection, source = 'live', timestamp = Date.now(), remainingTime = null) {
        const directionDeg = parseFloat(windDirection);
        const directionInfo = getCardinalDirection(directionDeg);
        const directionText = directionInfo ? directionInfo.name : 'Okänd';
        const formattedTime = formatDateTime(timestamp);
        let timeInfo = '';

        if (source === 'cache' && remainingTime !== null && remainingTime > 0) {
            const timeRemainingText = formatTimeRemaining(remainingTime);
            timeInfo = `<small style="color: #888">från cache (${formattedTime}), nästa uppdatering om ${timeRemainingText}<br>vinddata tillhandahålls av Meteorologiska institutet</small>`;
        } else if (source === 'live') {
            timeInfo = `<small style="color: #888">uppdaterad (${formattedTime})<br>vinddata tillhandahålls av Meteorologiska institutet</small>`;
        } else { // Föråldrat cache-fall
            timeInfo = `<small style="color: #cc8800">föråldrad (${formattedTime}), försöker uppdatera...<br>vinddata tillhandahålls av Meteorologiska institutet</small>`;
        }

        const windDataElement = document.getElementById(DOM_ELEMENT_IDS.windData);
        if (windDataElement) {
            windDataElement.innerHTML = `Vindhastighet nu: ${windSpeed} m/s<br>Vindriktning: ${windDirection}° (${directionText})<br>${timeInfo}`;
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

    // --- Funktioner för datahantering ---

    function getCachedData() {
        const cachedDataStr = localStorage.getItem(CACHE_KEY);
        const cachedTimeStr = localStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (cachedDataStr && cachedTimeStr) {
            const cachedTime = parseInt(cachedTimeStr);
            if (now - cachedTime < CACHE_DURATION_MS) {
                try {
                    const cachedData = JSON.parse(cachedDataStr);
                    // Säkerställ att nödvändiga egenskaper finns
                    if (cachedData.hasOwnProperty('windSpeed') && cachedData.hasOwnProperty('windDirection')) {
                        const remainingTime = CACHE_DURATION_MS - (now - cachedTime);
                        return { ...cachedData, timestamp: cachedTime, remainingTime };
                    } else {
                        console.warn("Cachad data saknar nödvändiga egenskaper.");
                        localStorage.removeItem(CACHE_KEY); // Rensa ogiltig cache
                        localStorage.removeItem(CACHE_TIME_KEY);
                    }
                } catch (e) {
                    console.error("Fel vid parsning av cachad data:", e);
                    localStorage.removeItem(CACHE_KEY); // Rensa korrupt cache
                    localStorage.removeItem(CACHE_TIME_KEY);
                }
            } else {
                console.log("Cache har gått ut.");
            }
        }
        return null; // Ingen giltig/färsk cache hittades
    }

    async function fetchApiData() {
        const now = new Date();
        const endtime = now.toISOString().split('.')[0] + 'Z';
        const starttime = new Date(now.getTime() - 60 * 60 * 1000).toISOString().split('.')[0] + 'Z'; // Sista timmen

        const params = new URLSearchParams({
            service: API_SERVICE, version: API_VERSION, request: API_REQUEST,
            storedquery_id: API_STORED_QUERY_ID, fmisid: API_FMISID,
            starttime: starttime, endtime: endtime, parameters: API_PARAMETERS
        });
        const url = `${API_BASE_URL}?${params.toString()}`;
        console.log(`Hämtar FMI-data från: ${url}`); // Logga URL för felsökning

        const response = await fetch(url);
        if (!response.ok) {
            // Försök att få mer specifik feltext om tillgänglig
            let errorText = `Nätverkssvar var inte OK: ${response.status} ${response.statusText}`;
            try {
                const errorBody = await response.text();
                // Leta efter vanliga XML-felmönster om möjligt, annars använd råtexten
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(errorBody, "text/xml");
                const exception = xmlDoc.getElementsByTagName("ows:ExceptionText")[0];
                if (exception) {
                    errorText += ` - FMI: ${exception.textContent}`;
                } else if (errorBody.length < 200) { // Visa korta felmeddelanden
                    errorText += ` - Kropp: ${errorBody}`;
                }
            } catch (e) {
                console.warn("Kunde inte parsa felmeddelandets kropp:", e);
            }
            throw new Error(errorText);
        }
        return await response.text(); // Returnera rå XML-text
    }

    function parseWindDataXml(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        const exception = xmlDoc.getElementsByTagName("ows:ExceptionText")[0];
        if (exception) {
            throw new Error(`FMI API-fel: ${exception.textContent}`);
        }

        const tupleList = xmlDoc.getElementsByTagName("gml:doubleOrNilReasonTupleList")[0];
        if (!tupleList) {
            // Kontrollera om det är en annan typ av giltigt svar (t.ex. tom funktion-samling)
            if (xmlDoc.getElementsByTagName("wfs:FeatureCollection").length > 0 && xmlDoc.getElementsByTagName("wfs:member").length === 0) {
                console.warn("Mottog tom FeatureCollection från FMI, behandlas som ingen data.");
                return []; // Returnera tom array, indikerar att inga datapunkter hittades
            }
            throw new Error('Vinddata (gml:doubleOrNilReasonTupleList) hittades inte i svaret');
        }

        const textContent = tupleList.textContent.trim();
        const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length === 0 && textContent.length > 0) {
            // Hantera fall där tupleList kan innehålla något annat än radbrytningar men ingen giltig data
            console.warn("Tuple list-innehåll finns men inga giltiga rader hittades:", textContent);
            return [];
        }
        if (lines.length === 0) {
            console.warn("Inga datarader hittades i tuple list.");
            return []; // Returnera tom array
        }

        const recentLines = lines.slice(-3); // Hämta de sista 1-3 raderna
        const dataPoints = recentLines.map(line => {
            const parts = line.split(/\s+/);
            if (parts.length >= 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
                return { speed: parseFloat(parts[0]), direction: parseFloat(parts[1]) };
            } else {
                console.warn(`Hoppar över ogiltig datarad: ${line}`);
                return null;
            }
        }).filter(point => point !== null);

        return dataPoints;
    }

    function calculateAverageWindData(dataPoints) {
        // Hantera fall med inga giltiga datapunkter
        if (!dataPoints || dataPoints.length === 0) {
            console.warn("Kan inte beräkna medelvärde: Inga giltiga datapunkter tillhandahölls.");
            return null; // Indikera misslyckande att beräkna
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

        // Undvik division med noll om totalWeight på något sätt blir 0 (bör inte hända med nuvarande logik)
        if (totalWeight === 0) {
            console.error("Total vikt är noll under medelvärdesberäkning.");
            return null;
        }

        const avgSpeed = (weightedSpeedSum / totalWeight).toFixed(1);
        const avgDirRad = Math.atan2(weightedDirYSum / totalWeight, weightedDirXSum / totalWeight);
        let avgDirection = (avgDirRad * 180 / Math.PI);
        avgDirection = ((avgDirection % 360) + 360) % 360; // Normalisera 0-360
        avgDirection = avgDirection.toFixed(0); // Avrunda

        return { windSpeed: avgSpeed, windDirection: avgDirection };
    }

    function updateCache(data) {
        // Uppdatera cache endast om data är giltig
        if (!data || !data.hasOwnProperty('windSpeed') || !data.hasOwnProperty('windDirection')) {
            console.warn("Försökte uppdatera cache med ogiltig data:", data);
            return;
        }
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            console.log("Cache uppdaterades framgångsrikt.");
        } catch (e) {
            console.error("Fel vid skrivning till localStorage:", e);
            // Överväg att rensa cache om kvoten överskrids
            if (e.name === 'QuotaExceededError') {
                console.warn("LocalStorage-kvoten överskriden. Rensar cache.");
                localStorage.clear(); // Drastiskt, kanske bara rensa vädernycklar?
            }
        }
    }

    // --- Huvudsaklig hämtning och orkestrering ---

    async function fetchWindData() {
        console.log("fetchWindData anropades");
        // 1. Försök med cache först
        const cached = getCachedData();
        if (cached) {
            console.log("Visar data från cache.");
            displayWindData(cached.windSpeed, cached.windDirection, 'cache', cached.timestamp, cached.remainingTime);
            hideLoading(); // Säkerställ att laddning är dold om cache används
            return; // Klar om cache är färsk
        }

        // 2. Om cache är föråldrad eller saknas, hämta från API
        console.log("Cache miss eller föråldrad. Hämtar från API...");
        showLoading();
        hideError(); // Dölj tidigare fel
        let fetchedData = null;
        const fetchTimestamp = Date.now(); // Spara tid före hämtning

        try {
            const xmlString = await fetchApiData();
            const dataPoints = parseWindDataXml(xmlString);

            // Hantera fall där API returnerar data, men inga giltiga punkter kunde parsas
            if (dataPoints.length === 0) {
                console.warn("API-hämtning lyckades, men inga giltiga datapunkter hittades/parsades.");
                throw new Error("Inga färska observationer tillgängliga från FMI just nu.");
            }

            fetchedData = calculateAverageWindData(dataPoints);

            // Kontrollera om beräkning misslyckades
            if (!fetchedData) {
                throw new Error("Medelvärdesberäkning misslyckades.");
            }

            // 3. Visa färsk data & uppdatera cache
            console.log("Visar färsk data:", fetchedData);
            displayWindData(fetchedData.windSpeed, fetchedData.windDirection, 'live', fetchTimestamp);
            updateCache(fetchedData);

        } catch (error) {
            console.error('Fel vid hämtning eller bearbetning av vinddata:', error);
            showError(`Misslyckades att hämta vinddata: ${error.message}`);

            // 4. Försök att visa föråldrad data vid fel ENDAST OM den finns
            const staleDataStr = localStorage.getItem(CACHE_KEY);
            const staleTimeStr = localStorage.getItem(CACHE_TIME_KEY);
            if (staleDataStr && staleTimeStr) {
                try {
                    const staleData = JSON.parse(staleDataStr);
                    if (staleData.hasOwnProperty('windSpeed') && staleData.hasOwnProperty('windDirection')) {
                        console.warn("Visar potentiellt föråldrad data på grund av hämtfel.");
                        displayWindData(staleData.windSpeed, staleData.windDirection, 'cache', parseInt(staleTimeStr), -1); // Indikera föråldrad
                    } else {
                        console.warn("Föråldrad cachad data är ogiltig.");
                    }
                } catch (parseError) {
                    console.error("Fel vid parsning av föråldrad cachad data:", parseError);
                }
            } else {
                console.log("Ingen föråldrad data tillgänglig att visa vid fel.");
                const windDataElement = document.getElementById(DOM_ELEMENT_IDS.windData);
                if (windDataElement) {
                    // Valfritt: Rensa det eller låt felmeddelandet vara primär information
                }
            }
        } finally {
            hideLoading(); // Säkerställ att laddning är dold oavsett utfall
        }
    }

    // --- Initialisering ---
    // Lägg till händelselyssnare för att köra fetchWindData när DOM är helt laddad
    document.addEventListener('DOMContentLoaded', fetchWindData);

    // Valfritt: Uppdatera data periodiskt
    // setInterval(fetchWindData, CACHE_DURATION_MS + 1000); // Lägg till en liten buffert

})();