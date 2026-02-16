var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Konfigurace stroje (Rotor I a Reflektor B)
var ROTOR_INIT = "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split("");
var REFLEKTOR = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split("");
// Globální stav rotoru (aby se mohl točit)
var aktualniRotor = __spreadArray([], ROTOR_INIT, true);
/**
 * Pomocná funkce pro normalizaci textu.
 * Odstraní diakritiku (Č -> C) a převede na velká písmena.
 */
function normalizujText(text) {
    return text
        .normalize("NFD") // Rozloží znaky (např. Č na C + háček)
        .replace(/[\u0300-\u036f]/g, "") // Odstraní diakritická znaménka
        .toUpperCase();
}
/**
 * 1. ÚKOL: Statická substituce
 * Šifruje bez pohybu rotoru.
 */
function sifrujStaticky(vstup) {
    var vystup = "";
    // Pro jistotu použijeme čistou kopii rotoru, aby neovlivnil stav
    var statickyRotor = __spreadArray([], ROTOR_INIT, true);
    var normalizovanyVstup = normalizujText(vstup);
    for (var i = 0; i < normalizovanyVstup.length; i++) {
        var znak = normalizovanyVstup[i];
        var kodZnaku = znak.charCodeAt(0);
        // Pokud je to písmeno A-Z (ASCII 65-90)
        if (kodZnaku >= 65 && kodZnaku <= 90) {
            var index = kodZnaku - 65;
            vystup += statickyRotor[index];
        }
        else {
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
function enigma(vstup) {
    var vystup = "";
    var normalizovanyVstup = normalizujText(vstup);
    for (var i = 0; i < normalizovanyVstup.length; i++) {
        var znak = normalizovanyVstup[i];
        var kodZnaku = znak.charCodeAt(0);
        // Zpracujeme pouze písmena A-Z
        if (kodZnaku >= 65 && kodZnaku <= 90) {
            // 1. Vstupní index (A=0, B=1...)
            var indexVstup = kodZnaku - 65;
            // 2. Cesta TAM (Rotor)
            var znakTam = aktualniRotor[indexVstup];
            // 3. Reflektor (Symetrický odraz)
            // Zjistíme index znaku, který vylezl z rotoru
            var indexProReflektor = znakTam.charCodeAt(0) - 65;
            var znakRefl = REFLEKTOR[indexProReflektor];
            // 4. Cesta ZPĚT (Hledáme pozici v rotoru)
            var indexZpet = aktualniRotor.indexOf(znakRefl);
            // Převod indexu zpět na znak
            var vyslednyZnak = String.fromCharCode(indexZpet + 65);
            vystup += vyslednyZnak;
            // 5. Mechanický posuv (Rotace pole)
            // shift() vezme první prvek, push() ho dá na konec
            var prvniPrvek = aktualniRotor.shift();
            if (prvniPrvek) {
                aktualniRotor.push(prvniPrvek);
            }
        }
        else {
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
function resetujStroj() {
    aktualniRotor = __spreadArray([], ROTOR_INIT, true);
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
aktualniRotor = __spreadArray([], ROTOR_INIT, true);
console.log("Vstup: AAAA");
console.log("Očekáváno: HJKP");
console.log("Realita: " + enigma("AAAA"));
console.log("\n--- TEST RECIPROCITY (Dešifrování) ---");
// Resetujeme pro dešifrování (příjemce musí mít stejné nastavení jako odesílatel)
aktualniRotor = __spreadArray([], ROTOR_INIT, true);
console.log("Vstup (šifra): HJKP");
console.log("Očekáváno: AAAA");
console.log("Realita: " + enigma("HJKP"));
// --- Propojení s HTML (Pokud běží v prohlížeči) ---
// Tato část kódu se spustí až po načtení stránky
document.addEventListener("DOMContentLoaded", function () {
    var btnStat = document.getElementById("btn-static");
    var btnEnigma = document.getElementById("btn-enigma");
    var btnReset = document.getElementById("btn-reset");
    var input = document.getElementById("input-text");
    var output = document.getElementById("output-text");
    if (btnStat && input && output) {
        btnStat.addEventListener("click", function () {
            output.textContent = sifrujStaticky(input.value);
        });
    }
    if (btnEnigma && input && output) {
        btnEnigma.addEventListener("click", function () {
            output.textContent = enigma(input.value);
        });
    }
    if (btnReset) {
        btnReset.addEventListener("click", function () {
            resetujStroj();
        });
    }
});
