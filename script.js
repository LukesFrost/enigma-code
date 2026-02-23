var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Definice rotoru a reflektoru podle zadání
var rotorMap = "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split("");
var reflektorMap = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split("");
// Pracovní kopie rotoru, která bude mutovat (otáčet se)
var rotor = __spreadArray([], rotorMap, true);
/**
 * Resetuje rotor do původního stavu.
 * Je důležité volat tuto funkci před každým novým šifrováním,
 * aby se zajistily konzistentní a opakovatelné výsledky.
 */
/**
 * Resetuje rotor do původního stavu nebo s volitým počátečním posunem.
 * @param offset Počet kroků, o které se rotor posune (0-25). Pokud není zadáno, použije se 0.
 */
function resetRotor(offset) {
    rotor = __spreadArray([], rotorMap, true);
    if (offset && Number.isInteger(offset)) {
        var steps = ((offset % 26) + 26) % 26; // zajistí 0-25
        for (var i = 0; i < steps; i++) {
            rotor.push(rotor.shift());
        }
    }
}
/**
 * Nastaví počáteční pozici rotoru podle písmena (A-Z).
 * Pokud je písmeno neplatné, nic neudělá.
 */
function setRotorByLetter(letter) {
    if (!letter)
        return;
    var up = letter.toUpperCase();
    var code = up.charCodeAt(0);
    if (code >= 65 && code <= 90) {
        resetRotor(code - 65);
    }
}
/**
 * Funkce pro jednoduché šifrování bez pohybu rotoru.
 * @param text Vstupní text k zašifrování.
 * @returns Zašifrovaný text.
 */
function sifrujStaticky(text) {
    var vystup = "";
    for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
        var znak = text_1[_i];
        var velkyZnak = znak.toUpperCase();
        var kod = velkyZnak.charCodeAt(0);
        // Zpracováváme pouze písmena anglické abecedy (A-Z)
        if (kod >= 65 && kod <= 90) {
            var index = kod - 65;
            vystup += rotorMap[index];
        }
        else {
            // Ostatní znaky (mezery, čísla, diakritika) ponecháme beze změny
            vystup += znak;
        }
    }
    return vystup;
}
/**
 * Dešifrování pro statickou substituci (inverzní mapa).
 */
