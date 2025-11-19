import { Button, Group, FileButton } from '@mantine/core';
import { IconDownload, IconUpload } from '@tabler/icons-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useEditorStore } from '../../store/useEditorStore';

export default function ProjectControls() {
  const { questYaml, conversationYaml, setQuestYaml, setConversationYaml } = useEditorStore();

  const handleExport = async () => {
    const zip = new JSZip();
    zip.file("quest.yml", questYaml);
    zip.file("conversation.yml", conversationYaml);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "chemdah-project.zip");
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;
    const zip = new JSZip();
    try {
      const contents = await zip.loadAsync(file);
      if (contents.files["quest.yml"]) {
        const q = await contents.files["quest.yml"].async("string");
        setQuestYaml(q);
      }
      if (contents.files["conversation.yml"]) {
        const c = await contents.files["conversation.yml"].async("string");
        setConversationYaml(c);
      }
    } catch (e) {
      console.error("Failed to load zip", e);
      alert("Failed to load project file.");
    }
  };

  return (
    <Group>
      <FileButton onChange={handleImport} accept=".zip">
        {(props) => <Button {...props} variant="default" size="xs" leftSection={<IconUpload size={14} />}>Import</Button>}
      </FileButton>
      <Button onClick={handleExport} variant="default" size="xs" leftSection={<IconDownload size={14} />}>Export</Button>
    </Group>
  );
}
