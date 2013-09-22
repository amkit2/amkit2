module.exports = function (grunt) {
	var util = require("./lib/util")(grunt);

	var ALIAS_REG = /\/|\\/;

	grunt.registerMultiTask("install", "install dependencies", function () {
		var alias = grunt.config.data.pkg.spm.alias;
		var a = [];

		var output = this.data.output;

		var done = this.async();

		for (var key in alias) {
			var result = alias[key].split(ALIAS_REG);
			if (result && result.length === 4) {
				a.push(result[0] + "/" + result[1] + "@" + result[2]);
			} else {
				a.push(alias[key]);
			}
		}

		(function install () {
			var dep = a.shift();
			util.log("install", "installing <", dep, ">...");
			var cmd = "spm install " + dep;
			if (output) {
				cmd += " -d " + output;
			}
			util.exec(cmd, {
				"cwd": "."
			}, function () {
				util.log("install", "install <", dep, "> done");
				if (a.length) {
					setTimeout(install, 100);
				} else {
					done();
				}
			});
		})();
	});
};