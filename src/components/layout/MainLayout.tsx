import { Box, Flex } from '@mantine/core';
import { useState } from 'react';
import { ActivityBar } from './IDE/ActivityBar';
import { Sidebar } from './IDE/Sidebar';
import { StatusBar } from './IDE/StatusBar';
import { useProjectStore } from '../../store/useProjectStore';
import QuestEditor from '../editors/quest/QuestEditor';
import ConversationEditor from '../editors/conversation/ConversationEditor';
import YamlPreview from '../common/YamlPreview';

export default function MainLayout() {
  const [activeActivity, setActiveActivity] = useState('explorer');
  const { activeFileId, files } = useProjectStore();

  const activeFile = activeFileId ? files[activeFileId] : null;

  const renderEditor = () => {
    if (!activeFile) {
        return (
            <Flex justify="center" align="center" h="100%" c="dimmed">
                Select a file to edit
            </Flex>
        );
    }

    switch (activeFile.type) {
        case 'quest':
            return <QuestEditor fileId={activeFile.id} />;
        case 'conversation':
            return <ConversationEditor fileId={activeFile.id} />;
        default:
            return <YamlPreview value={activeFile.content} title={activeFile.name} />;
    }
  };

  return (
    <Flex direction="column" h="100vh" style={{ overflow: 'hidden' }}>
      <Flex style={{ flex: 1, overflow: 'hidden' }}>
        <ActivityBar activeTab={activeActivity} onTabChange={setActiveActivity} />
        {activeActivity === 'explorer' && <Sidebar />}
        <Box style={{ flex: 1, overflow: 'hidden', backgroundColor: '#1e1e1e' }}>
            {renderEditor()}
        </Box>
      </Flex>
      <StatusBar />
    </Flex>
  );
}
