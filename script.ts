// Konfigurace stroje (Rotor I a Reflektor B)
const ROTOR_INIT: string[] = "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split("");
const REFLEKTOR: string[] = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split("");

// Globální stav rotoru (aby se mohl točit)
let aktualniRotor: string[] = [...ROTOR_INIT];

/**
 * Pomocná funkce pro normalizaci textu.
 * Odstraní diakritiku (Č -> C) a převede na velká písmena.
 */
function normalizujText(text: string): string {
    return text
        .normalize("NFD") // Rozloží znaky (např. Č na C + háček)
        .replace(/[\u0300-\u036f]/g, "") // Odstraní diakritická znaménka
        .toUpperCase();
}

/**
 * 1. ÚKOL: Statická substituce
 * Šifruje bez pohybu rotoru.
 */
function sifrujStaticky(vstup: string): string {
    let vystup = "";
    // Pro jistotu použijeme čistou kopii rotoru, aby neovlivnil stav
    const statickyRotor = [...ROTOR_INIT]; 

    const normalizovanyVstup = normalizujText(vstup);

    for (let i = 0; i < normalizovanyVstup.length; i++) {
        const znak = normalizovanyVstup[i];
        const kodZnaku = znak.charCodeAt(0);

        // Pokud je to písmeno A-Z (ASCII 65-90)
        if (kodZnaku >= 65 && kodZnaku <= 90) {
            const index = kodZnaku - 65;
            vystup += statickyRotor[index];
        } else {
            // Mezery a jiné znaky necháme být
            vystup += znak;
        }
    }
    return vystup;
}

/**
 * 2. ÚKOL: Simulace Enigmy
 * Kompletní cyklus: Cesta TAM -> Reflektor -> Cesta ZPĚT -> Posun rotoru
 */
function enigma(vstup: string): string {
    let vystup = "";
    const normalizovanyVstup = normalizujText(vstup);

    for (let i = 0; i < normalizovanyVstup.length; i++) {
        const znak = normalizovanyVstup[i];
        const kodZnaku = znak.charCodeAt(0);

        // Zpracujeme pouze písmena A-Z
        if (kodZnaku >= 65 && kodZnaku <= 90) {
            
            // 1. Vstupní index (A=0, B=1...)
            const indexVstup = kodZnaku - 65;

            // 2. Cesta TAM (Rotor)
            const znakTam = aktualniRotor[indexVstup];
            
            // 3. Reflektor (Symetrický odraz)
            // Zjistíme index znaku, který vylezl z rotoru
            const indexProReflektor = znakTam.charCodeAt(0) - 65;
            const znakRefl = REFLEKTOR[indexProReflektor];

            // 4. Cesta ZPĚT (Hledáme pozici v rotoru)
            const indexZpet = aktualniRotor.indexOf(znakRefl);
            
            // Převod indexu zpět na znak
            const vyslednyZnak = String.fromCharCode(indexZpet + 65);
            vystup += vyslednyZnak;

            // 5. Mechanický posuv (Rotace pole)
            // shift() vezme první prvek, push() ho dá na konec
            const prvniPrvek = aktualniRotor.shift();
            if (prvniPrvek) {
                aktualniRotor.push(prvniPrvek);
            }

        } else {
            // Znaky mimo abecedu (mezery) se nešifrují a NEPOSOUVAJÍ rotor
            vystup += znak;
        }
    }
    return vystup;
}

/**
 * Funkce pro resetování stroje do základního nastavení
 * (Vyvolá se tlačítkem na webu)
 */
function resetujStroj(): void {
    aktualniRotor = [...ROTOR_INIT];
    console.log("--- Enigma resetována do základní polohy ---");
    alert("Rotor byl vrácen do výchozí polohy.");
}

// --- Ověření funkčnosti v konzoli (dle zadání) ---
console.log("--- TEST ZADÁNÍ 1 (Statická substituce) ---");
console.log("Vstup: AAAA");
console.log("Očekáváno: EEEE");
console.log("Realita: " + sifrujStaticky("AAAA"));

console.log("\n--- TEST ZADÁNÍ 2 (Enigma s rotací) ---");
// Resetujeme rotor před testem, aby seděl výsledek
aktualniRotor = [...ROTOR_INIT]; 
console.log("Vstup: AAAA");
console.log("Očekáváno: HJKP");
console.log("Realita: " + enigma("AAAA"));

console.log("\n--- TEST RECIPROCITY (Dešifrování) ---");
// Resetujeme pro dešifrování (příjemce musí mít stejné nastavení jako odesílatel)
aktualniRotor = [...ROTOR_INIT];
console.log("Vstup (šifra): HJKP");
console.log("Očekáváno: AAAA");
console.log("Realita: " + enigma("HJKP"));

// --- Propojení s HTML (Pokud běží v prohlížeči) ---
// Tato část kódu se spustí až po načtení stránky
document.addEventListener("DOMContentLoaded", () => {
    const btnStat = document.getElementById("btn-static");
    const btnEnigma = document.getElementById("btn-enigma");
    const btnReset = document.getElementById("btn-reset");
    const input = document.getElementById("input-text") as HTMLInputElement;
    const output = document.getElementById("output-text");

    if (btnStat && input && output) {
        btnStat.addEventListener("click", () => {
            output.textContent = sifrujStaticky(input.value);
        });
    }

    if (btnEnigma && input && output) {
        btnEnigma.addEventListener("click", () => {
            output.textContent = enigma(input.value);
        });
    }

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            resetujStroj();
        });
    }
});