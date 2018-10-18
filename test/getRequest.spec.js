'use strict';

const server = require('../server.js');
const fs = require('fs-extra');
const assert = require('assert');
const {COPYFILE_EXCL} = fs.constants;
const http = require('http');
const fetch = require('node-fetch');

describe('POST request', () => {
    let app;
    before((done) => {
        app = server.listen(3333, () => {
            done();
        });
    });

    it('Delim for zero', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: 1,
                y: 1,
                operation: '/'
            })
        }).then(
            (res) => {
                res.json().then(
                    (body) => {
                        console.log(body);

                        assert(body.result === 1);
                        done();
                    },
                    () => assert(false)
                );
            },
            (err) => {
                assert(false);
            }
        );
    });

    // it('Should return error 404', (done) => {
    //     return http.get('http://localhost:3333/norm.txt', (resp) => {
    //         if (resp.statusCode !== 404) {
    //             console.log("Server response with status " + resp.statusCode);
    //             assert(false);
    //             done();
    //         }
    //
    //         done();
    //     }).on("error", (err) => {
    //         console.log("Error in GET request http://localhost:3333/norm.txt!");
    //         assert(false);
    //         done();
    //     });
    // });

    after((done) => {
        app.close(() => {
            done();
        });
    });

});
