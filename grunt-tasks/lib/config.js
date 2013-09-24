module.exports = function(grunt, cwd) {
	var path = require("path");

	var EXCLUDE_REG = /((\\|\/)(grunt-tasks|node_modules|sea-modules|build|dist|src)(\\|\/))|((\\|\/)(Gruntfile.js|package.json))/;

	var util = require("./util")(grunt);
	var pkgPath = path.resolve(cwd, "package.json");
	var pkg = require("./pkg")(grunt, pkgPath);
	var extend = require("extend");
	var baseConfig = require("./base-config");

	var transport = require('grunt-cmd-transport');
	var text = transport.text.init(grunt);
	var script = transport.script.init(grunt);
	var style = transport.style.init(grunt);
	var template = transport.template.init(grunt);

	var deployDir = process.env.AMKIT_DEPLOY_HOME || "../../assert/amkit2";

	return extend(baseConfig, {
		pkg: pkg,
		copy: {
			temp: {
				expand: true,
				cwd: path.join(cwd, "src"),
				src: '**/*',
				dest: path.join(cwd, '<%= pkg.version %>/')
			},
			deploy: {
				expand: true,
				cwd: path.join("sea-modules", cwd, '<%= pkg.version %>/'),
				//src: ['**/*', '!**/*-debug.*'],
				src: ['**/*'],
				dest: path.join(deployDir, "sea-modules", cwd, '<%= pkg.version %>/')
			}
		},
		clean: {
			target: [path.join("sea-modules", cwd, "<%= pkg.version %>")],
			temp: [path.join(cwd, "<%= pkg.version %>")],
			deploy: {
				options: {
					force: true
				},
				src: [path.join(deployDir, "sea-modules", cwd, "<%= pkg.version %>")]
			}
		},
		install: {
			target: {
				output: "."
			},
			deploy: {
				output: path.join(deployDir, "sea-modules")
			}
		},
		transport: {
			options: {
				alias: "<%= pkg.spm.alias %>",
				parsers: {
					'.js': [script.jsParser],
					'.css': [style.css2jsParser],
					'.html': [text.html2jsParser],
					'.tpl': [template.tplParser],
					'.handlebars': [template.handlebarsParser]
				}
			},
			target: {
				options: {
					idleading: cwd[cwd.length - 1] === "/" ? cwd : cwd + "/"
				},
				files: [{
					cwd: cwd,
					src: "**/*",
					filter: function(file) {
						var filePath = path.resolve(file);
						if (EXCLUDE_REG.test(filePath)) {
							return false;
						} else {
							if (grunt.file.isFile(filePath)) {
								util.log("config", "transport:", filePath);
								return true;
							} else {
								return false;
							}
						}
					},
					dest: path.join("sea-modules", cwd)
				}]
			}
		},
		concat: {
			options: {
				include: "relative"
			},
			target: {
				files: [{
					expand: true,
					cwd: path.join("sea-modules", cwd),
					src: "**/*.js",
					dest: path.join("sea-modules", cwd),
					ext: ".js"
				}]
			}
		},
		uglify: {
			target: {
				files: [{
					expand: true,
					cwd: path.join("sea-modules", cwd),
					src: ["**/*.js", "!**/*-debug.js"],
					dest: path.join("sea-modules", cwd),
					ext: '.js'
				}]
			}
		},
		cssmin: {
			options: {
				keepSpecialComments: 0
			},
			target: {
				files: [{
					expand: true,
					cwd: path.join("sea-modules", cwd),
					src: ["**/*.css", "!**/*-debug.css"],
					dest: path.join("sea-modules", cwd),
					ext: '.css'
				}]
			}
		}
	});
};
