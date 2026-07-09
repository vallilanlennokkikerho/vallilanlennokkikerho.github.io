---
layout: page
title: Sää Talosaaren lennokkikentällä
permalink: /sää/
description: Katso Talosaaren lennokkikentän tuuliolosuhteet, sääennuste ja sadetutka ennen lennättämistä.
keywords: Tietoa säästä, lentotoiminta, sääolosuhteet, Tuuli, lämpötila, kosteus, lentokeli, lentokenttä, lennätys, lennokki, Helsinki
---

## Tuuliolosuhteet

Sää vaikuttaa lennättämiseen nopeasti, etenkin tuuli, puuskat, sade ja näkyvyys. Tarkista ajantasainen tilanne ennen kentälle lähtöä ja arvioi olosuhteet vielä paikan päällä.

<div class="windimage-container">
    <div class="content-left">
        <p>Talosaaren kentän tuuliolosuhteet vaihtelevat Suomen yleisten tuulensuuntien mukaisesti. Lounas- ja länsituulet ovat yleisiä, mutta kentällä parhaat tuulet tulevat usein kaakosta ja luoteesta. Länsi-lounaistuuli voi olla haastava, koska lähellä oleva metsänreuna voi aiheuttaa pyörteisyyttä.</p>

        <div id="wind-data" class="wind-data"></div>
        <div id="loading" class="loading">Ladataan...</div>
        <div id="error" class="error"></div>
    </div>
    
    <div class="content-right">
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
    </div>
</div>

## Sääennuste

<a href="https://www.yr.no/en/details/graph/2-11978530/Finland/Uusimaa/Helsinki/Vuosaari" target="_blank">
  <img src="https://www.yr.no/en/content/2-11978530/meteogram.svg" style="width: 100%; height: auto;" alt="sää Vuosaari" />
</a>

<p>Sääennuste kattaa tuulen suunnan ja nopeuden, lämpötilan sekä sademäärän. Ennuste auttaa suunnittelemaan lennätystä, mutta päätös lentämisestä kannattaa tehdä aina todellisten olosuhteiden mukaan.</p>

## Sadetutka

<iframe frameborder="0" src="https://widgets.meteox.com/en-GB/widgets/radar/location/10610/rain?z=6" style="height:400px;width:100%;max-width:100%;"></iframe>

## Turvallinen lennätys sään mukaan

Tuulen nopeuden lisäksi puuskat, sade, näkyvyys ja lämpötila vaikuttavat lennokin hallintaan. Aloittelijan kannattaa valita tyyni tai heikkotuulinen päivä ja pyytää kokeneempaa harrastajaa mukaan ensimmäisille lennoille.

### Miten tulkita keliä käytännössä

Pelkkä keskituulen nopeus ei kerro kaikkea. Puuskainen 4 m/s voi olla aloittelijalle vaikeampi kuin tasainen 6 m/s kokeneelle lennättäjälle. Myös lennokin koko vaikuttaa paljon: kevyt vaahtomuovitraineri reagoi puuskiin herkemmin kuin suurempi ja painavampi kone.

- **0-3 m/s**: hyvä keli ensilentoihin, trimmaamiseen ja rauhalliseen harjoitteluun.
- **3-6 m/s**: sopii useimmille kokeneemmille harrastajille, mutta puuskat kannattaa huomioida.
- **Yli 6 m/s**: vaatii jo kalustolta ja lennättäjältä enemmän. Aloittelijan kannattaa yleensä odottaa parempaa keliä.
- **Sade tai kostea sumu**: huono yhdistelmä elektroniikalle, puurakenteille ja näkyvyydelle.
- **Kylmä sää**: lyhentää akkujen käyttöaikaa. Pidä akut lämpimänä ennen lentoa ja jätä varaa laskeutumiseen.

### Ennen kentälle lähtöä

Tarkista ainakin tuulen suunta, puuskat, sateen todennäköisyys ja näkyvyys. Kentällä katso vielä tuulipussi, puiden latvat ja muiden lennättäjien havainnot. Jos keli tuntuu rajalta, turvallisin päätös on usein jättää ensimmäinen lento toiseen päivään ja käyttää käynti muiden lennätysten seuraamiseen.

<div class="image-container">
  <img src="/images/lennokkikuvia/talosaari.jpg" alt="" />
</div>
  <p>Kuvaaja Kari Hakli, 2009. Helsingin kaupunginmuseon kokoelmat.</p>

<script src="/js/weather.js"></script>
