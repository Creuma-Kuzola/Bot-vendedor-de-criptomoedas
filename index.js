require('dotenv-safe').config();

setInterval(() =>{

    console.log('ping');

}, process.env.CRAWLER_INTERVAL)