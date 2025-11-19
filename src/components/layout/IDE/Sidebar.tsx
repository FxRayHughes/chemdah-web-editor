import { Text, Group, UnstyledButton, Collapse, ScrollArea, ActionIcon } from '@mantine/core';
import { IconChevronRight, IconFileText, IconFolder, IconFolderOpen, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useProjectStore, VirtualFile } from '../../../store/useProjectStore';
import classes from './Sidebar.module.css';

export function Sidebar() {
  const { files, activeFileId, setActiveFile, createFile, deleteFile } = useProjectStore();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ 'core': true, 'core/quest': true, 'core/conversation': true });

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  // Group files by path
  const fileTree = Object.values(files).reduce((acc, file) => {
    const parts = file.path.split('/');
    let currentLevel = acc;
    parts.forEach((part) => {
      if (!currentLevel[part]) {
        currentLevel[part] = { __files: [] };
      }
      currentLevel = currentLevel[part];
    });
    currentLevel.__files.push(file);
    return acc;
  }, {} as any);

  const renderTree = (node: any, path: string = '') => {
    return Object.keys(node).map(key => {
      if (key === '__files') {
        return node[key].map((file: VirtualFile) => (
          <div key={file.id} className={classes.fileWrapper} style={{ display: 'flex', alignItems: 'center', paddingRight: 8 }}>
            <UnstyledButton
                className={classes.file}
                data-active={activeFileId === file.id || undefined}
                onClick={() => setActiveFile(file.id)}
                style={{ flex: 1 }}
            >
                <IconFileText size={14} style={{ marginRight: 8 }} />
                <Text size="sm" truncate>{file.name}</Text>
            </UnstyledButton>
            <ActionIcon 
                size="xs" 
                variant="subtle" 
                color="red" 
                onClick={(e) => {
                    e.stopPropagation();
                    if(confirm('Delete ' + file.name + '?')) deleteFile(file.id);
                }}
                style={{ opacity: 0.5 }}
            >
                <IconTrash size={12} />
            </ActionIcon>
          </div>
        ));
      }

      const currentPath = path ? `${path}/${key}` : key;
      const isExpanded = expandedFolders[currentPath];

      return (
        <div key={currentPath}>
          <UnstyledButton className={classes.folder} onClick={() => toggleFolder(currentPath)}>
            <IconChevronRight
              size={14}
              style={{ 
                marginRight: 4, 
                transform: isExpanded ? 'rotate(90deg)' : 'none',
                transition: 'transform 200ms ease'
              }} 
            />
            {isExpanded ? <IconFolderOpen size={14} style={{ marginRight: 8, color: '#dcb67a' }} /> : <IconFolder size={14} style={{ marginRight: 8, color: '#dcb67a' }} />}
            <Text size="sm" fw={500}>{key}</Text>
          </UnstyledButton>
          <Collapse in={isExpanded}>
            <div style={{ paddingLeft: 12 }}>
              {renderTree(node[key], currentPath)}
            </div>
          </Collapse>
        </div>
      );
    });
  };

  return (
    <div className={classes.sidebar}>
      <Group justify="space-between" p="xs" className={classes.header}>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed">Explorer</Text>
        <Group gap={4}>
            <ActionIcon size="xs" variant="subtle" onClick={() => createFile('new_quest.yml', 'quest', 'core/quest')}>
                <IconPlus size={12} />
            </ActionIcon>
        </Group>
      </Group>
      <ScrollArea style={{ flex: 1 }}>
        <div className={classes.content}>
            {renderTree(fileTree)}
        </div>
      </ScrollArea>
    </div>
  );
}
