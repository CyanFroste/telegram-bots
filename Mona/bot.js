const { Telegraf } = require("telegraf");
const {
	search,
	media,
	initializeList,
	addToList,
	getList,
	removeFromList,
	commands,
} = require("./commands");

const BOT_TOKEN = process.env.BOT_TOKEN;
const USERNAME = process.env.BOT_USERNAME;

const bot = new Telegraf(BOT_TOKEN, { username: USERNAME });

bot.command("catalyze", initializeList);
bot.command("wish", addToList);
bot.command("star", addToList);
bot.command("anime", media);
bot.command("manga", media);
bot.command("wishes", getList);
bot.command("stars", getList);
bot.command("search", search);
bot.command("curse", removeFromList);
bot.command("void", removeFromList);
bot.command("commands", commands);

bot.command("mona", ctx => {
  ctx.reply("Yes!");
});

bot.launch();
