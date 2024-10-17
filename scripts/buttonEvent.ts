// @ts-nocheck <- REMOVE THIS BEFORE USING
import DJS from "discord.js";

/**
 * Add this script to your discord bot and import it in your 'interactionCreate' event. Call it before all your intCreate callback.
 * This async function should return a boolean, if it returns true, the event should be stopped, otherwise, continue with your code.
 *
 * i.e, in your 'interactionCreate' event:
 * ```js
 * const handledForm = await handleFormEvent(client, interaction);
 * if (handledForm) return;
 * // your code here
 * ```
 *
 * Add the following variables to your .env file:
 * - ACCEPTED_CHANNELID="channelId"
 * - MOD_ROLEID="roleId"
 */

export async function handleFormEvent(interaction: DJS.Interaction) {
  const { client } = interaction;

  if (
    !client.isReady() ||
    !interaction.isButton() ||
    !interaction.inCachedGuild() ||
    !interaction.channel
  ) {
    return false;
  }

  if (!interaction.customId.startsWith("form")) return false;

  const [, action, userId] = interaction.customId.split("-");

  if (action != "accept" && action != "reject") {
    return false;
  }

  if (!interaction.member?.roles.cache.has(process.env.MOD_ROLEID!)) {
    interaction.reply({
      content: "No tienes permisos para realizar esta acción.",
      ephemeral: true,
    });
    return true;
  }

  if (action == "accept") {
    const channelId = process.env.ACCEPTED_CHANNELID;
    const channel = interaction.guild?.channels.cache.get(channelId!);

    if (!channel || !(channel instanceof DJS.TextChannel)) {
      interaction.reply({ content: "Canal no configurado.", ephemeral: true });
      return true;
    }

    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    const myMessages = messages
      .filter((m) => m.author.id == client.user.id)
      .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
      .toJSON()
      .slice(1, 4);

    const user = await client.users.fetch(userId).catch(() => null);

    let toFileContent = `# Nueva postulación\n\n- Usuario: ${
      user?.username ?? "Desconocido"
    } (${userId})\n\n- Aceptado por: ${interaction.user.username}\n\n`;

    for (const [, msg] of myMessages.entries()) {
      toFileContent += `${msg.content}\n\n`;

      for (const [ix, embed] of msg.embeds.entries()) {
        toFileContent += `${ix + 1}. ${embed.title}\n\n- ${
          embed.image?.url ?? embed.description
        }\n\n`;
      }
    }

    const attachment = new DJS.AttachmentBuilder(
      Buffer.from(toFileContent, "utf-8"),
      { name: `form-${userId}.md` }
    );

    await channel.send({
      content: `Nueva postulación aceptada de ${user?.username ?? userId}`,
      files: [attachment],
    });

    if (interaction.channel instanceof DJS.TextChannel) {
      interaction.channel.permissionOverwrites.create(userId, {
        SendMessages: true,
        ViewChannel: true,
      });
    }

    interaction.channel.send({
      content: `Postulación aceptada de <@${userId}>.`,
    });
  } else {
    const user = await client.users.fetch(userId).catch(() => null);
    if (user) {
      user.send("Tu postulación ha sido rechazada.");
    }

    interaction.channel.send({
      content: `Postulación rechazada de ${user?.username ?? userId}`,
    });
  }

  await interaction.update({ components: [] });
  return true;
}
