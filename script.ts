const ROTOR_INIT: string[] = "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split("");
const REFLEKTOR: string[] = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split("");

let aktualniRotor: string[] = [...ROTOR_INIT];

function normalizujText(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .toUpperCase();
}

function sifrujStaticky(vstup: string): string {
    let vystup = "";
    const statickyRotor = [...ROTOR_INIT]; 

    const normalizovanyVstup = normalizujText(vstup);

    for (let i = 0; i < normalizovanyVstup.length; i++) {
        const znak = normalizovanyVstup[i];
        const kodZnaku = znak.charCodeAt(0);

        if (kodZnaku >= 65 && kodZnaku <= 90) {
            const index = kodZnaku - 65;
            vystup += statickyRotor[index];
        } else {
            vystup += znak;
        }
    }
    return vystup;
}

function enigma(vstup: string): string {
    let vystup = "";
    const normalizovanyVstup = normalizujText(vstup);

    for (let i = 0; i < normalizovanyVstup.length; i++) {
        const znak = normalizovanyVstup[i];
        const kodZnaku = znak.charCodeAt(0);

        if (kodZnaku >= 65 && kodZnaku <= 90) {
            
            const indexVstup = kodZnaku - 65;

            const znakTam = aktualniRotor[indexVstup];
            
            const indexProReflektor = znakTam.charCodeAt(0) - 65;
            const znakRefl = REFLEKTOR[indexProReflektor];

            const indexZpet = aktualniRotor.indexOf(znakRefl);

            const vyslednyZnak = String.fromCharCode(indexZpet + 65);
            vystup += vyslednyZnak;

            const prvniPrvek = aktualniRotor.shift();
            if (prvniPrvek) {
                aktualniRotor.push(prvniPrvek);
            }

        } else {
            vystup += znak;
        }
    }
    return vystup;
}

function resetujStroj(): void {
    aktualniRotor = [...ROTOR_INIT];
    console.log("--- Enigma resetována do základní polohy ---");
    alert("Rotor byl vrácen do výchozí polohy.");
}

console.log("--- TEST ZADÁNÍ 1 (Statická substituce) ---");
console.log("Vstup: AAAA");
console.log("Očekáváno: EEEE");
console.log("Realita: " + sifrujStaticky("AAAA"));

console.log("\n--- TEST ZADÁNÍ 2 (Enigma s rotací) ---");
aktualniRotor = [...ROTOR_INIT]; 
console.log("Vstup: AAAA");
console.log("Očekáváno: HJKP");
console.log("Realita: " + enigma("AAAA"));

console.log("\n--- TEST RECIPROCITY (Dešifrování) ---");
aktualniRotor = [...ROTOR_INIT];
console.log("Vstup (šifra): HJKP");
console.log("Očekáváno: AAAA");
console.log("Realita: " + enigma("HJKP"));

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