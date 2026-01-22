var rotor = "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split("");
function sifrujStaticky(z) {
    var index = z.charCodeAt(0) - 65; //Mapovani ASCII na index pole rotoru  
    var znak = rotor[index];
    rotor.push(rotor.shift()); //Posun rotoru o jednu pozici
    return znak;
}
var text = "Hello, World!";
