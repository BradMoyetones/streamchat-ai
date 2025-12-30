'use client';

import { useState, useRef } from 'react';

export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    completed?: boolean;
}

interface UseChatStreamOptions {
    isDev?: boolean;
}

export function useChatStream({ isDev = true }: UseChatStreamOptions = {}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const simulateDevStream = async (userMessage: string) => {
        const exampleMarkdown = `# Understanding AI Streaming

Streaming responses provide a better user experience by showing content as it's generated, rather than waiting for the entire response.

## Key Benefits

- **Immediate Feedback**: Users see content appearing in real-time
- **Better UX**: Reduces perceived latency
- **Natural Flow**: Mimics human conversation patterns

Here's a simple example of how streaming works:

\`\`\`typescript
// Example streaming implementation
async function* streamResponse() {
  for (const chunk of chunks) {
    yield chunk;
  }
}
\`\`\`

This approach ensures that your application feels responsive and engaging, even when generating longer responses.`;

        const messageId = `assistant-${Date.now()}`;

        // Add empty assistant message
        setMessages((prev) => [
            ...prev,
            {
                id: messageId,
                content: '',
                role: 'assistant',
                completed: false,
            },
        ]);

        let currentContent = '';

        for (let i = 0; i < exampleMarkdown.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 20)); // 20ms per character
            currentContent += exampleMarkdown[i];

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId
                        ? {
                              ...msg,
                              content: currentContent,
                          }
                        : msg
                )
            );
        }

        // Mark as completed
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, completed: true } : msg)));

        setIsStreaming(false);
    };

    const streamFromAPI = async (userMessage: string) => {
        const messageId = `assistant-${Date.now()}`;

        // Add empty assistant message
        setMessages((prev) => [
            ...prev,
            {
                id: messageId,
                content: '',
                role: 'assistant',
                completed: false,
            },
        ]);

        try {
            abortControllerRef.current = new AbortController();

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages
                        .filter((m) => m.role !== 'assistant' || m.completed)
                        .map((m) => ({ role: m.role, content: m.content }))
                        .concat({ role: 'user', content: userMessage }),
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let currentContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    currentContent += chunk;

                    setMessages((prev) =>
                        prev.map((msg) => (msg.id === messageId ? { ...msg, content: currentContent } : msg))
                    );
                }
            }

            // Mark as completed
            setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, completed: true } : msg)));
        } catch (error) {
            console.error('Streaming error:', error);
        } finally {
            setIsStreaming(false);
            abortControllerRef.current = null;
        }
    };

    const sendMessage = async (content: string) => {
        if (!content.trim() || isStreaming) return;

        // Add user message
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content: content.trim(),
            role: 'user',
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsStreaming(true);

        // Use dev simulation or real API
        if (isDev) {
            await simulateDevStream(content);
        } else {
            await streamFromAPI(content);
        }
    };

    const stopStreaming = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsStreaming(false);
        }
    };

    return {
        messages,
        isStreaming,
        sendMessage,
        stopStreaming,
    };
}
