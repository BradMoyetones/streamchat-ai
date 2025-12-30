'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Lightbulb, ArrowUp, Menu, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AnimatedThemeToggler } from './animated-theme-toggler';
import { ChatMessage } from './chat-message';
import { useChatStream } from '@/hooks/use-chat-stream';

type ActiveButton = 'none' | 'add' | 'deepSearch' | 'think';

const IS_DEV = true;

export default function ChatInterface() {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [hasTyped, setHasTyped] = useState(false);
    const [activeButton, setActiveButton] = useState<ActiveButton>('none');
    const [isMobile, setIsMobile] = useState(false);
    const inputContainerRef = useRef<HTMLDivElement>(null);
    const selectionStateRef = useRef<{ start: number | null; end: number | null }>({
        start: null,
        end: null,
    });

    const { messages, isStreaming, sendMessage } = useChatStream({ isDev: IS_DEV });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current && !isMobile) {
            textareaRef.current.focus();
        }
    }, [isMobile]);

    useEffect(() => {
        if (!isStreaming && !isMobile) {
            focusTextarea();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStreaming, isMobile]);

    const saveSelectionState = () => {
        if (textareaRef.current) {
            selectionStateRef.current = {
                start: textareaRef.current.selectionStart,
                end: textareaRef.current.selectionEnd,
            };
        }
    };

    const restoreSelectionState = () => {
        const textarea = textareaRef.current;
        const { start, end } = selectionStateRef.current;

        if (textarea && start !== null && end !== null) {
            textarea.focus();
            textarea.setSelectionRange(start, end);
        } else if (textarea) {
            textarea.focus();
        }
    };

    const focusTextarea = () => {
        if (textareaRef.current && !isMobile) {
            textareaRef.current.focus();
        }
    };

    const handleInputContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (
            e.target === e.currentTarget ||
            (e.currentTarget === inputContainerRef.current && !(e.target as HTMLElement).closest('button'))
        ) {
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        if (!isStreaming) {
            setInputValue(newValue);

            if (newValue.trim() !== '' && !hasTyped) {
                setHasTyped(true);
            } else if (newValue.trim() === '' && hasTyped) {
                setHasTyped(false);
            }

            const textarea = textareaRef.current;
            if (textarea) {
                textarea.style.height = 'auto';
                const newHeight = Math.max(24, Math.min(textarea.scrollHeight, 160));
                textarea.style.height = `${newHeight}px`;
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isStreaming) {
            const userMessage = inputValue.trim();

            setInputValue('');
            setHasTyped(false);
            setActiveButton('none');

            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }

            if (!isMobile) {
                focusTextarea();
            } else {
                if (textareaRef.current) {
                    textareaRef.current.blur();
                }
            }

            await sendMessage(userMessage);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!isStreaming && e.key === 'Enter' && e.metaKey) {
            e.preventDefault();
            handleSubmit(e);
            return;
        }

        if (!isStreaming && !isMobile && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const toggleButton = (button: ActiveButton) => {
        if (!isStreaming) {
            saveSelectionState();
            setActiveButton((prev) => (prev === button ? 'none' : button));
            setTimeout(() => {
                restoreSelectionState();
            }, 0);
        }
    };

    return (
        <div className="dark:bg-background bg-muted">
            <header className="sticky top-0 shrink-0 h-12 flex items-center px-4 backdrop-blur-2xl z-10">
                <div className="w-full flex items-center justify-between px-2">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </Button>

                    <h1 className="text-base font-medium">Chat</h1>

                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                            <PenSquare className="h-5 w-5" />
                            <span className="sr-only">New Chat</span>
                        </Button>
                        <AnimatedThemeToggler variant="ghost" size="icon-sm" className="rounded-full" />
                    </div>
                </div>
            </header>

            <div className="flex-1 px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            id={message.id}
                            content={message.content}
                            type={message.role}
                            completed={message.completed}
                            isStreaming={isStreaming && message.role === 'assistant' && !message.completed}
                        />
                    ))}
                </div>
            </div>

            <div className="sticky bottom-0 shrink-0 p-4 backdrop-blur-2xl z-10">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div
                        ref={inputContainerRef}
                        className={cn(
                            'relative w-full rounded-3xl border bg-card p-3 cursor-text',
                            isStreaming && 'opacity-80'
                        )}
                        onClick={handleInputContainerClick}
                    >
                        <div className="pb-9">
                            <Textarea
                                ref={textareaRef}
                                placeholder={isStreaming ? 'Waiting for response...' : 'Ask Anything'}
                                className="min-h-10 max-h-40 w-full rounded-3xl border-0 bg-transparent! placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 text-base pl-2 pr-4 pt-0 pb-0 resize-none overflow-y-auto leading-tight shadow-none"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                rows={1}
                            />
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full h-8 w-8 shrink-0 p-0 bg-transparent"
                                        onClick={() => toggleButton('add')}
                                        disabled
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="sr-only">Add</span>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="rounded-full h-8 px-3 flex items-center gap-1.5 bg-transparent"
                                        onClick={() => toggleButton('deepSearch')}
                                        disabled
                                    >
                                        <Search className="h-4 w-4" />
                                        <span className="text-sm">DeepSearch</span>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="rounded-full h-8 px-3 flex items-center gap-1.5 bg-transparent"
                                        onClick={() => toggleButton('think')}
                                        disabled
                                    >
                                        <Lightbulb className="h-4 w-4" />
                                        <span className="text-sm">Think</span>
                                    </Button>
                                </div>

                                <Button
                                    type="submit"
                                    variant="outline"
                                    size="icon"
                                    className={cn('rounded-full h-8 w-8 border-0 shrink-0', hasTyped && 'scale-110')}
                                    disabled={!inputValue.trim() || isStreaming}
                                >
                                    <ArrowUp className="h-4 w-4" />
                                    <span className="sr-only">Submit</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
