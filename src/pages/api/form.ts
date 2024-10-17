import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { FormData } from "@/utils/makeForm";
import { uploadImage } from "@/utils/uploadImage";
import { ChannelType, Routes } from "discord-api-types/v10";
import { rest } from "@/utils/discordRest";

const ROLE = 0;
const PERMISSIONS = 3072;

const ACTION_ROW = 1;4
const BUTTON = 2;
const STYLE_SECONDARY = 2;

interface Message {
  content: string;
  embeds: Array<{ [k: string]: unknown }>;
  components: Array<{ [k: string]: unknown }>;
  allowedMentions: { parse: string[] };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (
    !process.env.DISCORD_GUILDID ||
    !process.env.DISCORD_PARENTID ||
    !process.env.FORM_CHANNELNAME ||
    !process.env.MOD_ROLEID
  ) {
    return res.status(500).json({
      error: "No se ha configurado el servidor. Contacte con el administrador.",
    });
  }

  const channel = (await rest
    .post(Routes.guildChannels(process.env.DISCORD_GUILDID!), {
      body: {
        name: process.env.FORM_CHANNELNAME.replaceAll(
          "{{user}}",
          session.user?.name ?? session.user.email ?? "unknown"
        ),
        type: ChannelType.GuildText,
        parent_id: process.env.DISCORD_PARENTID!,
        permission_overwrites: [
          {
            id: process.env.MOD_ROLEID!,
            type: ROLE,
            allow: PERMISSIONS.toString(),
          },
          {
            id: process.env.DISCORD_GUILDID!,
            type: ROLE,
            deny: PERMISSIONS.toString(),
          }
        ],
      },
    })
    .catch(() => void 0)) as { id: string | null };

  if (!channel?.id) {
    return res.status(500).json({ error: "Error al crear el canal." });
  }

  const form = req.body as FormData;

  // check if images provided in the form are valid
  for (const [, questions] of Object.entries(form)) {
    for (const { answer, type } of questions) {
      if (type == "attachment") {
        const isValid = answer.startsWith("data:image");

        if (!isValid) {
          return res.status(400).end();
        }
      }
    }
  }

  const payloads = Object.entries(form).map(async ([section, questions], i) => {
    const q = questions.map(async ({ question, answer, type }) => {
      if (type == "attachment") {
        const url = await uploadImage(answer).catch((er) => {
          // console.log(er)
        });
        answer = url ?? "Error al subir la imagen";
      }

      return type == "attachment"
        ? {
            title: question,
            image: { url: answer },
            color: 0x2f3136,
          }
        : {
            title: question,
            description: answer,
            color: 0x2f3136,
          };
    });

    const resolved = await Promise.all(q);

    return {
      content: `## ${section}`,
      embeds: resolved,
    } as Partial<Message>;
  });

  const resolvedPayloads = await Promise.all(payloads);
  resolvedPayloads.push({
    content: "Aceptar o rechazar la solicitud",
    components: [
      {
        type: ACTION_ROW,
        components: [
          {
            type: BUTTON,
            label: "Aceptar",
            style: STYLE_SECONDARY,
            custom_id: `form-accept-${session.user.email}`,
          },
          {
            type: BUTTON,
            label: "Rechazar",
            style: STYLE_SECONDARY,
            custom_id: `form-reject-${session.user.email}`,
          },
        ],
      },
    ],
  });

  if (process.env.FORM_MESSAGE?.length) {
    resolvedPayloads.unshift({
      content: process.env.FORM_MESSAGE.replaceAll(
        "{{user}}",
        session.user.name ?? session.user.email ?? "unknown"
      ),
      allowedMentions: { parse: ["users", "roles", "everyone"] },
    });
  }

  for (const payload of resolvedPayloads) {
    await rest.post(Routes.channelMessages(channel.id), {
      body: payload,
    });
  }

  return res.status(200).json({ success: true });
}
