module.exports = function (grunt, cwd) {
	var extend = require("extend");
	var fs = require("fs");
	var path = require("path");

	var util = require("./util")(grunt);

	var pkg = (function getPkg (cwd) {
		var pkgPath = path.resolve(cwd);
		if (fs.existsSync(pkgPath)) {
			var pkg = grunt.file.readJSON(pkgPath);
			if (pkg.parent) {
				var parentPkg = getPkg(path.resolve(cwd.replace("package.json", ""), pkg.parent));
				if (parentPkg) {
					pkg = extend(true, parentPkg, pkg);
				}
			}
			return pkg;
		} else {
			util.log("pkg", "pkg not found:", pkgPath);
			return null;
		}
	})(cwd);

	return pkg;
}