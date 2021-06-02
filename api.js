const axios = require('axios');
const ENDPOINT_API = 'https://www.mercadobitcoin.net/api/'

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

 module.exports = MercadoBitcoin;