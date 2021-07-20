const TRADE_API = 'http://127.0.0.1:3001/';


const axios = require('axios');
const qs = require('querystring');
const crypto = require('crypto');
const defaultDecimalPlace = '000000000000000000';

class MercadoBitcoinTrade {
    constructor(config) {
        this.config = {
            PRIVATE_KEY: config.privateKey,
            ACCOUNT_NUMBER: config.accountSecret,
            STUDENT_ID: config.studentId,
            NAME: config.name
        }
    }

    balance() {
        return this.call('GET', 'balance/' + this.config.STUDENT_ID, {
            "idConta": this.config.ACCOUNT_NUMBER,
            "privateKey": this.config.PRIVATE_KEY
        })
    }

    exchangePrices() {
        return this.call('GET', 'exchange', {
            "idConta": this.config.ACCOUNT_NUMBER
        })
    }

    getExchangeBuyOrders() {
        return this.call('GET', 'getBuyOrders', {})
    }

    getExchangeSellOrders() {
        return this.call('GET', 'getSellOrders', {})
    }

    getMyBuyOrders() {
        return this.call('GET', 'getBuyOrders/' + this.config.ACCOUNT_NUMBER, {
            "privateKey": this.config.PRIVATE_KEY
        })
    }

    getMySellOrders() {
        return this.call('GET', 'getSellOrders/' + this.config.ACCOUNT_NUMBER, {
            "idConta": this.config.ACCOUNT_NUMBER,
            "privateKey": this.config.PRIVATE_KEY
        })
    }

    placeBuyOrder(targetTokenName, offeredTokenName, quantTokensOffered, quantTokensTarget) {
        return this.call('POST', 'placeOrder', {
            "idEstudante": this.config.STUDENT_ID,
            "idConta": this.config.ACCOUNT_NUMBER,
            "privateKey": this.config.PRIVATE_KEY,
            "targetTokenName": targetTokenName,
            "offeredTokenName": offeredTokenName,
            "quantTokensOffered": quantTokensOffered,
            "quantTokensTarget": quantTokensTarget,
            "orderType": 1
        })
    }

    placeSellOrder(targetTokenName, offeredTokenName, quantTokensOffered, quantTokensTarget) {
        return this.call('POST', 'placeOrder', {
            "idEstudante": this.config.STUDENT_ID,
            "idConta": this.config.ACCOUNT_NUMBER,
            "privateKey": this.config.PRIVATE_KEY,
            "targetTokenName": targetTokenName,
            "offeredTokenName": offeredTokenName,
            "quantTokensOffered": quantTokensOffered,
            "quantTokensTarget": quantTokensTarget,
            "orderType": 0
        })
    }

    exchangeMarketMoviment() {
        return this.call('GET', 'exchangeMarketMoviment', {})
    }

    ticker() {
        return this.call('GET', 'exchangeMarketMoviment', {})
    }

    async call(method, endPoint, bodyData) {
        const response = await axios({
            url: endPoint,
            method: method, // default
            baseURL: TRADE_API,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            data: bodyData,
        });

        console.log('response', response.data);
        return response.data;
    }
}


class MercadoBitcoin {

    constructor(config) {
        this.config = {
            CURRENCY: config.currency
        }
    }

    ticker() {
        return this.call('ticker');
    }

    async call(method) {

        const config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        try {
            const response = await axios.get(TRADE_API + this.config.CURRENCY + '/' + method)
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }

    }
}

module.exports = {
    MercadoBitcoin,
    MercadoBitcoinTrade
}