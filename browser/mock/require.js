import * as fs from "./fs.js";
import * as path from "./path.js";
import * as osc from "./osc.js";
import * as electron from "./electron.js";
import * as dgram from "./dgram.js";

import Buffer from "./buffer.js";
window.Buffer = Buffer;

window.require = function(what) {
	switch (what) {
		case "dgram": return dgram; break;
		case "fs": return fs; break;
		case "path": return path; break;
		case "node-osc": return osc; break;
		case "electron": return electron; break;
		default: console.log(what); break;
	}
}