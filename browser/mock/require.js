const dgram = {
	createSocket() {
		return {
			on() {},
			bind() {}
		}
	}
}

class Client {
	close() {}
}
const osc = { Client };

const electron = {
	remote: {
		app: {
			injectMenu() {}
		}
	}
};
const fs = {};
const path = {};

function require(what) {
	switch (what) {
		case "dgram": return dgram; break;
		case "node-osc": return osc; break;
		case "electron": return electron; break;
		case "fs": return fs; break;
		case "path": return path; break;
		default: throw new Error(`Trying to require(${what}) failed`); break;
	}
}
