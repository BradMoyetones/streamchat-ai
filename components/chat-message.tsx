'use client';

import { Streamdown } from 'streamdown';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCcw, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useMemo } from 'react';

interface ChatMessageProps {
    id: string;
    content: string;
    type: 'user' | 'assistant';
    completed?: boolean;
    isStreaming?: boolean;
}

export function ChatMessage({ id, content, type, completed, isStreaming }: ChatMessageProps) {
    const streamdownContent = useMemo(() => {
        return <Streamdown isAnimating={isStreaming}>{content}</Streamdown>;
    }, [content, isStreaming]);

    return (
        <div className={cn('flex flex-col group', type === 'user' ? 'items-end' : 'items-start')}>
            <div
                className={cn(
                    'px-4 py-3 rounded-2xl max-w-full wrap-break-word',
                    type === 'user' ? 'dark:bg-muted bg-white rounded-br-none' : ''
                )}
            >
                {type === 'user' ? <span className="text-base">{content}</span> : streamdownContent}
            </div>

            {type === 'user' && (
                <div className="text-xs text-muted-foreground py-1 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                    <Button variant="ghost" size="icon-sm">
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                    </Button>
                </div>
            )}

            {type === 'assistant' && completed && (
                <div className="flex items-center gap-2 px-4 mt-1 mb-2">
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                        <RefreshCcw className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                        <Copy className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                        <Share2 className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsDown className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
