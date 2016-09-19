'use strict';

const CronJob = require('cron').CronJob;
const https = require('https');
const notifier = require('node-notifier');

const stockUrl = 'https://reserve.cdn-apple.com/GB/en_GB/reserve/iPhone/availability.json';


new CronJob('*/2 * * * *', function() {
    https.get(stockUrl, res => {
        let body = '';
        res.on('data', chunk => {
            body += chunk;
        });
        res.on('end', () => {
            try {
                const stock = JSON.parse(body);
                if (stock && typeof stock === 'object') {
                    getStock(stock);
                } else {
                    console.log('Not a JSON object');
               }
            } catch (e) {
                console.log('Failed to parse feed: ', e);
            }
        });
    }).on('error', e => {
        console.log(`HTTP error for URL ${stockUrl}: `, e);
    });
}, null, true);

function getStock(stock) {
    const whiteCity = stock.R226;
    if (whiteCity) {
        checkInStore(whiteCity);
    } else {
        console.log('Store not found');
    }
}

function checkInStore(store) {
    if (inStock(store['MN4V2B/A'])) {
        alertMe('Jet Black Plus 128G in stock!');
    }
    if (inStock(store['MNQM2B/A'])) {
        alertMe('Black Plus 32G in stock!');
    }
    if (inStock(store['MN962B/A'])) {
        alertMe('Jet Black 128G in stock!');
    }
    if (inStock(store['MN8X2B/A'])) {
        alertMe('Black 32G in stock!');
    }
}

function alertMe(message) {
    notifier.notify({
        'title': 'Apple Store',
        'message': message,
        'open': 'https://reserve-gb.apple.com/GB/en_GB/reserve/iPhone?execution=e1s1'
    });
}

function inStock(item) {
    if (item && item !== 'NONE') {
        return true;
    }
    return false;
}
