module.exports = {
	watch: {
		"src": {
			files: ['**/src/**/*.js', '**/src/**/*.css', '**/src/**/*.handlebars'],
			tasks: ["pub"],
			options: {
				spawn: false,
			},
		}
	},
	pub: {
		options: {
			cwd: ""
		}
	}
};
