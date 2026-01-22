// Rotor I + Reflektor B (nejpouzivanejsi nastaveni nemecke armady)
const rotorDefault: string[] = "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split("");
const reflektor: string[] = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split("");

// Stav rotoru (bude se otacet). Default nechavame bokem kvuli resetu.
const rotor: string[] = [...rotorDefault];

export function resetRotor(): void {
    rotor.length = 0;
    rotor.push(...rotorDefault);
}

/**
 * Normalizuje vstup na jedno velke pismeno A-Z.
 * - mezery a bezne oddelovace vraci beze zmeny
 * - mala pismena mapuje na velka
 * - znaky mimo A-Z (diakritika, emoji, interpunkce) vraci beze zmeny
 */
function normalizeAZ(ch: string): { kind: "az"; upper: string } | { kind: "passthrough"; value: string } {
    if (!ch) return { kind: "passthrough", value: ch };

    // pokud je to mala/velka latina, udelej velke
    const upper = ch.toUpperCase();
    if (upper.length !== 1) return { kind: "passthrough", value: ch };

    const code = upper.charCodeAt(0);
    const isAZ = code >= 65 && code <= 90;
    if (!isAZ) return { kind: "passthrough", value: ch };

    return { kind: "az", upper };
}

// 1) Staticka substituce (BEZ pohybu rotoru)
export function sifrujStaticky(znak: string): string {
    const n = normalizeAZ(znak);
    if (n.kind === "passthrough") return n.value;

    const index = n.upper.charCodeAt(0) - 65;
    return rotor[index];
}

// 2) Mini-enigma (1 rotor): TAM -> reflektor -> ZPET + posuv rotoru po znaku
export function enigma(znak: string): string {
    const n = normalizeAZ(znak);
    if (n.kind === "passthrough") return n.value;

    // mapovani vstupu na index 0..25
    const index = n.upper.charCodeAt(0) - 65;

    // cesta TAM: rotor[index] -> znak
    const znakTam = rotor[index];

    // reflektor: reflektor[index(znakTam)]
    const indexRefl = znakTam.charCodeAt(0) - 65;
    const znakRefl = reflektor[indexRefl];

    // cesta ZPET: najdi pozici znaku z reflektoru v rotoru
    const indexZpet = rotor.indexOf(znakRefl);
    const vystup = String.fromCharCode(indexZpet + 65);

    // mechanicky posuv rotoru (rotace o 1)
    rotor.push(rotor.shift()!);

    return vystup;
}

export type Mode = "staticky" | "enigma";

export function sifrujText(text: string, mode: Mode): string {
    const fn = mode === "staticky" ? sifrujStaticky : enigma;
    let out = "";
    for (const ch of text) out += fn(ch);
    return out;
}

// Pomucka pro rychle testy v konzoli prohlizece (bez bundleru)
declare global {
    interface Window {
        enigmaDemo?: {
            reset: () => void;
            stat: (s: string) => string;
            run: (s: string) => string;
        };
    }
}

window.enigmaDemo = {
    reset: () => resetRotor(),
    stat: (s: string) => sifrujText(s, "staticky"),
    run: (s: string) => sifrujText(s, "enigma"),
};

const text: string = "Hello, World!";















