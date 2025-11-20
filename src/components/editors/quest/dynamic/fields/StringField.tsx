import React from 'react';
import { TextInput } from '@mantine/core';

interface StringFieldProps {
    value: any;
    onChange: (value: any) => void;
}

export const StringField: React.FC<StringFieldProps> = ({ value, onChange }) => {
    return (
        <TextInput
            value={value === undefined || value === null ? '' : value}
            onChange={(e) => {
                const val = e.target.value;
                onChange(val === '' ? undefined : val);
            }}
            placeholder="未设置"
            size="xs"
            variant="filled"
        />
    );
};
