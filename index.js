require('dotenv-safe').config();

const { MercadoBitcoin, MercadoBitcoinTrade } = require('./api');
const infoApi = new MercadoBitcoin({currency: 'BTC'});
const tradeApi = new MercadoBitcoinTrade({

    currency: 'BTC',
    key: process.env.KEY, 
    secret: process.env.SECRET,
    pin: process.env.PIN
})

async function getQuantity(coin, price, isBuy){

    price = parseFloat(price);
    coin = isBuy ? 'brl' : coin.toLowerCase();
    const data = await tradeApi.getAccountInfo();
    const balance = parseFloat(data.balance[coin].available).toFixed(8);

    if(!isBuy) return balance;

    if(isBuy && balance < 100) return console.error('Saldo insuficiente para comprar');
    console.log(`Saldo disponivel de ${coin}: ${balance}`);

    let qty = 0;
    if(isBuy) qty = parseFloat((balance/price).toFixed(8));
    return qty - 0.000000001;
}

setInterval( async() =>{
    const response = await infoApi.ticker();
    console.log(response);

    if(response.ticker.sell > 33900){
        return console.log('Ta caro, aguardar');  
    }

    try {
      const qty = await getQuantity('BRL', response.ticker.sell,true)
      //const data = await tradeApi.placeBuyOrder(qty, response.ticker.sell);
      console.log(qty);
      const buyPrice = parseFloat(response.ticker.sell);
      const profitability = parseFloat(process.env.PROFITABILITY); //LUCRO QUE EU PRETENDO GANHAR EM CADA COMPRA
      const data2 = await tradeApi.placeSellOrder(data.quantity, buyPrice * profitability);
      
    } catch (error) {
        
    }  

}, process.env.CRAWLER_INTERVAL)