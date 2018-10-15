const server = require('../server.js');
const request = require('request-promise');
const config = require('../config/index.js');
const fs = require('fs-extra');
const assert = require('assert');
const { COPYFILE_EXCL } = fs.constants;

describe('GET request', () => {
	let app;
	before((done) => {
		app = server.listen(3333, () => {
			done();
		});
	});
	

	// Написать тесты на
	// get запрос к http://localhost:3333  => вернет index.html
	// get запрос к http://localhost:3333/file.txt => вернет file.txt
	after((done) => {
		app.close(() => {
		done();
		});
	});

});
