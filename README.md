# ICLand verification bot

## Discord Application

To be able to configure and deploy a copy of the ICLand bot, you must create and Discord Application on Discord Developer Portal and configure it. To create one, just follow the steps [here](https://discord.com/developers/docs/getting-started). To be able to use all the capabilities of the bot, you must enable the `Server Members Intent` on the bot dashboard, and use `bot + application.commands` permission on the bot invite URL.

## Cloning the application

The bot was develop using [`Discord.js`](https://discord.js.org/#/docs/discord.js/main/general/welcome) with `Typescript`. So you need `Node` installed to be able to proceed.

Clone the project with:

```bash
git clone https://github.com/RenArtLabs/icland-bot.git
```

Install all the dependencies:

```node
yarn
```

If you see an error, it's probably due to some packages that need a `git personal access token` to registry and download it. To fix that you'll need to export the GIT_TOKEN with:

```bash
EXPORT GIT_TOKEN="your-token-here"
```

After installing the packages, you need to config the environment variables. To do so, copy the `.env.template` file and fill the variables as instructed below:

- `DISCORD_TOKEN`: it's your bot secret token;
- `DISCORD_CLIENT_ID`: it's the client id of your discord application;
- `DISCORD_GUILD_ID`: it's the id of your discord server where your gonna use as a dev environment;
- `SERVER_CANISTER_ID`: it's the canister id that the bot will use to store and retrieve the users and guilds (a.k.a. discord servers) information; (PS: if you want to remodel the database and add more attributes, you just need to update the server IDL file and actor call functions after it)
- `FRONTEND_URL`: it's the url of the app that will handle all the verification and integration with the app;

Finally, to run the bot locally, just use:

```bash
yarn start
```