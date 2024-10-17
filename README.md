# LSPD Forms App

This Next.js application allow users to send form applications to a Discord channel via threads.

## Initial setup

1. You need to install all dependencies before running this app.

```bash
$ npm install
```

2. Then, rename `.env.example` to `.env` and fill all environment variables (tokens, api keys, ids, etc).

3. In your Discord bot, add `handleFormEvent` function, located in `./scripts/buttonEvent.ts`. Then, import it in your `interactionCreate` event and call it before all your code, as in this example:

```ts
import { handleFormEvent } from "../utils/buttonEvent"; // or anywhere you put the file

// client definition and more stuff...

client.on("interactionCreate", async (interaction) => {
  const handledForm = await handleFormEvent(interaction);
  if (handledForm) return;

  // your code here...
});
```

4. Also you need to add some environment variables in your Discord Bot `.env` file:

```shell
ACCEPTED_CHANNELID="channelId"
MOD_ROLEID="roleId"
```

5. You can test app before deploying, using:

```bash
$ npm run dev
```

6. When you ready to deploy, just upload to Vercel.app, or if you want a local deploy, run:

```bash
$ npm run build
```

## Modify form

If you want to change formulary questions, you should modify `./src/constants/form.json` file, following the next structure:

```jsonc
[
  {
    "sectionName": "Section 1",
    "questions": [
      {
        "question": "Question 1",
        "type": "text|paragraph|number|attachment|"
      }
    ]
  }
]
```

You can add as many sections and questions as you want, but consider website performance.

---

that's all :)
