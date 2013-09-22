module.exports = function (grunt) {
	var path = require("path");
	var fs = require("fs");
	var util = require("./lib/util")(grunt);

	grunt.registerTask("main", "main task", function () {
		var cwd = "./";
		if (arguments) {
			for (var i = 0; i < arguments.length; i++) {
				cwd = path.join(cwd, arguments[i]);
			}
		}

		var targets = [];

		(function recurse (cwd) {
			var stat = fs.statSync(cwd);
			if (stat && stat.isDirectory()) {
				if (fs.existsSync(path.join(cwd, "src")) && fs.existsSync(path.join(cwd, "package.json"))) {
					util.log("main", "found target:", cwd);
					targets.push(cwd);
				} else {
					fs.readdirSync(cwd).forEach(function (sub) {
						recurse(path.join(cwd, sub));
					});
				}
			}
		})(cwd);

		var args = targets.map(function (target) {
			return target.replace(/[\\|\/]/, ":");
		});

		var done = this.async();

		(function pub () {
			if (args.length) {
				var cmd = "grunt pub:" + args.shift() + " --force";
				util.log("main", "executing:", cmd)
				util.exec(cmd, {
					maxBuffer: 1024 * 1024
				}, function () {
					util.log("main", "execute:", cmd, " done");
					if (args.length) {
						pub();
					} else {
						done();
					}
				})
			} else {
				done();
			}
		})();
	});
}