import { z } from "zod";

const baseUrl = "https://playerdb.co/api";

const schema = z.object({
    data: z.object({
        player: z.object({
            username: z.string(),
            id: z.string(),
            avatar: z.string().nullish(),
        }),
    }),
});

export const fetchMinecraftPlayerData = async (username: string) => {
    const response = await fetch(`${baseUrl}/player/minecraft/${username}`);
    const data = await response.json();

    const validatedData = schema.parse(data);

    return validatedData;
};
