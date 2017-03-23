const path = require('path');
const os = require('os');
const fs = require('fs');

function dataFileLocation() {
	return path.join(os.homedir(), '.habla.json');
}

exports.load = function () {
	try {
		return JSON.parse(fs.readFileSync(dataFileLocation(), 'utf-8'));
	} catch (e) {
		return {};
	}
};

exports.save = function (data) {
	fs.writeFileSync(dataFileLocation(), JSON.stringify(data), 'utf-8');
};
