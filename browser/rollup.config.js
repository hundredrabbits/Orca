import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

export default {
	input: "../desktop/sources/scripts/terminal.js",
	output: {
		file: "bundle.js",
		format: "iife",
		name: "Terminal"
	},
	plugins: [
		nodeResolve(),
		commonjs({
			ignore: ["electron", "fs", "path", "dgram", "node-osc"]
		})
	]
}
