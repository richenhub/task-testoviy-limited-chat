import { Message } from "./types";

export const fetchMessages = async (): Promise<Message[]> => {
    const response = await fetch("http://localhost:3000/messages");

    if (!response.ok) {
        throw new Error("Ошибка при получении сообщений");
    }

    return response.json();
};

export const createMessage = async (message: {
    text: string;
}): Promise<Message> => {
    const response = await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
    });

    if (!response.ok) {
        throw new Error("Ошибка при отправке сообщения");
    }

    return response.json();
};
