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

    it('str / 1 = error', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: "str",
                y: 1,
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

    it('str + 132525 = error', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                y: 132525,
                x: "str",
                operation: '+'
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

    it('912 * str = error', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: 912,
                y: "str",
                operation: '*'
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

    it('str1214 + str = error', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: "str1214",
                y: "str",
                operation: '+'
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

    it('str1214 - spaosa = error', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: "str1214",
                y: "spaosa",
                operation: '-'
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

    it('str1214 * spaosa = error', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: "str1214",
                y: "spaosa",
                operation: '*'
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

    it('str1214 / spaosa = error', (done) => {
        fetch(`http://localhost:3333/send`, {
            method: "POST",
            body: JSON.stringify({
                x: "str1214",
                y: "spaosa",
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

    it('Should return base index.html', (done) => {
        return http.get('http://localhost:3333', (resp) => {
            let dataFromServer = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                dataFromServer += chunk;
            });

            // The whole response has been received.
            resp.on('end', () => {
                assert(dataFromServer.length != 0);

                fs.readFile("./public/index.html", 'utf-8', function (err, indexFile) {
                    if (err) {
                        console.log("Error read file ./public/index.html!");
                        assert(false);
                        done();
                    }

                    assert(dataFromServer.localeCompare(indexFile) === 0);
                    done();
                });
            });
        }).on("error", (err) => {
            console.log("Error in GET request http://localhost:3333!");
            assert(false);
            done();
        });
    });


    after((done) => {
        app.close(() => {
            done();
        });
    });
});