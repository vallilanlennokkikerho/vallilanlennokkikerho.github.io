---
layout: page
title: RC-LENTOKONEEN ENSILENNON TARKISTUSLISTA
permalink: /aloittelijan-opas/lennokin-ensilennon-tarkistuslista/
description: Käytännöllinen tarkistuslista RC-lentokoneen ensilennolle. Käy läpi vaiheet huolellisesti ennen kentälle menoa, kentällä, lennokin kokoamisessa, järjestelmien testauksessa, ennen lentoonlähtöä ja lennon jälkeen – näin varmistat turvallisen ja onnistuneen ensilennon!
keywords: rc-lennokki, ensilento, tarkistuslista, lennokkiharrastus, turvallisuus, aloittelijan opas
lang: fi
---

<style>
ul {list-style-type: none;}
</style>

Tämä tarkistuslista ohjaa sinut turvallisesti ensilentoon. Käy vaiheet läpi huolella, niin pääset nauttimaan lennättämisen ilosta. Vallilan lennokkikerho tukee sinua – turvallista ja hauskaa lentoa!

## ENNEN KENTÄLLE LÄHTÖÄ

### Lennätyspaikan valmistelu

- [ ] Tarkista lennätysrajoitukset, kuten kieltoalueet ja korkeusrajoitukset, [Flyk-palvelusta](https://flyk.com/fi).
- [ ] Varmista lennätyspaikan sopivuus ensilentoon (avoin alue ilman esteitä).
- [ ] Tarkista sääennuste – tuulen nopeus mielellään alle 4 m/s ensilennolle.
- [ ] Huolehdi, että sinulla on tarvittavat luvat lennätyspaikalle tai lennättämiseen.

### Laitteiston valmistelu

- [ ] Lataa kaikki akut täyteen (lähetin, vastaanotin, lentoakku).
- [ ] Tarkista lähettimen asetukset ja ohjelmointi (esim. ohjainpintojen liikkeet) sekä radiolähettimen ja vastaanottimen paritus (binding), erityisesti uuden laitekokonaisuuden tai PNF/ARF-koneen osalta.
- [ ] Määritä turvakytkin lähettimeen (esim. asetus, joka estää moottorin käynnistymisen vahingossa).
- [ ] Pakkaa mukaan tarvittavat työkalut (esim. ruuvimeisseli, jakoavain).
- [ ] Ota mukaan varapotkuri ja vara-akkuja (esim. 2–3 kpl).

## KENTÄLLÄ ENNEN KOKOAMISTA

### Ympäristön tarkistus

- [ ] Arvioi tuulen suunta ja voimakkuus paikan päällä.
- [ ] Tutki lennokkikenttä ja varmista, ettei alueella ole esteitä.
- [ ] Varmista muiden harrastajien tai ihmisten turvallisuus.
- [ ] Suunnittele lentoreitti ja varaa hätälaskeutumispaikka.

### Turvallisuusvalmistelut

- [ ] Varmista ensiapuvälineiden saatavuus.
- [ ] Säilytä [LiPo-akut](/aloittelijan-opas/lennokkisanastoa/#l) paloturvallisessa pussissa.
- [ ] Pyydä tarvittaessa kokenut kerholainen avustajaksi ensilennolle, jos mahdollista.
- [ ] Tarkista puhelimen akku ja verkkoyhteys hätätilanteita varten (esim. varavirtalähde mukana).

## LENNOKIN KOKOAMINEN JA TARKISTUS

### Rakenteellinen tarkistus

- [ ] Tarkista rungon kunto (ei halkeamia, lommoja tai repeämiä).
- [ ] Varmista siipien tukevuus ja suoruus.
- [ ] Tarkista pyrstön kiinnitys ja linjaus.
- [ ] Varmista, että ruuvit ja mutterit ovat tiukasti kiinni.
- [ ] Tarkista laskutelineen kunto ja kiinnitys.

### Ohjainpinnat ja mekaaniset osat

- [ ] Tarkista ohjainpintojen (esim. korkeusperäsin, siivekkeet) saranat ja kiinnitykset.
- [ ] Varmista työntötankojen ja nivelten kunto.
- [ ] Testaa [servojen](/aloittelijan-opas/lennokkisanastoa/#s) kiinnitys käsin ja toiminta virran kytkemisen jälkeen.
- [ ] Varmista ohjainpintojen vapaa liike ilman vastusta.
- [ ] Tarkista [potkurin](/aloittelijan-opas/lennokkisanastoa/#p) kunto ja kiinnitys.

### Elektroniikka ennen virran kytkemistä

- [ ] Varmista vastaanottimen ja sen johdotusten kiinnitys.
- [ ] Tarkista [nopeussäätimen (ESC)](/aloittelijan-opas/lennokkisanastoa/#n) (moottorin tehonsäädin) asennus ja johdotukset.
- [ ] Varmista akkujen turvallinen kiinnitys ja johdotukset.
- [ ] Huolehdi, että johdot eivät osu liikkuviin osiin.
- [ ] Tarkista antennin sijainti ja suuntaus.

## JÄRJESTELMIEN TESTAUS

### Virran kytkeminen

- [ ] Kytke lähetin päälle ensin.
- [ ] Kytke vastaanotin ja lentoakku päälle.
- [ ] Varmista vastaanottimen yhteys lähettimeen (tarkista LED-valo).
- [ ] Mittaa akkujen jännite ja varaustila (esim. jännitemittarilla).

### Kantama-testi

- [ ] Suorita kantama-testi (range test): kävele 20–30 metrin päähän lennokista ja varmista, että lähetin ohjaa ohjainpintoja luotettavasti.
- [ ] Käytä lähettimen range test -toimintoa, jos saatavilla, vähentääksesi lähetystehoa testin ajaksi.

### Fail-Safe-toiminnon tarkistus

- [ ] Tarkista [Fail-Safe-asetukset](/aloittelijan-opas/lennokkisanastoa/#f) (toiminto, joka ohjaa lennokkia turvallisesti, jos yhteys katkeaa, esim. moottori sammuu, ohjainpinnat neutraaliin).
- [ ] Testaa Fail-Safe: sammuta lähetin ja varmista, että lennokki reagoi oikein (esim. moottori sammuu).

### Ohjainpintojen testaus

- [ ] Varmista ohjainpintojen oikeat liikesuunnat:
  - Korkeusperäsin: sauva taakse = peräsin ylös.
  - Siivekkeet: sauva oikealle = oikea siiveke ylös, vasen alas.
  - Sivuperäsin: sauva oikealle = peräsin oikealle.
- [ ] Testaa laskusiivekkeiden toiminta, jos käytössä.
- [ ] Tarkista [trimmien](/aloittelijan-opas/lennokkisanastoa/#t) toiminta (säädä ohjainpinnat neutraaliin asentoon vakauden varmistamiseksi).

### Moottorin ja turvakytkimen testaus

- [ ] Varmista, että [potkurin](/aloittelijan-opas/lennokkisanastoa/#p) edessä ei ole esteitä tai ihmisiä.
- [ ] Testaa turvakytkimen toiminta: Varmista, että [moottori](/aloittelijan-opas/lennokkisanastoa/#h) ei käynnisty, kun turvakytkin on asetettu estämään moottorin toiminta.
- [ ] Testaa kaasuvaste varovasti pienellä kaasulla.
- [ ] Tee lyhyt kaasuntestaus pienellä teholla. Vältä täyskaasua, ellei testipenkkiä tai turvallista kiinnitystä ole käytössä.
- [ ] Kuuntele, käykö moottori tasaisesti ilman epänormaaleja ääniä.
- [ ] Varmista moottorin sammuvan kokonaan kaasun ollessa minimissä (estää tahattoman käynnistymisen).

### Painopisteen tarkistus

- [ ] Tarkista painopiste valmistajan ohjeiden mukaisesta kohdasta.
- [ ] Säädä akun paikkaa tarvittaessa – lievä nokkapainoisuus on turvallisempi kuin takapainoisuus.
- [ ] Varmista, että kaikki osat pysyvät paikoillaan lennon aikana.

## ENNEN LENTOONLÄHTÖÄ

### Viimeiset tarkistukset

- [ ] Tee C.R.A.P.-tarkistus:
  - **C**: Control surfaces – ohjainpinnat toimivat oikein.
  - **R**: Rips and Tears – ei repeämiä tai vaurioita.
  - **A**: Angles – kulmat ja linjaukset kunnossa.
  - **P**: Power – virtalähteet ja liitännät kunnossa.
- [ ] Tarkista tuulen suunta ja voimakkuus uudelleen.
- [ ] Varmista lennätysalueen olevan vapaa. Ilmoita muille lennättäjille aikeistasi ja varmista heidän olevan tietoisia toiminnastasi.
- [ ] Suunnittele lentoonlähtö, lentoreitti ja laskeutuminen tuulen mukaan.
- [ ] Testaa lähettimen ja vastaanottimen toiminta vielä kerran.

### Henkinen valmistautuminen

- [ ] Käy läpi toimintasuunnitelma hätätilanteiden varalle.
- [ ] Varmista olevasi levännyt ja keskittynyt.
- [ ] Keskustele avustajan kanssa lennätyksen kulusta.
- [ ] Muista: ensilento on testi – pidä se lyhyenä ja turvallisena.

## LENNON JÄLKEEN

### Järjestelmien tarkistus

- [ ] Sammuta lennokin virta ensin, jotta [potkuri](/aloittelijan-opas/lennokkisanastoa/#p) ei käynnisty vahingossa.
- [ ] Sammuta lähetin vasta lennokin virran katkaisun jälkeen.
- [ ] Tarkista akkujen lämpötila ja jännite.
- [ ] Tutki lennokki vaurioiden varalta.
- [ ] Kirjaa muistiin havainnot ja säädöt seuraavaa lennokin lentoa varten.

---

**Onnea ensilentoon!** Vallilan lennokkikerho toivottaa sinulle ikimuistoisia hetkiä lennokkien parissa. Tarvitsetko vinkkejä tai haluatko jakaa kokemuksiasi? Tule kentälle juttelemaan – ilmailu on hauskempaa yhdessä!

<div class="button-container">
<a href="/aloittelijan-opas/" class="button-link">Takaisin aloittelijan oppaaseen</a>
</div>
