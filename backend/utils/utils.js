function generateOrderNr() {
    const letters = ['X','Y','Z' ];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)]; // Slumpar en av bokstäverna X, Y eller Z
    const randomNumber = Math.floor(Math.random() * 10000); // Slumpar ett tal mellan 0 och 10 000
    return `AB${randomNumber}${randomLetter}`; // Sätter ihop det till ett ordernummer
}

function generateETA() {
    let eta = 10;
    return eta + Math.floor(Math.random() * 20); // Slumpar ett tal som blir leveranstiden
}

module.exports = { generateOrderNr, generateETA }