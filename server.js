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
        if (pathname === '/') {
            sendFile(config.publicRoot + '/index.html', res);
        } else {
            let filepath = path.join(config.filesRoot, filename);
            sendFile(filepath, res);
        }
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
                  console.log(dataFromClient);
              });

              res.statusCode = 200;
        }
    }
});


function receiveFile(filepath, req, res) {

    // non-streaming client sends ctx
    if (req.headers['content-length'] > config.limitFileSize) {
        res.statusCode = 413;
        res.end('File is too big!');
        return;
    }

    let size = 0;

    let writeStream = new fs.WriteStream(filepath, {flags: 'wx'});

    req
        .on('data', chunk => {
            size += chunk.length;

            if (size > config.limitFileSize) {
                // early connection close before recieving the full request

                res.statusCode = 413;

                // if we just res.end w/o connection close, browser may keep on sending the file
                // the connection will be kept alive, and the browser will hang (trying to send more data)
                // ctx header tells node to close the connection
                // also see http://stackoverflow.com/questions/18367824/how-to-cancel-http-upload-from-data-events/18370751#18370751
                res.setHeader('Connection', 'close');

                // Some browsers will handle this as 'CONNECTION RESET' error
                res.end('File is too big!');

                writeStream.destroy();
                fs.unlink(filepath, err => { // eslint-disable-line
                    /* ignore error */
                });

            }
        })
        .on('close', () => {
            writeStream.destroy();
            fs.unlink(filepath, err => { // eslint-disable-line
                /* ignore error */
            });
        })
        .pipe(writeStream);

    writeStream
        .on('error', err => {
            if (err.code === 'EEXIST') {
                res.statusCode = 409;
                res.end('File exists');
            } else {
                console.error(err);
                if (!res.headersSent) {
                    res.writeHead(500, {'Connection': 'close'});
                    res.end('Internal error');
                } else {
                    res.end();
                }
                fs.unlink(filepath, err => { // eslint-disable-line

                });
            }

        })
        .on('close', () => {
            res.end('OK');

        });
}

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