function sifrujStatickyDecrypt(text) {
    var _a;
    var inverse = {};
    rotorMap.forEach(function (v, i) { return inverse[v] = String.fromCharCode(65 + i); });
    var vystup = "";
    for (var _i = 0, text_2 = text; _i < text_2.length; _i++) {
        var znak = text_2[_i];
        var velkyZnak = znak.toUpperCase();
        var kod = velkyZnak.charCodeAt(0);
        if (kod >= 65 && kod <= 90) {
            vystup += (_a = inverse[velkyZnak]) !== null && _a !== void 0 ? _a : znak;
        }
        else {
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
function enigma(text) {
    var vystup = "";
    for (var _i = 0, text_3 = text; _i < text_3.length; _i++) {
        var znak = text_3[_i];
        var velkyZnak = znak.toUpperCase();
        var kod = velkyZnak.charCodeAt(0);
        // Zpracováváme pouze písmena anglické abecedy (A-Z)
        if (kod >= 65 && kod <= 90) {
            // 1. Normalizace vstupu na index 0-25
            var indexVstup = kod - 65;
            // 2. Cesta TAM: Rotor
            var znakTam = rotor[indexVstup];
            // 3. Reflektor
            var indexRefl = znakTam.charCodeAt(0) - 65;
            var znakRefl = reflektorMap[indexRefl];
            // 4. Cesta ZPĚT: Rotor (hledání hodnoty)
            var indexZpet = rotor.indexOf(znakRefl);
            var znakVystup = String.fromCharCode(indexZpet + 65);
            vystup += znakVystup;
            // 5. Mechanický posuv rotoru
            rotor.push(rotor.shift());
        }
        else {
            // Ostatní znaky (mezery, čísla, diakritika) ponecháme beze změny
            vystup += znak;
        }
    }
    return vystup;
}
// --- Ověření funkčnosti v konzoli ---
console.log("--- Úkol 1: Statická substituce ---");
var test1_vstup = "AAAA";
var test1_vystup = sifrujStaticky(test1_vstup);
console.log("Vstup: \"".concat(test1_vstup, "\" -> V\u00FDstup: \"").concat(test1_vystup, "\" (O\u010Dek\u00E1v\u00E1no: \"EEEE\")"));
console.log("Test s mezerami a malými písmeny:", sifrujStaticky("Hello World"));
console.log("\n--- Úkol 2: Simulace Enigmy ---");
// Test šifrování
resetRotor(); // Reset rotoru před šifrováním
var test2_vstup = "AAAA";
var test2_vystup = enigma(test2_vstup);
console.log("\u0160ifrov\u00E1n\u00ED: Vstup: \"".concat(test2_vstup, "\" -> V\u00FDstup: \"").concat(test2_vystup, "\" (O\u010Dek\u00E1v\u00E1no: \"HJKP\")"));
// Test dešifrování (reciprocita)
resetRotor(); // Reset rotoru před dešifrováním
var test3_vstup = "HJKP";
var test3_vystup = enigma(test3_vstup);
console.log("De\u0161ifrov\u00E1n\u00ED: Vstup: \"".concat(test3_vstup, "\" -> V\u00FDstup: \"").concat(test3_vystup, "\" (O\u010Dek\u00E1v\u00E1no: \"AAAA\")"));
// Test s celou větou
resetRotor();
var veta = "TAJNA ZPRAVA";
var sifrovanaVeta = enigma(veta);
console.log("\u0160ifrov\u00E1n\u00ED v\u011Bty: \"".concat(veta, "\" -> \"").concat(sifrovanaVeta, "\""));
resetRotor();
// --- Logika pro propojení s uživatelským rozhraním ---
document.addEventListener("DOMContentLoaded", function () {
    // --- Statická substituce ---
    var staticInput = document.getElementById("static-input");
    var staticOutput = document.getElementById("static-output");
    var staticEncryptBtn = document.getElementById("static-encrypt-btn");
    staticEncryptBtn.addEventListener("click", function () {
        var inputText = staticInput.value;
        staticOutput.value = sifrujStaticky(inputText);
    });
    // Pokud chcete dešifrovat staticky, můžete použít tento (pokud máte v UI tlačítko):
    var staticDecryptBtn = document.getElementById("static-decrypt-btn");
    var staticDecryptOutput = document.getElementById("static-output-decrypt");
    var staticDecryptInput = document.getElementById("static-input-decrypt");
    if (staticDecryptBtn && staticDecryptInput && staticDecryptOutput) {
        staticDecryptBtn.addEventListener("click", function () {
            var inputText = staticDecryptInput.value;
            staticDecryptOutput.value = sifrujStatickyDecrypt(inputText);
        });
    }
    // --- Enigma Simulace ---
    // Šifrování
    var enigmaEncryptInput = document.getElementById("enigma-encrypt-input");
    var enigmaEncryptOutput = document.getElementById("enigma-encrypt-output");
    var enigmaEncryptBtn = document.getElementById("enigma-encrypt-btn");
    enigmaEncryptBtn.addEventListener("click", function () {
        // Volitelně přečti počáteční pozici z inputu s id "rotor-start"
        var rotorStartElem = document.getElementById("rotor-start");
        if (rotorStartElem && rotorStartElem.value) {
            var v = rotorStartElem.value.trim();
            // Pokud je písmeno A-Z
            if (/^[A-Za-z]$/.test(v))
                setRotorByLetter(v);
            else {
                var n = parseInt(v, 10);
                if (!isNaN(n))
                    resetRotor(n);
                else
                    resetRotor();
            }
        }
        else {
            resetRotor(); // default
        }
        var inputText = enigmaEncryptInput.value;
        enigmaEncryptOutput.value = enigma(inputText);
    });
    // Dešifrování
    var enigmaDecryptInput = document.getElementById("enigma-decrypt-input");
    var enigmaDecryptOutput = document.getElementById("enigma-decrypt-output");
    var enigmaDecryptBtn = document.getElementById("enigma-decrypt-btn");
    enigmaDecryptBtn.addEventListener("click", function () {
        // Stejné nastavení rotoru musí být použité pro dešifrování
        var rotorStartElem = document.getElementById("rotor-start");
        if (rotorStartElem && rotorStartElem.value) {
            var v = rotorStartElem.value.trim();
            if (/^[A-Za-z]$/.test(v))
                setRotorByLetter(v);
            else {
                var n = parseInt(v, 10);
                if (!isNaN(n))
                    resetRotor(n);
                else
                    resetRotor();
            }
        }
        else {
            resetRotor();
        }
        var inputText = enigmaDecryptInput.value;
        enigmaDecryptOutput.value = enigma(inputText);
    });
});
