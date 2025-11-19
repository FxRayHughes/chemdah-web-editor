import { Group, Text } from '@mantine/core';
import { IconCheck, IconBrandGithub } from '@tabler/icons-react';

export function StatusBar() {
  return (
    <Group h={22} bg="blue.9" px="xs" justify="space-between" style={{ fontSize: 12, color: 'white' }}>
      <Group gap="xs">
        <Group gap={4}>
            <IconBrandGithub size={12} />
            <Text size="xs">master*</Text>
        </Group>
        <Group gap={4}>
            <IconCheck size={12} />
            <Text size="xs">Ready</Text>
        </Group>
      </Group>
      <Group gap="xs">
        <Text size="xs">UTF-8</Text>
        <Text size="xs">YAML</Text>
        <Text size="xs">Chemdah</Text>
      </Group>
    </Group>
  );
}
