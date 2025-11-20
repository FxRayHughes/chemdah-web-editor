import React, { useEffect, useState } from 'react';
import { Group, TextInput, ActionIcon, Stack, Text, Button, Popover, Badge } from '@mantine/core';
import { IconPlus, IconTrash, IconSettings } from '@tabler/icons-react';

interface InferFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

interface Property {
    key: string;
    value: string;
}

export const InferField: React.FC<InferFieldProps> = ({ value, onChange, placeholder, label }) => {
    const [mainValue, setMainValue] = useState('');
    const [properties, setProperties] = useState<Property[]>([]);
    const [opened, setOpened] = useState(false);

    useEffect(() => {
        if (!value) {
            setMainValue('');
            setProperties([]);
            return;
        }

        const strVal = String(value);
        // Parse: material[k=v,k=v]
        const match = strVal.match(/^([^\[]+)(?:\[(.*)\])?$/);
        if (match) {
            setMainValue(match[1]);
            if (match[2]) {
                const props = match[2].split(/,(?![^\[]*\])/).map(p => {
                    const [k, ...v] = p.split('=');
                    return { key: k.trim(), value: v.join('=').trim() };
                });
                setProperties(props);
            } else {
                setProperties([]);
            }
        } else {
            setMainValue(value);
            setProperties([]);
        }
    }, [value]);

    const updateValue = (newMain: string, newProps: Property[]) => {
        if (!newMain) {
            onChange('');
            return;
        }
        if (newProps.length === 0) {
            onChange(newMain);
        } else {
            const propsStr = newProps.map(p => `${p.key}=${p.value}`).join(',');
            onChange(`${newMain}[${propsStr}]`);
        }
    };

    const handleAddProperty = () => {
        const newProps = [...properties, { key: '', value: '' }];
        setProperties(newProps);
        updateValue(mainValue, newProps);
    };

    const handleRemoveProperty = (index: number) => {
        const newProps = properties.filter((_, i) => i !== index);
        setProperties(newProps);
        updateValue(mainValue, newProps);
    };

    const handlePropertyChange = (index: number, field: 'key' | 'value', val: string) => {
        const newProps = [...properties];
        newProps[index] = { ...newProps[index], [field]: val };
        setProperties(newProps);
        updateValue(mainValue, newProps);
    };

    return (
        <Popover opened={opened} onChange={setOpened} width={300} position="bottom-end" withArrow trapFocus>
            <Popover.Target>
                <TextInput
                    placeholder={placeholder || "Value"}
                    value={mainValue}
                    onChange={(e) => {
                        setMainValue(e.target.value);
                        updateValue(e.target.value, properties);
                    }}
                    style={{ flex: 1 }}
                    size="xs"
                    variant="filled"
                    rightSection={
                        <ActionIcon variant={properties.length > 0 ? "light" : "subtle"} color={properties.length > 0 ? "blue" : "gray"} size="xs" onClick={() => setOpened((o) => !o)}>
                            <IconSettings size={12} />
                        </ActionIcon>
                    }
                />
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap="xs">
                        <Group gap="xs">
                            <Text size="xs" fw={500}>属性</Text>
                            <Badge size="xs" variant="light">Properties</Badge>
                        </Group>
                        {properties.map((prop, index) => (
                            <Group key={index} gap="xs">
                                <TextInput
                                    placeholder="Key"
                                    value={prop.key}
                                    onChange={(e) => handlePropertyChange(index, 'key', e.target.value)}
                                    size="xs"
                                    style={{ flex: 1 }}
                                />
                                <Text size="xs">=</Text>
                                <TextInput
                                    placeholder="Value"
                                    value={prop.value}
                                    onChange={(e) => handlePropertyChange(index, 'value', e.target.value)}
                                    size="xs"
                                    style={{ flex: 1 }}
                                />
                                <ActionIcon color="red" variant="subtle" size="xs" onClick={() => handleRemoveProperty(index)}>
                                    <IconTrash size={12} />
                                </ActionIcon>
                            </Group>
                        ))}
                        <Button size="xs" variant="light" leftSection={<IconPlus size={12} />} onClick={handleAddProperty}>
                            添加属性
                        </Button>
                    </Stack>
                </Popover.Dropdown>
        </Popover>
    );
};
