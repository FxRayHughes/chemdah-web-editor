import { Stack, Tooltip, UnstyledButton, rem } from '@mantine/core';
import { IconFiles, IconSettings, IconSearch, IconGitBranch } from '@tabler/icons-react';
import classes from './ActivityBar.module.css';

interface ActivityBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const mockData = [
  { icon: IconFiles, label: 'Explorer', id: 'explorer' },
  { icon: IconSearch, label: 'Search', id: 'search' },
  { icon: IconGitBranch, label: 'Source Control', id: 'git' },
  { icon: IconSettings, label: 'Settings', id: 'settings' },
];

export function ActivityBar({ activeTab, onTabChange }: ActivityBarProps) {
  const links = mockData.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => onTabChange(link.id)}
        className={classes.link}
        data-active={activeTab === link.id || undefined}
      >
        <link.icon style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  return (
    <nav className={classes.navbar}>
      <Stack justify="center" gap={0}>
        {links}
      </Stack>
    </nav>
  );
}
