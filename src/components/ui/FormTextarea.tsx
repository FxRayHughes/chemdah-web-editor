import { Textarea, TextareaProps } from '@mantine/core';

export function FormTextarea(props: TextareaProps) {
    return <Textarea autosize minRows={3} {...props} />;
}
