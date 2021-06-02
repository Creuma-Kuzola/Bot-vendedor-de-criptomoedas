const ENDPOINT_API = 'https://www.mercadobitcoin.net/api/';
const ENDPOINT_TRADE_API = 'https://www.mercadobitcoin.net'+ ENDPOINT_TRADE_PATH;
const ENDPOINT_TRADE_PATH = '/tapi/v3/';

const axios = require('axios');
const qs = require('querystring');
const crypto = require('crypto');

class MercadoBitcoinTrade{

    constructor(config){
        this.config = {
            KEY: config.key,
            SECRET: config.secret,
            PIN: config.pin,
            CURRENCY: config.currency
        }
    }

    async call(method, parameters){
        const now = new Date().getTime();
        let queryString = qs.stringify({tapi_method:method, tapi_nonce:now});
        
        if(parameters) {
            queryString += `&${qs.stringify(parameters)}`;
        }

        const signature = crypto.createHmac('sha512', this.config.SECRET)
            .update(`${ENDPOINT_TRADE_PATH}?${queryString}`)
            .disgest('hex');

        const config = {

            headers: {
                'TAPI-ID': this.config.KEY,
                'TAPI-MAC':signature
            }
        }
        
        const response = await axios.post(ENDPOINT_TRADE_API, queryString, config)
    }
}

class MercadoBitcoin{

    constructor(config){
        this.config = {
            CURRENCY: config.currency
        }
    }

    ticker (){

        return this.call('ticker');
    }

    async call(method){
       
        const config = {
            headers: {
                'Accept': 'application/json'
            }
        }

        try {
            
            const response = await axios.get(ENDPOINT_API + this.config.CURRENCY + '/' + method)
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
        
    }
}

 module.exports ={
    MercadoBitcoin 
 } 