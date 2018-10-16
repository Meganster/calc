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
                    if(isNaN(dataFromClient.x) || isNaN(dataFromClient.y)) {
                        throwError();
                    }

                    let result = eval(dataFromClient.x + dataFromClient.operation + dataFromClient.y);

                    if (!isNaN(result)) {
                        let json = JSON.stringify({"result": result});
                        res.end(json);
                    } else {
                        throwError();
                    }
                } catch (error) {
                    console.log(error);

                    let json = JSON.stringify({"result": "error"});
                    res.end(json);
                }
            });
        }
    }
});

function sendFile(filepath, res) {
    let fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream
        .on('error', err => {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end('Not found');
            } else {
                console.error(err);
                if (!res.headersSent) {
                    res.statusCode = 500;
                    res.end('Internal error');
                } else {
                    res.end();
                }

            }
        })
        .on('open', () => {
            res.setHeader('Content-Type', mime.lookup(filepath));
        });

    res
        .on('close', () => {
            fileStream.destroy();
        });
}
