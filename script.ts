// Definice rotoru a reflektoru podle zadání
const rotorMap: string[] = "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split("");
const reflektorMap: string[] = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split("");

// Pracovní kopie rotoru, která bude mutovat (otáčet se)
let rotor: string[] = [...rotorMap];

/**
 * Resetuje rotor do původního stavu.
 * Je důležité volat tuto funkci před každým novým šifrováním,
 * aby se zajistily konzistentní a opakovatelné výsledky.
 */
/**
 * Resetuje rotor do původního stavu nebo s volitým počátečním posunem.
 * @param offset Počet kroků, o které se rotor posune (0-25). Pokud není zadáno, použije se 0.
 */
function resetRotor(offset?: number): void {
    rotor = [...rotorMap];
    if (offset && Number.isInteger(offset)) {
        const steps = ((offset % 26) + 26) % 26; // zajistí 0-25
        for (let i = 0; i < steps; i++) {
            rotor.push(rotor.shift()!);
        }
    }
}

/**
 * Nastaví počáteční pozici rotoru podle písmena (A-Z).
 * Pokud je písmeno neplatné, nic neudělá.
 */
function setRotorByLetter(letter: string): void {
    if (!letter) return;
    const up = letter.toUpperCase();
    const code = up.charCodeAt(0);
    if (code >= 65 && code <= 90) {
        resetRotor(code - 65);
    }
}

/**
 * Funkce pro jednoduché šifrování bez pohybu rotoru.
 * @param text Vstupní text k zašifrování.
 * @returns Zašifrovaný text.
 */
function sifrujStaticky(text: string): string {
    let vystup = "";
    for (const znak of text) {
        const velkyZnak = znak.toUpperCase();
        const kod = velkyZnak.charCodeAt(0);

        // Zpracováváme pouze písmena anglické abecedy (A-Z)
        if (kod >= 65 && kod <= 90) {
            const index = kod - 65;
            vystup += rotorMap[index];
        } else {
            // Ostatní znaky (mezery, čísla, diakritika) ponecháme beze změny
            vystup += znak;
        }
    }
    return vystup;
}

/**
 * Dešifrování pro statickou substituci (inverzní mapa).
 */
function sifrujStatickyDecrypt(text: string): string {
    const inverse: Record<string, string> = {};
    rotorMap.forEach((v, i) => inverse[v] = String.fromCharCode(65 + i));
    let vystup = "";
    for (const znak of text) {
        const velkyZnak = znak.toUpperCase();
        const kod = velkyZnak.charCodeAt(0);
        if (kod >= 65 && kod <= 90) {
            vystup += inverse[velkyZnak] ?? znak;
        } else {
            vystup += znak;
        }
    }
    return vystup;
}

/**
 * Simuluje šifrování jedním rotorem a reflektorem stroje Enigma.
 * Funkce zpracovává celý text, otáčí rotorem po každém zašifrovaném znaku.
 * @param text Vstupní text k zašifrování nebo dešifrování.
 * @returns Zašifrovaný nebo dešifrovaný text.
 */
function enigma(text: string): string {
    let vystup = "";
    for (const znak of text) {
        const velkyZnak = znak.toUpperCase();
        const kod = velkyZnak.charCodeAt(0);

        // Zpracováváme pouze písmena anglické abecedy (A-Z)
        if (kod >= 65 && kod <= 90) {
            // 1. Normalizace vstupu na index 0-25
            const indexVstup = kod - 65;

            // 2. Cesta TAM: Rotor
            const znakTam = rotor[indexVstup];

            // 3. Reflektor
            const indexRefl = znakTam.charCodeAt(0) - 65;
            const znakRefl = reflektorMap[indexRefl];

            // 4. Cesta ZPĚT: Rotor (hledání hodnoty)
            const indexZpet = rotor.indexOf(znakRefl);
            const znakVystup = String.fromCharCode(indexZpet + 65);
            vystup += znakVystup;
            
            // 5. Mechanický posuv rotoru
            rotor.push(rotor.shift()!);

        } else {
            // Ostatní znaky (mezery, čísla, diakritika) ponecháme beze změny
            vystup += znak;
        }
    }
    return vystup;
}

// --- Ověření funkčnosti v konzoli ---

console.log("--- Úkol 1: Statická substituce ---");
const test1_vstup = "AAAA";
const test1_vystup = sifrujStaticky(test1_vstup);
console.log(`Vstup: "${test1_vstup}" -> Výstup: "${test1_vystup}" (Očekáváno: "EEEE")`);
console.log("Test s mezerami a malými písmeny:", sifrujStaticky("Hello World"));


