const Anilist = require("anilist-node");
const Manager = require("./database");
const { parse, generateReply } = require("./utilities");
const { COMMANDS } = require("./common");

const anilist = new Anilist();
const manager = new Manager();

/* unused functions
  function replyTo(id) {
    return {
      reply_to_message_id: id,
    };
  }
*/

const media = (ctx) => {
	const { type, id } = parse(ctx.message.text);
	// console.log({ type, id });

	if (isNaN(parseInt(id)))
		return ctx.reply(
			`@${ctx.message.from.username} | /${type}\n\nEnter a valid number` // to alter speech
		);

	anilist.media[type](parseInt(id)).then((data) => {
		ctx.reply(generateReply(data, type, ctx.message.from.username));
	});
};

const search = (ctx) => {
	const { type, keyword } = parse(ctx.message.text);
	// console.log({ type, keyword });
	if (type !== "anime" && type !== "manga")
		return ctx.reply(
			`@${ctx.message.from.username} | /search\n\nYou can only search for anime or manga.` // to alter speech
		);
	if (keyword === "")
		return ctx.reply(
			`@${ctx.message.from.username} | /search\n\nEnter some words to search.` // to alter speech
		);

	anilist.search(type, keyword, 1, 10).then((data) => {
		ctx.reply(
			generateReply(data.media, "search", ctx.message.from.username, type),
			{
				disable_web_page_preview: true,
				// parse_mode: "MarkdownV2",
			}
		);
	});
};

const initializeList = (ctx) => {
	manager.init(ctx.message.from.id).then((initialized) => {
		ctx.reply(
			initialized // to alter speech
				? `@${ctx.message.from.username} | /catalyze\n\nAll done. Now you can /wish for anime or manga and can also /star it.`
				: `@${ctx.message.from.username} | /catalyze\n\nSomething went wrong!`
		);
	});
};

const addToList = (ctx) => {
	const { command, type, list, id } = parse(ctx.message.text);
	// console.log({ type, list, id });

	if (type !== "anime" && type !== "manga")
		return ctx.reply(
			`@${ctx.message.from.username}\n\nYou can only /${command} anime or manga.` // to alter speech
		);
	if (isNaN(parseInt(id)))
		return ctx.reply(
			`@${ctx.message.from.username} | /${command}\n\nEnter a valid number` // to alter speech
		);

	manager.exists(ctx.message.from.id).then((status) => {
		if (status) {
			if (manager.find(ctx.message.from.id, type, list, parseInt(id)))
				return ctx.reply(
					`@${ctx.message.from.username} | /${command}\n\nAlready exists in ${list}` // to alter speech
				);

			anilist.media[type](parseInt(id)).then((data) => {
				if (data.status === 404)
					return ctx.reply(
						`@${ctx.message.from.username} | /${command}\n\nNo such ${type} exists!` // to alter speech
					);
				manager
					.add(ctx.message.from.id, type, list, {
						id: data.id,
						title: data.title,
						genres: data.genres,
						url: data.siteUrl,
						date: new Date().toLocaleDateString(),
					})
					.then((updated) => {
						ctx.reply(
							updated // to alter speech
								? `@${ctx.message.from.username} | /${command}\n\n${type} added to your ${list}`
								: `@${ctx.message.from.username} | /${command}\n\nSomething went wrong`
						);
					});
			});
		} else
			ctx.reply(
				`@${ctx.message.from.username} | /${command}\n\nStart by typing /catalyze to make your file.`
			);
	});
};

const getList = (ctx) => {
	const { command, list, type } = parse(ctx.message.text);
	// console.log({ list, type });

	if (type !== "anime" && type !== "manga")
		return ctx.reply(
			`@${ctx.message.from.username} | /${command}\n\nYou can only see ${list} for anime or manga` // to alter speech
		);

	manager.exists(ctx.message.from.id).then((status) => {
		if (status) {
			const data = manager.show(ctx.message.from.id, type, list);
			ctx.reply(generateReply(data, list, ctx.message.from.username, type), {
				disable_web_page_preview: true,
				// parse_mode: "MarkdownV2",
			});
		} else
			ctx.reply(
				`@${ctx.message.from.username} | /${command}\n\nStart by typing /catalyze to make your file.`
			);
	});
};

const removeFromList = (ctx) => {
	const { command, type, list, id } = parse(ctx.message.text);
	// console.log({ type, list, id });

	if (type !== "anime" && type !== "manga")
		return ctx.reply(
			`@${ctx.message.from.username}\n\nYou can only /${command} anime or manga.` // to alter speech
		);
	if (isNaN(parseInt(id)))
		return ctx.reply(
			`@${ctx.message.from.username} | /${command}\n\nEnter a valid number` // to alter speech
		);

	manager.exists(ctx.message.from.id).then((status) => {
		if (status) {
			if (!manager.find(ctx.message.from.id, type, list, parseInt(id)))
				return ctx.reply(
					`@${ctx.message.from.username} | /${command}\n\nEntry doesn't exist in ${list}` // to alter speech
				);

			manager
				.remove(ctx.message.from.id, type, list, parseInt(id))
				.then((updated) => {
					ctx.reply(
						updated // to alter speech
							? `@${ctx.message.from.username} | /${command}\n\n${type} removed from your ${list}`
							: `@${ctx.message.from.username} | /${command}\n\nSomething went wrong`
					);
				});
		} else
			ctx.reply(
				`@${ctx.message.from.username} | /${command}\n\nStart by typing /catalyze to make your file.`
			);
	});
};

const commands = (ctx) => {
	ctx.reply(generateReply(COMMANDS, "commands", ctx.message.from.username));
};

module.exports = {
	search,
	media,
	initializeList,
	addToList,
	getList,
	removeFromList,
	commands,
};
