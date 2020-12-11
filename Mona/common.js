const COMMANDS = [
	{ command: "/commands", description: "lists all commands" },
	{
		command: "/search <anime|manga> <keyword>",
		description:
			"search for an anime or manga using a keyword (only top 10 results are shown)",
	},
	{ command: "/anime <id>", description: "find an anime using it's id" },
	{ command: "/manga <id>", description: "find a manga using it's id" },
	{
		command: "/catalyze",
		description:
			"creates a file for you to store anime/manga wishlist and favourites",
	},
	{
		command: "/wish <anime|manga> <id>",
		description: "add anime/manga to your wishlist",
	},
	{
		command: "/star <anime|manga> <id>",
		description: "add anime/manga to your favourites",
	},
	{
		command: "/wishes <anime|manga>",
		description: "view your anime/manga wishlist",
	},
	{
		command: "/stars <anime|manga>",
		description: "view your anime/manga favourites",
	},
	{
		command: "/curse <anime|manga> <id>",
		description: "delete anime/manga from your wishlist",
	},
	{
		command: "/void <anime|manga> <id>",
		description: "delete anime/manga from your favourites",
	},
	// {command: , description: },
];

module.exports = {
	COMMANDS,
};
