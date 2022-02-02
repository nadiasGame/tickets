const express = require ('express');
const app = express ();
const jwt = require('jsonwebtoken');

const { getAccountByUsername, saveAccount, saveTicket, getTicket } = require('./database/operations');
const { hashPassword, comparePassword } = require('./utils/bcrypt'); 


app.use(express.static('../frontend'));
app.use(express.json());

saveTicket();

app.post('/api/auth/create',async (request,response)=>{
    const credentials = request.body;
    //username:'nadia ,password:'pwd123'
    const resObj ={
        success:true,
        usernameExists:false
    }
    const usernameExists = await getAccountByUsername (credentials.username);

    if (usernameExists.length > 0){
        resObj.usernameExists = true,
        resObj.success =false;
    }
    if (resObj.usernameExists ==false){
        const hashedPassword = await hashPassword (credentials.password);
         credentials.password =hashedPassword;

         saveAccount (credentials);
        
    }
    response.json(resObj);

});

app.post('/api/auth/login', async (request, response) => {
    const credentials = request.body;
    //{ username: 'ada', password: 'pwd123' }

    const resObj = {
        success: false,
        token: ''
    }

    const account = await getAccountByUsername(credentials.username);
    console.log(account);

    if (account.length > 0) {
        const correctPassword = await comparePassword(credentials.password, account[0].password);
        if (correctPassword) {
            resObj.success = true;

            // Vår token blir krypterad med vårt användarnamn som kopplar token till en användare
            const token = jwt.sign({ username: account[0].username }, 'a1b1c1', {
                expiresIn: 600 // Går ut om 10 min (värdet är i sekunder)
            });

            resObj.token = token;
        }
    }

    response.json(resObj);
});

app.get('/api/ticket/menu', async (request, response) => {
    const token = request.headers.authorization.replace('Bearer ', '');
    
    const resObj = {
        success: false,
        menu: ''
    }

    try {
        const data = jwt.verify(token, 'a1b1c1');
        const ticketMenu = await getTicket();

        resObj.menu = ticketMenu[0];
        resObj.success = true;

    } catch (error) {
        resObj.errorMessage = 'Token invalid';
    }

    response.json(resObj);
});















app.listen(4000,()=>{
    console.log('server started');
});