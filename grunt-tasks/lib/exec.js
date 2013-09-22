module.exports = function(cmd, options, callback) {
	require("child_process").exec(cmd, options, function(error, stdout, stderr) {
		if (stdout) {
			//console.log(stdout);
		}
		if (stderr) {
			console.log('exec stderr: ' + stderr);
		}

		if (error !== null) {
			console.log('exec error: ' + error);
		}

		callback();
	});

	/*var cp = require("child_process").spawn("cmd.exe", ["\s", "\c", cmd]);
	cp.stdout.on("data", function (data) {
		console.log(String(data));
	});
	cp.stderr.on("data", function (data) {
		console.error(String(data));
	});
	cp.on("close", function () {
		callback();
	});*/
};
