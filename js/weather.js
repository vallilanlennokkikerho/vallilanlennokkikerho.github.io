// Function to get cardinal direction from degrees
function getCardinalDirection(degree) {
    const directions = [
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

    degree = (degree + 360) % 360;

    for (let dir of directions) {
        if (degree >= dir.from && degree < dir.to) {
            return dir;
        }
    }

    return directions[0];
}

// Function to format date and time
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('fi-FI', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

// Function to format remaining time
function formatTimeRemaining(milliseconds) {
    if (milliseconds <= 0) {
        return '0 sekuntia';
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
        return `${minutes} minuuttia ${seconds} sekuntia`;
    } else {
        return `${seconds} sekuntia`;
    }
}

// Function to display wind data
function displayWindData(windSpeed, windDirection, source = 'live', timestamp = Date.now(), remainingTime = null) {
    const directionDeg = parseFloat(windDirection);
    const directionText = getCardinalDirection(directionDeg).name;
    
    const formattedTime = formatDateTime(timestamp);
    let timeInfo = '';
    
    // Only show source and countdown for cached data
    if (source === 'cache' && remainingTime !== null) {
        const timeRemainingText = formatTimeRemaining(remainingTime);
        timeInfo = `<small style="color: #888">
            välimuistista (${formattedTime}), seuraava päivitys ${timeRemainingText} 
        <br>tuulitiedon tarjoaa Ilmatieteenlaitos</small>`;
    }
    
    document.getElementById('wind-data').innerHTML = `
        Tuulennopeus nyt: ${windSpeed} m/s<br>
        Tuulensuunta: ${windDirection}° (${directionText})<br>
        ${timeInfo}
    `;

    const arrow = document.getElementById('direction-arrow');
    let arrowColor;
    const windSpeedNum = parseFloat(windSpeed);
    if (windSpeedNum < 4) {
        arrowColor = '#28a745';
    } else if (windSpeedNum <= 6) {
        arrowColor = '#ffc107';
    } else {
        arrowColor = '#dc3545';
    }
    
    arrow.style.fill = arrowColor;
    document.querySelector('.wind-arrow-container').style.setProperty('--wind-direction', `${(directionDeg + 180) % 360}deg`);
    
    document.getElementById('wind-data').style.display = 'block';
}

// Function to fetch wind data
async function fetchWindData() {
    const cacheKey = 'windData';
    const cacheTimeKey = 'windDataTime';
    const cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);
    const now = new Date().getTime();

    // Check if there's fresh data in cache
    if (cachedData && cachedTime && (now - parseInt(cachedTime) < cacheDuration)) {
        const { windSpeed, windDirection } = JSON.parse(cachedData);
        const remainingTime = cacheDuration - (now - parseInt(cachedTime));
        displayWindData(windSpeed, windDirection, 'cache', parseInt(cachedTime), remainingTime);
        document.getElementById('loading').style.display = 'none';
    } else {
        // Fetch new data from API
        try {
            const now = new Date();
            const endtime = now.toISOString().split('.')[0] + 'Z';
            const starttime = new Date(now.getTime() - 60 * 60 * 1000).toISOString().split('.')[0] + 'Z';
            const fmisid = '151028';
            const parameters = 'windspeedms,winddirection';

            const params = new URLSearchParams({
                service: 'WFS',
                version: '2.0.0',
                request: 'GetFeature',
                storedquery_id: 'fmi::observations::weather::multipointcoverage',
                fmisid: fmisid,
                starttime: starttime,
                endtime: endtime,
                parameters: parameters
            });

            const url = `https://opendata.fmi.fi/wfs?${params.toString()}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const tupleList = xmlDoc.getElementsByTagName("gml:doubleOrNilReasonTupleList")[0];
            
            if (!tupleList) {
                throw new Error('No wind data tuple list found in the response');
            }
            
            const textContent = tupleList.textContent.trim();
            const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            const latestData = lines[lines.length - 1];
            const dataParts = latestData.split(/\s+/);
            
            if (dataParts.length < 2) {
                throw new Error('Invalid wind data format in the response');
            }
            
            const [windSpeed, windDirection] = dataParts;

            if (!windSpeed || !windDirection || isNaN(parseFloat(windSpeed)) || isNaN(parseFloat(windDirection))) {
                throw new Error('No valid wind data found in the response');
            }

            const timestamp = now.getTime();

            // Cache the new data
            const cacheData = { windSpeed, windDirection };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            localStorage.setItem(cacheTimeKey, timestamp.toString());

            // Display the data
            displayWindData(windSpeed, windDirection, 'live', timestamp);
        } catch (error) {
            console.error('Error fetching wind data:', error);
            document.getElementById('error').textContent = `Ajantasainen tuulitieto tauolla: ${error.message}`;
            document.getElementById('error').style.display = 'block';
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }
}

// Initial fetch
fetchWindData();