import { Modal, Tabs, Stack, Button, ActionIcon, Text, Box, ScrollArea, Title, Group, Accordion, Badge, ThemeIcon } from '@mantine/core';
import { IconMessage, IconUser, IconScript, IconSettings, IconPlus, IconTrash } from '@tabler/icons-react';
import { FormSection, FormInput, FormTextarea, AnimatedTabs, FormScript } from '../../ui';
import { AgentEditor } from '../quest/AgentEditor';
import { AgentNodeData } from './nodes/AgentNode';

interface ConversationNodeEditorProps {
    opened: boolean;
    onClose: () => void;
    data: AgentNodeData;
    onUpdate: (newData: AgentNodeData) => void;
}

export function ConversationNodeEditor({ opened, onClose, data, onUpdate }: ConversationNodeEditorProps) {
    
    const handleOptionChange = (idx: number, field: keyof AgentNodeData['playerOptions'][0], val: string) => {
        const newOptions = [...data.playerOptions];
        newOptions[idx] = { ...newOptions[idx], [field]: val };
        onUpdate({ ...data, playerOptions: newOptions });
    };

    const addOption = () => {
        const newOptions = [
            ...data.playerOptions, 
            { id: `${data.label}-opt-${Date.now()}`, text: 'New Option' }
        ];
        onUpdate({ ...data, playerOptions: newOptions });
    };

    const removeOption = (idx: number) => {
        const newOptions = [...data.playerOptions];
        newOptions.splice(idx, 1);
        onUpdate({ ...data, playerOptions: newOptions });
    };

    return (
        <Modal 
            opened={opened} 
            onClose={onClose} 
            withCloseButton={false}
            title={
                <Group className='p-4'>
                    <ThemeIcon size="lg" variant="light" color="blue">
                        <IconMessage size={20} />
                    </ThemeIcon>
                    <Stack gap={0}>
                        <Text fw={700} size="sm">编辑节点</Text>
                        <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>{data.label}</Text>
                    </Stack>
                </Group>
            }
            size="xl"
            padding={0}
            styles={{ body: { height: '70vh', display: 'flex', flexDirection: 'column' } }}
        >
            <AnimatedTabs
                defaultValue="basic"
                style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                tabs={[
                    { value: 'basic', label: '基础设置', icon: <IconSettings size={14} /> },
                    { value: 'npc', label: 'NPC 对话', icon: <IconMessage size={14} /> },
                    { value: 'player', label: '玩家选项', icon: <IconUser size={14} /> },
                    { value: 'agent', label: '脚本代理', icon: <IconScript size={14} /> }
                ]}
            >
                <ScrollArea style={{ flex: 1 }} bg="var(--mantine-color-dark-8)">
                    <Box p="md">
                        <Tabs.Panel value="basic">
                            <Stack gap="md">
                                <FormSection>
                                    <Title order={5} mb="xs">节点信息</Title>
                                    <FormInput 
                                        label="节点 ID" 
                                        description="对话节点的唯一标识符"
                                        value={data.label} 
                                        onChange={(e) => onUpdate({ ...data, label: e.currentTarget.value })} 
                                    />
                                </FormSection>
                                <FormSection>
                                    <Title order={5} mb="xs">触发条件</Title>
                                    <FormInput 
                                        label="NPC ID" 
                                        description="绑定触发此对话的 NPC ID (仅在入口节点需要)"
                                        placeholder="e.g. adyeshach test2"
                                        value={data.npcId || ''} 
                                        onChange={(e) => onUpdate({ ...data, npcId: e.currentTarget.value })} 
                                    />
                                    <FormScript 
                                        label="进入条件" 
                                        description="进入此节点所需的条件 (Kether 脚本)"
                                        height="100px"
                                        value={data.condition || ''} 
                                        onChange={(val) => onUpdate({ ...data, condition: val || '' })} 
                                    />
                                </FormSection>
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="npc">
                            <Stack gap="md">
                                <FormSection>
                                    <Title order={5} mb="xs">NPC 发言内容</Title>
                                    <FormTextarea 
                                        minRows={5}
                                        value={data.npcLines.join('\n')} 
                                        onChange={(e) => onUpdate({ ...data, npcLines: e.currentTarget.value.split('\n') })}
                                    />
                                </FormSection>
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="player">
                            <Stack gap="md">
                                <Accordion variant="separated" radius="md">
                                    {data.playerOptions.map((opt, idx) => (
                                        <Accordion.Item key={opt.id} value={opt.id}>
                                            <Accordion.Control>
                                                <Group justify="space-between" pr="md">
                                                    <Group gap="sm">
                                                        <Text fw={500}>{opt.text || `选项 #${idx + 1}`}</Text>
                                                        {opt.condition && <Badge size="xs" variant="outline" color="blue">Condition</Badge>}
                                                        {opt.actions && <Badge size="xs" variant="outline" color="orange">Script</Badge>}
                                                    </Group>
                                                    <ActionIcon 
                                                        color="red" 
                                                        variant="subtle" 
                                                        size="sm" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeOption(idx);
                                                        }}
                                                    >
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Group>
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                <Stack gap="sm">
                                            <FormInput 
                                                label="回复文本"
                                                placeholder="玩家点击的按钮文本"
                                                value={opt.text}
                                                onChange={(e) => handleOptionChange(idx, 'text', e.currentTarget.value)}
                                            />
                                            <FormScript 
                                                label="显示条件 (if)"
                                                height="80px"
                                                value={opt.condition || ''}
                                                onChange={(val) => handleOptionChange(idx, 'condition', val || '')}
                                            />
                                                    <FormScript
                                                        label="执行动作 (then)"
                                                        description="点击后执行的脚本"
                                                        height="100px"
                                                        value={opt.actions || ''}
                                                        onChange={(val) => handleOptionChange(idx, 'actions', val || '')}
                                                    />
                                                </Stack>
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                                
                                <Button variant="light" leftSection={<IconPlus size={16} />} onClick={addOption} fullWidth>
                                    添加回复选项
                                </Button>
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="agent">
                            <FormSection>
                                <Title order={5} mb="xs">生命周期脚本</Title>
                                <AgentEditor 
                                    data={data.agent || {}} 
                                    onUpdate={(newAgent) => onUpdate({ ...data, agent: newAgent })}
                                    types={['begin', 'end', 'refuse']}
                                />
                            </FormSection>
                        </Tabs.Panel>
                    </Box>
                </ScrollArea>
            </AnimatedTabs>
        </Modal>
    );
}
