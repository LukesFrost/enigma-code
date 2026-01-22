const rotor = "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split("");
function sifrujStaticky(z:string):string {
    let index = z.charCodeAt(0) - 65; //Mapovani ASCII na index pole rotoru  
    let znak = rotor[index];
    rotor.push(rotor.shift()!); //Posun rotoru o jednu pozici
    return znak;
}

const text:string = "Hello, World!";















