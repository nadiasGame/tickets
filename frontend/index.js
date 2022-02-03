const menuElem = document.querySelector('#menu');
const orderButton = document.querySelector('#order-button');
const orderNumberElem = document.querySelector('#order-number');
const etaElem = document.querySelector('#eta');

async function order(order) {
    const token = sessionStorage.getItem('token');

    const response = await fetch('http://localhost:4000/api/event/order', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);

    if (data.success) {
        // Visar ordernummer och leveranstid (ETA);
        orderNumberElem.innerHTML = `Ordernummer: ${data.orderNr}`;
        etaElem.innerHTML = `Leveranstid: ${data.eta} minuter`;
    }
}

function showMenu(menu) {
    // Loopa igenom menyn och för varje menyalternativ:
    // 1. Skapa en li-tagg
    // 2. I li-taggen lägg till namn och pris
    // 3. Lägg till li-taggen i menuElem (ul-taggen)
    menu.forEach((menuItem) => {
        const itemElem = document.createElement('li');
        itemElem.classList.add('menu-item'); // Sätter en css-klass på min li-tagg som är definerad i styles.css
        itemElem.innerHTML = `<span>${menuItem.title}</span><span>${menuItem.price} kr</span>`;
        menuElem.append(itemElem);

        itemElem.addEventListener('click', () => { // Kopplar en eventlistener till varje li-tagg
            order(menuItem); // Gör ett fetch-anrop och skickar med vilken kaffe jag valt
        });
    });
}

async function getMenu() {
    const token = sessionStorage.getItem('token');
    console.log(token);
    const response = await fetch('http://localhost:4000/api/event/menu', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    console.log(data);

    if (data.success) {
        // Visa meny
        showMenu(data.menu.menu);
    } else {
        window.location.href = 'http://localhost:4000/index.html';
    }
}

orderButton.addEventListener('click', () => {
    order();
});

getMenu();

