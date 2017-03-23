const path = require('path');
const os = require('os');
const fs = require('fs');

function dataFileLocation() {
	return path.join(os.homedir(), '.habla.json');
}

exports.load = function () {
	const stats = fs.statSync(dataFileLocation());
	if (!stats.isFile()) return {};
	return JSON.parse(fs.readFileSync(dataFileLocation(), 'utf-8'));
};

exports.save = function (data) {
	fs.writeFileSync(dataFileLocation(), JSON.stringify(data, null, 4), 'utf-8');
};
