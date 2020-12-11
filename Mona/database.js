const fs = require("fs");

const DATA_PATH = "./data/";
const DATA_STRUCTURE = JSON.stringify({
	anime: {
		wishlist: [],
		favourites: [],
	},
	manga: {
		wishlist: [],
		favourites: [],
	},
});

class Manager {
	async init(name) {
		return new Promise((resolve, reject) => {
			fs.stat(DATA_PATH + name + ".json", (err) => {
				if (!err) return resolve(false);
				fs.writeFile(DATA_PATH + name + ".json", DATA_STRUCTURE, (err) => {
					if (err) {
						return resolve(false);
					}
					console.log(name + ".json created successfully!");
					return resolve(true);
				});
			});
		});
	}

	find(name, type, key, id) {
		const filePath = DATA_PATH + name + ".json";
		const file = require(filePath);
		return file[type][key].find((item) => item.id === id);
  }
  
	async exists(name) {
		return new Promise((resolve, reject) => {
			fs.stat(DATA_PATH + name + ".json", (err) => {
				if (err) return resolve(false);
				return resolve(true);
			});
		});
	}

	async add(name, type, key, data) {
		return new Promise((resolve, reject) => {
			const filePath = DATA_PATH + name + ".json";
			const file = require(filePath);

			file[type][key].unshift(data);
			fs.writeFile(filePath, JSON.stringify(file), (err) => {
				if (err) {
					return resolve(false);
				}
				console.log(name + ".json updated successfully!");
				return resolve(true);
			});
		});
	}

	async remove(name, type, key, id) {
		return new Promise((resolve, reject) => {
			const filePath = DATA_PATH + name + ".json";
			const file = require(filePath);

			file[type][key] = file[type][key].filter((item) => item.id !== id);

			fs.writeFile(filePath, JSON.stringify(file), (err) => {
				if (err) {
					return resolve(false);
				}
				console.log(name + ".json updated successfully!");
				return resolve(true);
			});
		});
	}

	show(name, type, key) {
		const filePath = DATA_PATH + name + ".json";
		const file = require(filePath);
		return file[type][key];
	}
}

module.exports = Manager;
