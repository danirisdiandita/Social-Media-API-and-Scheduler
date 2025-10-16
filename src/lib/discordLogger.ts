import { Config } from "@/constants/config";

export const discordLogger = async (message: string) => {
    try {
        const payload = {
            "content": null,
            "embeds": [
                {
                    "title": "Message Logger",
                    "description": `**Message:** \`\`\`${message}\`\`\``,
                    "color": 5814783
                }
            ],
            "attachments": []
        }

        const res = await fetch(Config.DISCORD_WEBHOOK_URL as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error("Failed to send message to Discord");
        }
    } catch (error) {
        console.error("Error sending message to Discord:", error);
    }
}