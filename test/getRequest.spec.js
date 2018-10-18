'use strict';

const server = require('../server.js');
const fs = require('fs-extra');
const assert = require('assert');
const {COPYFILE_EXCL} = fs.constants;
const http = require('http');
const fetch = require('node-fetch');

describe('Calculator testing', () => {
    let app;
    before((done) => {
        app = server.listen(3333, () => {
            done();
        });
    });

    it('0 + 0 = 0', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: 0,
                y: 0,
                operation: '+'
            })
        }).then(
            (res) => {
                res.json().then(
                    (body) => {
                        assert(body.result === 0);
                        done();
                    },
                    () => {
                        assert(false);
                        done();
                    }
                );
            },
            (err) => {
                assert(false);
                done();
            }
        );
    });

    it('0 - 0 = 0', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: 0,
                y: 0,
                operation: '-'
            })
        }).then(
            (res) => {
                res.json().then(
                    (body) => {
                        assert(body.result === 0);
                        done();
                    },
                    () => {
                        assert(false);
                        done();
                    }
                );
            },
            (err) => {
                assert(false);
                done();
            }
        );
    });

    it('0 * 0 = 0', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: 0,
                y: 0,
                operation: '*'
            })
        }).then(
            (res) => {
                res.json().then(
                    (body) => {
                        assert(body.result === 0);
                        done();
                    },
                    () => {
                        assert(false);
                        done();
                    }
                );
            },
            (err) => {
                assert(false);
                done();
            }
        );
    });

    it('0 / 0 = error', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: 0,
                y: 0,
                operation: '/'
            })
        }).then(
            (res) => {
                res.json().then(
                    (body) => {
                        assert(body.result === "error");
                        done();
                    },
                    () => {
                        assert(false);
                        done();
                    }
                );
            },
            (err) => {
                assert(false);
                done();
            }
        );
    });

    it('0 / 1 = 0', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: 0,
                y: 1,
                operation: '/'
            })
        }).then(
            (res) => {
                res.json().then(
                    (body) => {
                        assert(body.result === 0);
                        done();
                    },
                    () => {
                        assert(false);
                        done();
                    }
                );
            },
            (err) => {
                assert(false);
                done();
            }
        );
    });

    it('10 / 1 = 10', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: 10,
                y: 1,
                operation: '/'
            })
        }).then(
            (res) => {
                res.json().then(
                    (body) => {
                        assert(body.result === 10);
                        done();
                    },
                    () => {
                        assert(false);
                        done();
                    }
                );
            },
            (err) => {
                assert(false);
                done();
            }
        );
    });

    after((done) => {
        app.close(() => {
            done();
        });
    });
});
