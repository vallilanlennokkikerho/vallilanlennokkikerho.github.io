# Plan: Korjataan "vaahtomuovi" -> "solumuovi" Styroksi-kontekstissa

Tämä dokumentti kuvaa suunnitelman "styroksi"-termin virheellisen käytön korjaamiseksi ("vaahtomuovi" -> "solumuovi") projektin markdown-tiedostoissa.

## 1. Alkuperäinen Pyyntö

Käyttäjä pyysi korjaamaan kaikki esiintymät, joissa "styroksi" (styrofoam) on virheellisesti kutsuttu "vaahtomuoviksi" (foam rubber/plastic foam), ja vaihtamaan "vaahtomuovi" termiksi "solumuovi" (cellular plastic/expanded plastic) näissä konteksteissa.

## 2. Hakutulokset "vaahtomuovi"

Ensimmäinen haku `*.md`-tiedostoista termillä "vaahtomuovi" tuotti 15 osumaa viidessä tiedostossa:

*   [`rakennusmateriaalit.md`](rakennusmateriaalit.md) (6 esiintymää)
*   [`lennokkityypit.md`](lennokkityypit.md) (2 esiintymää)
*   [`lennokkisanastoa.md`](lennokkisanastoa.md) (3 esiintymää)
*   [`lennokkien-rakentaminen.md`](lennokkien-rakentaminen.md) (3 esiintymää)
*   [`index.md`](index.md) (1 esiintymä)

## 3. Tarkennuskysymykset ja Vastaukset

**Kysymys 1 (Yleisterminologia):**
Termiä "vaahtomuovi" käytetään yleisenä otsikkona tai yhteisnimityksenä materiaaleille kuten EPO, EPP, EPS (Styrox) ja XPS. Koska kaikki nämä ovat teknisesti "solumuoveja", halutaanko "vaahtomuovi" muuttaa "solumuoviksi", kun sitä käytetään yleisenä kategorianimenä näille mallinnusvaahtomuoveille?

*   **Käyttäjän Vastaus:** Kyllä, muutetaan yleistermi.

**Kysymys 2 (Erityistapaukset ja Yleiset Termit):**
*   **Liimat:** Termit kuten "vaahtomuoviliimoilla" ja "vaahtomuoviosien".
*   **Vaimennusmateriaali:** "vaahtomuovilla" tärinänvaimennukseen.
    Miten näiden kanssa toimitaan?

*   **Käyttäjän Vastaus:** Pidetään liimatermit ennallaan ("vaahtomuovi-"), pidetään vaimennusmateriaali ennallaan ("vaahtomuovi").

## 4. Suunnitellut Muutokset (12 kpl)

Seuraavat esiintymät muutetaan "vaahtomuovi" -> "solumuovi":

**[`rakennusmateriaalit.md`](rakennusmateriaalit.md)**
*   Rivi 12: "...erilaiset **vaahtomuovit**..." -> "...erilaiset **solumuovit**..."
*   Rivi 16: "Erilaiset **vaahtomuovit** ovat..." -> "Erilaiset **solumuovit** ovat..."
*   Rivi 46: "...päällystettyä **vaahtomuovi**ydintä..." -> "...päällystettyä **solumuovi**ydintä..."
*   Rivi 96: "Kalliimpi kuin **vaahtomuovit**." -> "Kalliimpi kuin **solumuovit**."
*   Rivi 171: "...(esim. **vaahtomuovi**siipiä)." -> "...(esim. **solumuovi**siipiä)."

**[`lennokkityypit.md`](lennokkityypit.md)**
*   Rivi 123: "...usein **vaahtomuovia** (EPP/foam)..." -> "...usein **solumuovia** (EPP/foam)..."
*   Rivi 314: "**Vaahtomuovi**lennokit..." -> "**Solumuovi**lennokit..."

**[`lennokkisanastoa.md`](lennokkisanastoa.md)**
*   Rivi 68: "...kestävä **vaahtomuovi**..." (Elapor) -> "...kestävä **solumuovi**..."
*   Rivi 83: "Yleisnimitys **vaahtomuoville**, kuten Styrox tai Depron..." -> "Yleisnimitys **solumuoville**, kuten Styrox tai Depron..."
*   Rivi 274: "...hauras **vaahtomuovi** lennokkien rakentamiseen." (Styrox) -> "...hauras **solumuovi** lennokkien rakentamiseen."

**[`lennokkien-rakentaminen.md`](lennokkien-rakentaminen.md)**
*   Rivi 108: ".../rakennusmateriaalit/#1-**vaahtomuovit**-epo-epp-eps-xps))" -> ".../rakennusmateriaalit/#1-**solumuovit**-epo-epp-eps-xps))"

**[`index.md`](index.md)**
*   Rivi 40: "...kestävästä **vaahtomuovista** (EPP tai EPO)..." -> "...kestävästä **solumuovista** (EPP tai EPO)..."

## 5. Muuttamatta Jätettävät Esiintymät (3 kpl)

Seuraavia esiintymiä **ei** muuteta käyttäjän ohjeistuksen mukaisesti:

*   [`rakennusmateriaalit.md:20`](rakennusmateriaalit.md:20): "...korjata **vaahtomuovi**liimoilla..."
*   [`lennokkien-rakentaminen.md:72`](lennokkien-rakentaminen.md:72): "...**vaahtomuovi**osien liimaamiseen"
*   [`lennokkien-rakentaminen.md:203`](lennokkien-rakentaminen.md:203): "Kiinnitä se **vaahtomuovilla** tärinän vähentämiseksi."

## 6. Prosessikaavio

```mermaid
graph TD
    A[Start: User Request] --> B{Search for "vaahtomuovi"};
    B --> C[Analyze Results (15 instances)];
    C --> D{Identify General vs. Specific Uses};
    D --> E[Present Plan & Clarification Qs];
    E --> F{User Feedback on Q1 & Q2};
    F -- Q1: Change General Term --> G[Identify all relevant "vaahtomuovi" for change];
    F -- Q1: Only Styrox-specific --> H[Identify only direct "styroksi as vaahtomuovi"];
    G -- Q2 Decisions --> I[Finalize list of changes];
    H -- Q2 Decisions --> I;
    I --> J[Execute changes with apply_diff];
    J --> K[User Review];
    K --> L[Task Complete or Further Action];