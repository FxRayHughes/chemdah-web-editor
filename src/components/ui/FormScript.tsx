import Editor, { EditorProps } from '@monaco-editor/react';
import { Box, Text } from '@mantine/core';

interface FormScriptProps extends EditorProps {
    label?: string;
    description?: string;
    height?: string | number;
    value?: string;
    onChange?: (value: string | undefined) => void;
}

export function FormScript({ label, description, height = "200px", value, onChange, ...props }: FormScriptProps) {
    return (
        <Box>
            {label && <Text size="sm" fw={500} mb={4}>{label}</Text>}
            {description && <Text size="xs" c="dimmed" mb={8}>{description}</Text>}
            <Box style={{ border: '1px solid var(--mantine-color-dark-4)', borderRadius: '4px', overflow: 'hidden' }}>
                <Editor
                    height={height}
                    defaultLanguage="ruby"
                    theme="vs-dark"
                    value={value}
                    onChange={onChange}
                    options={{
                        minimap: { enabled: false },
                        lineNumbers: 'on',
                        lineNumbersMinChars: 3,
                        scrollBeyondLastLine: false,
                        fontSize: 13,
                        ...props.options
                    }}
                    {...props}
                />
            </Box>
        </Box>
    );
}
