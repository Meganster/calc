'use strict';

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const config = require('./config');

module.exports = http.createServer((req, res) => {
    let pathname = decodeURI(url.parse(req.url).pathname);

    if (req.method === 'GET') {
        sendFile(config.publicRoot + '/index.html', res);
    }

    if (req.method === 'POST') {
        if (pathname === '/send') {
            let dataFromClient = '';

            // A chunk of data has been recieved.
            req.on('data', (chunk) => {
                dataFromClient += chunk;
            });

            // The whole response has been received.
            req.on('end', () => {
                dataFromClient = JSON.parse(dataFromClient);

                res.statusCode = 200;

                try {
                    if (!isNumber(dataFromClient.x) || !isNumber(dataFromClient.y)) {
                        throw(new Error());
                    }

                    let result = calculate(
                        parseFloat(dataFromClient.x),  
                        parseFloat(dataFromClient.y), 
                        dataFromClient.operation
                    );

                    if (!isNaN(parseFloat(result)) && isFinite(result)) {
                        let json = JSON.stringify({"result": result});
                        res.end(json);
                    } else {
                        throw(new Error());
                    }
                } catch (error) {
                    let json = JSON.stringify({"result": "error"});
                    res.end(json);
                }
            });
        }
    }
});

function calculate(x, y, operationStr) {
    switch(operationStr) {
        case '+':
            return x + y;
        case '-':
            return x - y;
        case '*':
            return x * y;
        case '/':
            return x / y;

        default: 
            throw(new Error());
    }
}

function isNumber(n) {
     return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
} 

function sendFile(filepath, res) {
    let fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream
        .on('open', () => {
            res.setHeader('Content-Type', mime.lookup(filepath));
        });

    res
        .on('close', () => {
            fileStream.destroy();
        });
}
