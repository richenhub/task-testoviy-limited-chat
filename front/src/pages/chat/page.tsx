import { useQuery, useMutation, useQueryClient } from "react-query";
import { Message } from "../../shared/api/types";
import { createMessage, fetchMessages } from "../../shared/api";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export const ChatPage = () => {
    const queryClient = useQueryClient();

    const { data: messages } = useQuery<Message[], Error>(
        "messages",
        fetchMessages,
        {
            refetchOnWindowFocus: false,
        }
    );

    const mutation = useMutation(createMessage, {
        onSuccess: () => {
            console.log("Сообщение отправлено");
        },
    });

    const [text, setText] = useState<string>("");

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3000");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const { type, message, id } = data;

            if (type === "message_added" && message) {
                queryClient.setQueryData<Message[]>("messages", (old) => [
                    ...(old || []),
                    message,
                ]);
            } else if (type === "message_removed" && id) {
                queryClient.setQueryData<Message[]>("messages", (old) =>
                    (old || []).filter((m) => m.id !== id)
                );
            }
        };

        return () => {
            ws.close();
        };
    }, [queryClient]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            mutation.mutate({ text });
            setText("");
        }
    };

    return (
        <div className={styles.container}>
            <h2>Чат</h2>
            <ul>
                {messages?.map((message, i) => (
                    <li key={message.id}>
                        <span>{++i}</span> {message.text}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Введите сообщение"
                />

                <button type="submit">Отправить</button>
            </form>
        </div>
    );
};
