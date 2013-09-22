module.exports = function(grunt) {
	grunt.loadTasks("grunt-tasks");
	grunt.loadNpmTasks("grunt-cmd-transport");
	grunt.loadNpmTasks("grunt-cmd-concat");
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", ["main"]);

	grunt.initConfig(require("./grunt-tasks/lib/base-config"));

	var changedFile = null;
	var onChange = grunt.util._.debounce(function() {
		grunt.config("pub.options.cwd", changedFile);
		changedFile = null;
	}, 200);
	grunt.event.on('watch', function(action, filepath) {
		filepath = filepath.replace(/(\/|\\)src(\/|\\).*$/, "");
		changedFile = filepath;
		onChange();
	});
};
