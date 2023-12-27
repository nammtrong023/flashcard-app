import React, { useLayoutEffect, useRef } from 'react';
import { Textarea } from './textarea';

interface TextareaResizeProps {
    className?: string;
    value: string;
    placeholder?: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
    onInput?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    minTextareaHeight?: number;
    readOnly?: boolean;
    autoFocus?: boolean;
}

const TextareaResize = ({
    value,
    className,
    placeholder,
    readOnly,
    autoFocus,
    minTextareaHeight = 25,
    onChange,
    onInput,
}: TextareaResizeProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = `${minTextareaHeight}px`;

            textareaRef.current.style.height = `${Math.max(
                textareaRef.current.scrollHeight,
                minTextareaHeight,
            )}px`;
        }
    }, [minTextareaHeight, value]);

    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter' && event.shiftKey) {
            const currentValue = event.currentTarget.value;
            const selectionStart = event.currentTarget.selectionStart || 0;
            const selectionEnd = event.currentTarget.selectionEnd || 0;

            const newValue =
                currentValue.substring(0, selectionStart) +
                '\n' +
                currentValue.substring(selectionEnd);

            event.currentTarget.value = newValue;
            if (onChange) {
                onChange(event as any);
            }

            event.preventDefault();
        } else if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
        }
    }

    return (
        <Textarea
            value={value}
            ref={textareaRef}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            style={{
                resize: 'none',
                minHeight: minTextareaHeight,
            }}
            readOnly={readOnly}
            onInput={onInput}
            className={className}
        />
    );
};

export default TextareaResize;
