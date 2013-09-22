module.exports = function(grunt) {
	var path = require("path");
	var util = require("./lib/util")(grunt);

	grunt.registerTask("pub", "pub a amkit module", function() {
		var cwd = "";
		if (this.options().cwd) {
			grunt.initConfig(require("./lib/config")(grunt, this.options().cwd));
			grunt.task.run(["clean:target", "copy:temp", "transport:target", "concat:target", "uglify:target", "cssmin:target", "clean:temp", "clean:deploy", "copy:deploy"]);
		} else {
			if (arguments) {
				for (var i = 0; i < arguments.length; i++) {
					cwd = path.join(cwd, arguments[i]);
				}
			}
			grunt.initConfig(require("./lib/config")(grunt, cwd));
			grunt.task.run(["clean:target", "install:target", "copy:temp", "transport:target", "concat:target", "uglify:target", "cssmin:target", "clean:temp", "install:deploy", "clean:deploy", "copy:deploy"]);
		}
	});
};
