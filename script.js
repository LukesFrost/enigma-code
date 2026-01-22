"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetRotor = resetRotor;
exports.sifrujStaticky = sifrujStaticky;
exports.enigma = enigma;
exports.sifrujText = sifrujText;
// Rotor I + Reflektor B (nejpouzivanejsi nastaveni nemecke armady)
var rotorDefault = "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split("");
var reflektor = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split("");
// Stav rotoru (bude se otacet). Default nechavame bokem kvuli resetu.
var rotor = rotorDefault.slice();

function resetRotor() {
    rotor.length = 0;
    Array.prototype.push.apply(rotor, rotorDefault);
}

function normalizeAZ(ch) {
    if (!ch)
        return { kind: "passthrough", value: ch };
    var upper = ch.toUpperCase();
    if (upper.length !== 1)
        return { kind: "passthrough", value: ch };
    var code = upper.charCodeAt(0);
    var isAZ = code >= 65 && code <= 90;
    if (!isAZ)
        return { kind: "passthrough", value: ch };
    return { kind: "az", upper: upper };
}

// 1) Staticka substituce (bez rotace)
function sifrujStaticky(znak) {
    var n = normalizeAZ(znak);
    if (n.kind === "passthrough")
        return n.value;
    var index = n.upper.charCodeAt(0) - 65;
    return rotor[index];
}

// 2) Mini-enigma (1 rotor): tam -> reflektor -> zpet + posuv
function enigma(znak) {
    var n = normalizeAZ(znak);
    if (n.kind === "passthrough")
        return n.value;
    var index = n.upper.charCodeAt(0) - 65;
    var znakTam = rotor[index];
    var indexRefl = znakTam.charCodeAt(0) - 65;
    var znakRefl = reflektor[indexRefl];
    var indexZpet = rotor.indexOf(znakRefl);
    var vystup = String.fromCharCode(indexZpet + 65);
    rotor.push(rotor.shift());
    return vystup;
}

function sifrujText(text, mode) {
    var fn = mode === "staticky" ? sifrujStaticky : enigma;
    var out = "";
    for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
        var ch = text_1[_i];
        out += fn(ch);
    }
    return out;
}

window.enigmaDemo = {
    reset: function () { return resetRotor(); },
    stat: function (s) { return sifrujText(s, "staticky"); },
    run: function (s) { return sifrujText(s, "enigma"); },
};

// UI wiring
function byId(id) {
    return document.getElementById(id);
}

var inputEl = byId("input");
var outputEl = byId("output");
var modeEl = byId("mode");
var btnRun = byId("btnRun");
var btnReset = byId("btnReset");

function runFromUi() {
    if (!inputEl || !outputEl || !modeEl)
        return;
    var mode = modeEl.value === "staticky" ? "staticky" : "enigma";
    outputEl.value = sifrujText(inputEl.value || "", mode);
}

if (btnRun)
    btnRun.addEventListener("click", runFromUi);
if (btnReset)
    btnReset.addEventListener("click", function () {
        resetRotor();
        runFromUi();
    });

// prvni vykresleni
runFromUi();
function resetRotor() {
    rotor.length = 0;
    rotor.push.apply(rotor, rotorDefault);
}
/**
 * Normalizuje vstup na jedno velke pismeno A-Z.
 * - mezery a bezne oddelovace vraci beze zmeny
 * - mala pismena mapuje na velka
 * - znaky mimo A-Z (diakritika, emoji, interpunkce) vraci beze zmeny
 */
function normalizeAZ(ch) {
    if (!ch)
        return { kind: "passthrough", value: ch };
    // pokud je to mala/velka latina, udelej velke
    var upper = ch.toUpperCase();
    if (upper.length !== 1)
        return { kind: "passthrough", value: ch };
    var code = upper.charCodeAt(0);
    var isAZ = code >= 65 && code <= 90;
    if (!isAZ)
        return { kind: "passthrough", value: ch };
    return { kind: "az", upper: upper };
}
// 1) Staticka substituce (BEZ pohybu rotoru)
function sifrujStaticky(znak) {
    var n = normalizeAZ(znak);
    if (n.kind === "passthrough")
        return n.value;
    var index = n.upper.charCodeAt(0) - 65;
    return rotor[index];
}
// 2) Mini-enigma (1 rotor): TAM -> reflektor -> ZPET + posuv rotoru po znaku
function enigma(znak) {
    var n = normalizeAZ(znak);
    if (n.kind === "passthrough")
        return n.value;
    // mapovani vstupu na index 0..25
    var index = n.upper.charCodeAt(0) - 65;
    // cesta TAM: rotor[index] -> znak
    var znakTam = rotor[index];
    // reflektor: reflektor[index(znakTam)]
    var indexRefl = znakTam.charCodeAt(0) - 65;
    var znakRefl = reflektor[indexRefl];
    // cesta ZPET: najdi pozici znaku z reflektoru v rotoru
    var indexZpet = rotor.indexOf(znakRefl);
    var vystup = String.fromCharCode(indexZpet + 65);
    // mechanicky posuv rotoru (rotace o 1)
    rotor.push(rotor.shift());
    return vystup;
}
function sifrujText(text, mode) {
    var fn = mode === "staticky" ? sifrujStaticky : enigma;
    var out = "";
    for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
        var ch = text_1[_i];
        out += fn(ch);
    }
    return out;
}
window.enigmaDemo = {
    reset: function () { return resetRotor(); },
    stat: function (s) { return sifrujText(s, "staticky"); },
    run: function (s) { return sifrujText(s, "enigma"); },
};
var text = "Hello, World!";
