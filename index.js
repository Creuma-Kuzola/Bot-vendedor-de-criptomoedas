require('dotenv-safe').config();

const { MercadoBitcoin } = require('./api');
const infoApi = new MercadoBitcoin({currency: 'BTC'});

setInterval( async() =>{
    const response = await infoApi.ticker();
    console.log(response);

    if(response.ticker.sell > 33900){
        return console.log('Ta caro, aguardar');  
    }
    else{
        return console.log('Ta barato, comprar');  
    }

}, process.env.CRAWLER_INTERVAL)