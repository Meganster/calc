const server = require('../server.js');
const fs = require('fs-extra');
const assert = require('assert');
const { COPYFILE_EXCL } = fs.constants;
const http = require('http');

describe('GET request', () => {
	let app;
	before((done) => {
		app = server.listen(3333, () => {
			done();
		});
	});


    it('Should return index.html', (done) => {
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

     it('Should return error 404', (done) => {
        return http.get('http://localhost:3333/norm.txt', (resp) => {
			if (resp.statusCode !== 404) {
			    console.log("Server response with status " + resp.statusCode);
				assert(false);
				done();
			}

			done();
		}).on("error", (err) => {
            console.log("Error in GET request http://localhost:3333/norm.txt!");
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
