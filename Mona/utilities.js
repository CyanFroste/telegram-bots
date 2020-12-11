function isNumeric(str) {
	if (typeof str != "string") return false;
	return !isNaN(str) && !isNaN(parseFloat(str));
}

function normalizeText(text) {
	return text.replace(/<br>/g, "").replace(/&amp;/g, "&");
}

function date(date) {
	if (!date) return "unavailable";
	return `${date.day || " - "}/${date.month || " - "}/${date.year || " - "}`;
}

function parse(text) {
	let words = text.split(" ");
	words = words.filter((word) => word !== "");
	command = words[0].slice(1).toLowerCase();

	let type =
		words[1] && (words[1] === "anime" || words[1] === "manga")
			? words[1].toLowerCase()
			: "anime";
	let pos = !words[1] || (words[1] !== "anime" && words[1] !== "manga") ? 1 : 2;

	switch (command) {
		case "anime":
		case "manga":
			return {
				command,
				type: command,
				id: words[1],
			};
		case "search":
			return {
				command,
				type,
				keyword: words.slice(pos).join(" "),
			};
		case "wish":
		case "star":
		case "curse":
		case "void":
			return {
				command,
				list:
					command === "wish" || command === "curse" ? "wishlist" : "favourites",
				type,
				id: words[pos],
			};
		case "wishes":
		case "stars":
			return {
				command,
				list: command === "wishes" ? "wishlist" : "favourites",
				type,
			};
	}
}

function generateReply(data, type, to = null, mediaType = null) {
	let username = to ? "@" + to : "";
	switch (type) {
		case "search":
			if (data.length === 0)
				return username + " | /search\n\n" + "Sorry, Not found."; // to alter speech
			const results = data.map(
				(res) =>
					`Id: ${res.id}\nRomaji: ${
						res.title.romaji || "unavailable"
					}\nEnglish: ${res.title.english || "unavailable"}\nNative: ${
						res.title.native || "unavailable"
					}\nhttps://anilist.co/${mediaType}/${res.id}`
			);
			return `${username} | /search\n\n${results.join("\n\n")}`;
		case "anime":
			if (data.status === 404)
				return username + " | /anime\n\n" + "Sorry, Not found."; // to alter speech
			/**
			 * id
			 * idMal
			 * title: romaji, english, native
			 * description
			 * isAdult
			 * genres[]
			 * averageScore
			 * episodes
			 * nextAiringEpisode: episode, airingAt
			 * status
			 * startDate
			 * endDate
			 * siteUrl
			 */

			return `${username} | /anime\n\nId: ${data.id}\nMAL Id: ${
				data.idMal
			}\nRomaji title: ${data.title.romaji || "unavailable"}\nEnglish title: ${
				data.title.english || "unavailable"
			}\nNative title: ${
				data.title.native || "unavailable"
			}\n\nDescription:\n${normalizeText(data.description)}\n\nR18: ${
				data.isAdult
			}\nGenres: ${data.genres.join(", ")}\n\nAvg. score: ${
				data.averageScore || "unavailable"
			}\nNo. of episodes: ${data.episodes}${
				data.nextAiringEpisode
					? `Next episode: ${data.nextAiringEpisode.episode}, Airing at: ${data.nextAiringEpisode.airingAt}\n`
					: ""
			}\nStatus: ${data.status}\nFrom ${date(data.startDate)} to ${date(
				data.endDate
			)}\n\n${data.siteUrl}`;

		case "manga":
			if (data.status === 404)
				return username + " | /manga\n\n" + "Sorry, Not found."; // to alter speech
			/**
			 * id
			 * idMal
			 * title: romaji, english, native
			 * description
			 * isAdult
			 * genres
			 * averageScore
			 * chapters
			 * volumes
			 * status
			 * startDate
			 * endDate
			 * siteUrl
			 */

			return `${username} | /manga\n\nId: ${data.id}\nMAL Id: ${
				data.idMal
			}\nRomaji title: ${data.title.romaji || "unavailable"}\nEnglish title: ${
				data.title.english || "unavailable"
			}\nNative title: ${
				data.title.native || "unavailable"
			}\n\nDescription:\n${normalizeText(data.description)}\n\nR18: ${
				data.isAdult
			}\nGenres: ${data.genres.join(", ")}\n\nAvg. score: ${
				data.averageScore || "unavailable"
			}%\nNo. of chapters: ${data.chapters}\nNo. of Volumes: ${
				data.volumes
			}\n\nStatus: ${data.status}\nFrom ${date(data.startDate)} to ${date(
				data.endDate
			)}\n\n${data.siteUrl}`;

		case "wishlist":
		case "favourites":
			if (data.length === 0)
				return `${username}\n\nYour ${mediaType} ${type} is empty.`;
			const entries = data.map(
				(item) =>
					`Id: ${item.id}\nTitle: ${
						item.title.userPreferred
					}\nGenres: ${item.genres.join(", ")}\nDate added: ${item.date}\n${
						item.url
					}`
			);
			return `${username}\n\nYour ${mediaType} ${type}\n\n${entries.join(
				"\n\n"
			)}`;

		case "commands":
			const commands = data.map(
				(item) => `${item.command}\n${item.description}`
			);
			return `${username}\n\n${commands.join(
				"\n\n"
			)}\n\nNOTE\nCommands will default to anime if not specified.`;
	}
}

module.exports = {
	isNumeric,
	parse,
	generateReply,
};
