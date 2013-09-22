module.exports = function(grunt) {
	var fs = require("fs");
	var path = require("path");

	Date.prototype.format = function(fmt) { //author: meizz 
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};

	return {
		"log": function(title) {
			var msgs = ["[", new Date().format("hh:mm:ss"), "]", "[", title, "]\t"];
			for (var i = 1; i < arguments.length; i++) {
				if (arguments[i].length && arguments[i].join) {
					msgs.push(arguments[i].join(", "));
				} else if (typeof arguments[i] === "string") {
					msgs.push(arguments[i]);
				} else if (typeof arguments[i] === "object") {
					msgs.push(JSON.stringify(arguments[i]));
				} else {
					msgs.push(arguments[i].toString());
				}
			}
			return grunt.log.writeln(msgs.join(""));
		},
		"exec": require("./exec"),
		"copy": function (src, dest, options, done) {
			options = options || {};
			var exclude = options.exclude;

			(function cp (src, dest) {
				fs.readdirSync(src).forEach(function (sub) {
					var subPath = path.join(src, sub);

					if (exclude && exclude.test && exclude.test(subPath)) {
						return;
					}

					var destPath = path.join(dest, sub);
					var stat = fs.statSync(subPath);
					if (stat.isDirectory()) {
						if (!fs.existsSync(destPath)) {
							fs.mkdirSync(destPath);
						}
						cp(subPath, destPath);
					} else if (stat.isFile()) {
						fs.writeFileSync(destPath, fs.readFileSync(subPath));
					}
				});
			})(src, dest);

			done();
		}
	};
};
