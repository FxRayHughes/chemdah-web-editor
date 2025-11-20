import React from 'react';
import { NumberInput } from '@mantine/core';

interface NumberFieldProps {
    value: any;
    onChange: (value: any) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({ value, onChange }) => {
    return (
        <NumberInput
            value={value === undefined || value === null ? '' : value}
            onChange={(val) => {
                if (val === '' || val === undefined) {
                    onChange(undefined);
                } else {
                    onChange(Number(val));
                }
            }}
            placeholder="未设置"
            size="xs"
            variant="filled"
        />
    );
};
