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
function resetRotor(): void {
    rotor = [...rotorMap];
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
    // Elementy pro statickou substituci
    const staticInput = document.getElementById("static-input") as HTMLTextAreaElement;
    const staticOutput = document.getElementById("static-output") as HTMLTextAreaElement;
    const staticEncryptBtn = document.getElementById("static-encrypt-btn") as HTMLButtonElement;

    // Elementy pro Enigma simulaci
    const enigmaInput = document.getElementById("enigma-input") as HTMLTextAreaElement;
    const enigmaOutput = document.getElementById("enigma-output") as HTMLTextAreaElement;
    const enigmaProcessBtn = document.getElementById("enigma-process-btn") as HTMLButtonElement;
    const enigmaResetBtn = document.getElementById("enigma-reset-btn") as HTMLButtonElement;

    // Event listener pro statickou substituci
    staticEncryptBtn.addEventListener("click", () => {
        const inputText = staticInput.value;
        staticOutput.value = sifrujStaticky(inputText);
    });

    // Event listener pro šifrování/dešifrování Enigmou
    enigmaProcessBtn.addEventListener("click", () => {
        const inputText = enigmaInput.value;
        enigmaOutput.value = enigma(inputText);
    });

    // Event listener pro resetování rotoru
    enigmaResetBtn.addEventListener("click", () => {
        resetRotor();
        // Informujeme uživatele, že rotor byl resetován (nepovinné)
        enigmaInput.value = "";
        enigmaOutput.value = "";
        enigmaInput.placeholder = "Rotor byl resetován. Zadejte nový text...";
    });
});
