require('dotenv-safe').config();

const { MercadoBitcoin, MercadoBitcoinTrade } = require('./api');
const infoApi = new MercadoBitcoin({ currency: 'BTC' });
const decimals = "000000000000000000"

const tradeApi = new MercadoBitcoinTrade({
    privateKey: process.env.PRIVATE_KEY,
    accountSecret: process.env.ACCOUNT_NUMBER,
    studentId: process.env.STUDENT_ID,
    name: process.env.NAME
})

async function getQuantity(coin, price, isBuy) {
    price = parseFloat(price);
    coin = isBuy ? 'brl' : coin.toLowerCase();
    const data = await tradeApi.balance();
    //const balance = BigNumber(data.balances[coin]);


    /*if (!isBuy) return balance;

    if (isBuy && balance < 100) return console.error('Saldo insuficiente para comprar');
    console.log(`Saldo disponivel de ${coin}: ${balance}`);

    let qty = 0;
    if (isBuy) qty = parseFloat((balance / price).toFixed(8));
    return qty - 0.000000001;*/
}
let flagOrderPlaced = false
let quantTransacoes = 0;

setInterval(async() => {

    if (flagOrderPlaced == false) {
        let targetTokenName = "UCANU";
        let offeredTokenName = "UCANA";

        console.log("Colocando Ordem de compra, na exchange ... ")
        let responseBuyOrder = (await tradeApi.placeBuyOrder(targetTokenName, offeredTokenName, "400" + decimals, "400" + decimals));
        responseBuyOrder = responseBuyOrder.orders[responseBuyOrder.orders.length - 1];

        //const responseBuyOrder = await tradeApi.placeSellOrder("UCANA", "UCANU", "400" + decimals, "400" + decimals);

        console.log("Ordem de compra colocada");

        const intervalID = setInterval(async() => {
                if (!responseBuyOrder.isCompleted) {
                    const buyOrders = await tradeApi.getMyBuyOrders();


                    for (let i = 0; i < buyOrders.buyOrders.length; i++) {
                        if (buyOrders.buyOrders[i].id == responseBuyOrder.id) {
                            responseBuyOrder = buyOrders.buyOrders[i];

                            if (buyOrders.buyOrders[i].isCompleteted == true) {
                                flagOrderPlaced = false;
                                quantTransacoes += 1;

                                if (quantTransacoes >= 3) {
                                    targetTokenName = "UCANE";
                                    offeredTokenName = "UCANU";
                                }
                                clearInterval(intervalID);
                                break;
                            }
                            i = buyOrders.buyOrders.length;
                        }
                    }
                } else {
                    flagOrderPlaced = false;
                    clearInterval(intervalID);
                    quantTransacoes += 1;

                    if (quantTransacoes >= 3) {
                        targetTokenName = "UCANE";
                        offeredTokenName = "UCANU";
                    }
                }
            },
            3000)



        /*console.log("\n===================================================\n");

        console.log("Saldo actual:")
        const balance = await tradeApi.balance();
        console.log(balance)*/

        flagOrderPlaced = true;
    } else {
        console.log("Aguardando finalizar a order colocada");
    }






    /*console.log(response);

                    if (response.ticker.sell > 33900) {
                        return console.log('Ta caro, aguardar');
                    }

                    try {
                        const qty = await getQuantity('BRL', response.ticker.sell, true)
                            //const data = await tradeApi.placeBuyOrder(qty, response.ticker.sell);
                        console.log(qty);
                        const buyPrice = parseFloat(response.ticker.sell);
                        const profitability = parseFloat(process.env.PROFITABILITY); //LUCRO QUE EU PRETENDO GANHAR EM CADA COMPRA
                        const data2 = await tradeApi.placeSellOrder(data.quantity, buyPrice * profitability);

                    } catch (error) {

                    }
    */
}, process.env.CRAWLER_INTERVAL)