console.log("\n--- Úkol 2: Simulace Enigmy ---");

// Test šifrování
resetRotor(); // Reset rotoru před šifrováním
const test2_vstup = "AAAA";
const test2_vystup = enigma(test2_vstup);
console.log(`Šifrování: Vstup: "${test2_vstup}" -> Výstup: "${test2_vystup}" (Očekáváno: "HJKP")`);

// Test dešifrování (reciprocita)
resetRotor(); // Reset rotoru před dešifrováním
const test3_vstup = "HJKP";
const test3_vystup = enigma(test3_vstup);
console.log(`Dešifrování: Vstup: "${test3_vstup}" -> Výstup: "${test3_vystup}" (Očekáváno: "AAAA")`);

// Test s celou větou
resetRotor();
const veta = "TAJNA ZPRAVA";
const sifrovanaVeta = enigma(veta);
console.log(`Šifrování věty: "${veta}" -> "${sifrovanaVeta}"`);

resetRotor();
// --- Logika pro propojení s uživatelským rozhraním ---
document.addEventListener("DOMContentLoaded", () => {
    // --- Statická substituce ---
    const staticInput = document.getElementById("static-input") as HTMLTextAreaElement;
    const staticOutput = document.getElementById("static-output") as HTMLTextAreaElement;
    const staticEncryptBtn = document.getElementById("static-encrypt-btn") as HTMLButtonElement;

    staticEncryptBtn.addEventListener("click", () => {
        const inputText = staticInput.value;
        staticOutput.value = sifrujStaticky(inputText);
    });

    // Pokud chcete dešifrovat staticky, můžete použít tento (pokud máte v UI tlačítko):
    const staticDecryptBtn = document.getElementById("static-decrypt-btn") as HTMLButtonElement | null;
    const staticDecryptOutput = document.getElementById("static-output-decrypt") as HTMLTextAreaElement | null;
    const staticDecryptInput = document.getElementById("static-input-decrypt") as HTMLTextAreaElement | null;
    if (staticDecryptBtn && staticDecryptInput && staticDecryptOutput) {
        staticDecryptBtn.addEventListener("click", () => {
            const inputText = staticDecryptInput.value;
            staticDecryptOutput.value = sifrujStatickyDecrypt(inputText);
        });
    }

    // --- Enigma Simulace ---
    
    // Šifrování
    const enigmaEncryptInput = document.getElementById("enigma-encrypt-input") as HTMLTextAreaElement;
    const enigmaEncryptOutput = document.getElementById("enigma-encrypt-output") as HTMLTextAreaElement;
    const enigmaEncryptBtn = document.getElementById("enigma-encrypt-btn") as HTMLButtonElement;

    enigmaEncryptBtn.addEventListener("click", () => {
        // Volitelně přečti počáteční pozici z inputu s id "rotor-start"
        const rotorStartElem = document.getElementById("rotor-start") as HTMLInputElement | null;
        if (rotorStartElem && rotorStartElem.value) {
            const v = rotorStartElem.value.trim();
            // Pokud je písmeno A-Z
            if (/^[A-Za-z]$/.test(v)) setRotorByLetter(v);
            else {
                const n = parseInt(v, 10);
                if (!isNaN(n)) resetRotor(n);
                else resetRotor();
            }
        } else {
            resetRotor(); // default
        }
        const inputText = enigmaEncryptInput.value;
        enigmaEncryptOutput.value = enigma(inputText);
    });

    // Dešifrování
    const enigmaDecryptInput = document.getElementById("enigma-decrypt-input") as HTMLTextAreaElement;
    const enigmaDecryptOutput = document.getElementById("enigma-decrypt-output") as HTMLTextAreaElement;
    const enigmaDecryptBtn = document.getElementById("enigma-decrypt-btn") as HTMLButtonElement;

    enigmaDecryptBtn.addEventListener("click", () => {
        // Stejné nastavení rotoru musí být použité pro dešifrování
        const rotorStartElem = document.getElementById("rotor-start") as HTMLInputElement | null;
        if (rotorStartElem && rotorStartElem.value) {
            const v = rotorStartElem.value.trim();
            if (/^[A-Za-z]$/.test(v)) setRotorByLetter(v);
            else {
                const n = parseInt(v, 10);
                if (!isNaN(n)) resetRotor(n);
                else resetRotor();
            }
        } else {
            resetRotor();
        }
        const inputText = enigmaDecryptInput.value;
        enigmaDecryptOutput.value = enigma(inputText);
    });
});
