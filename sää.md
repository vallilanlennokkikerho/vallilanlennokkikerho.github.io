---
layout: page
title: Sää lennokkikentällä
permalink: /sää/
description: Tietoa säästä ja sen vaikutuksista lentotoimintaan. Tutustu Talosaarentien kentän sääolosuhteisiin.
keywords: Tietoa säästä, lentotoiminta, sääolosuhteet, Tuuli, lämpötila, kosteus, lentokeli, lentokenttä, lennätys, lennokki, Helsinki
---

## Tuuliolosuhteet

<div class="image-container" style="display: flex; align-items: top; justify-content: space-between; background-color:white;">
  <div style="flex: 1; padding-left: 20px; padding-top:20px;">
    <p>Talosaarentien kentän tuuliolosuhteet vaihtelevat Suomen yleisten tuulensuuntien mukaisesti. Lounas- ja länsituulet ovat yleisiä Suomessa, mutta parhaat tuulet lennokkikentän toimintaan ovat usein kaakosta ja luoteesta. Länsi-lounaistuuli voi olla haastava, sillä se voi aiheuttaa pyörteisyyttä metsän reunasta, joka sijaitsee lähellä kenttää.</p>

    <div id="wind-data" class="wind-data" style="display: none; font-size: 20px; margin-top: 20px; text-align: left;"></div>
    <div id="loading" class="loading" style="text-align: left;">Loading...</div>
    <div id="error" class="error" style="text-align: left;"></div>
  </div>
  
  <div style="flex: 1;">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        margin: 0;
        padding: 0;
      }

      .container {
        background-color: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        border-radius: 8px;

      }
      
      .wind-data {
        font-size: 24px;
        text-align: center;
        color: #555;
      }
      
      .loading {
        text-align: center;
        font-style: italic;
        color: #888;
      }
      
      .error {
        text-align: center;
        color: red;
      }
      
      .wind-visualization {
        position: relative;
        width: 100%;
        max-width: 400px;
        margin: 20px auto 0;
      }
      
      .wind-arrow-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(var(--wind-direction));
        z-index: 10;
        margin: 0;
        height: auto;
        transition: transform 0.3s ease;
      }
      
      .wind-arrow {
        width: 60px;
        height: 60px;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 0.9;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 0.9;
        }
      }
      
      .valkka-image {
        width: 100%;
        max-width: 400px;
        display: block;
        border-radius: 8px;
        margin-right: 20px;
        margin-bottom: 20px;
      }
    </style>

    <div class="wind-visualization-container">
      <div class="wind-visualization">
        <img src="/images/Talosaari_tuuli.png" alt="Tuulensuunta lennokkikentällä" class="valkka-image">
        <div class="wind-arrow-container">
          <svg class="wind-arrow" viewBox="0 0 24 24" id="direction-arrow">
            <path d="M12 2L8 12H11V22H13V12H16L12 2Z"/>
          </svg>
        </div>
      </div>
    </div>

    <script>
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

      async function fetchWindData() {
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
          if (lines.length === 0) {
            throw new Error('No wind data lines found in the response');
          }

          const latestData = lines[lines.length - 1];
          const dataParts = latestData.split(/\s+/);
          if (dataParts.length < 2) {
            throw new Error('Invalid wind data format in the response');
          }
          const [windSpeed, windDirection] = dataParts;

          if (!windSpeed || !windDirection || isNaN(parseFloat(windSpeed)) || isNaN(parseFloat(windDirection))) {
            throw new Error('No valid wind data found in the response');
          }

          const windSpeedNum = parseFloat(windSpeed);
          const directionDeg = parseFloat(windDirection);
          const directionText = getCardinalDirection(directionDeg).name; 
          
document.getElementById('wind-data').innerHTML = `
  Tuulennopeus nyt: ${windSpeed} m/s<br>
  Tuulensuunta: ${windDirection}° (${directionText})
`;

          const arrow = document.getElementById('direction-arrow');
          let arrowColor;
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
        } catch (error) {
          console.error('Error fetching wind data:', error);
          document.getElementById('error').textContent = `Ajantasainen tuulitieto tauolla..: ${error.message}`;
          document.getElementById('error').style.display = 'block';
        } finally {
          document.getElementById('loading').style.display = 'none';
        }
      }

      fetchWindData();
    </script>
  </div>
</div>

## Sääennuste

<a href="https://www.yr.no/en/details/graph/2-11978530/Finland/Uusimaa/Helsinki/Vuosaari" target="_blank">
  <img src="https://www.yr.no/en/content/2-11978530/meteogram.svg" style="width: 100%; height: auto;" alt="sää Vuosaari" />
</a>

<p>Tämä kuva esittää ajantasaisen sääennusteen Talosaarentien kentälle. Se kattaa tuulen suunnan ja nopeuden, lämpötilan sekä sademäärän. Tämä tieto auttaa lentotoiminnan suunnittelussa ja antaa käsityksen siitä, millaisia olosuhteita lennokkitoimintaan on odotettavissa. Muista aina tarkistaa ajantasaiset sääolosuhteet ennen lennättämistä, koska säätila voi vaihdella nopeasti.</p>

## Sadetutka

<iframe frameborder="0" src="https://widgets.meteox.com/en-GB/widgets/radar/location/10610/rain?z=6" style="height:400px;width:100%;max-width:100%;"></iframe>

<div class="image-container">
  <img src="/images/lennokkikuvia/talosaari.jpg" alt="" />
  <p>Kuvaaja Kari Hakli, 2009. Helsingin kaupunginmuseon kokoelmat.</p>
</div>
