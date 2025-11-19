import { useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, Connection, Edge, Node, Panel } from 'reactflow';
import { Paper, Text, Button, Stack } from '@mantine/core';
import { useProjectStore } from '../../../store/useProjectStore';
import { toYaml } from '../../../utils/yaml-utils';
import { IconPlus } from '@tabler/icons-react';

const initialNodes: Node[] = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'NPC: Hello!' }, type: 'input', style: { background: '#1c7ed6', color: 'white', border: 'none' } },
];

export default function FlowCanvas({ fileId }: { fileId: string }) {
  const { updateFileContent } = useProjectStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges],
  );

  const addNode = (type: 'npc' | 'player') => {
    const id = (nodes.length + 1).toString();
    const newNode: Node = {
        id,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: type === 'npc' ? 'NPC: ...' : 'Player: ...' },
        type: type === 'npc' ? 'default' : 'output',
        style: type === 'npc' 
            ? { background: '#1c7ed6', color: 'white', border: 'none' }
            : { background: '#40c057', color: 'white', border: 'none' }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // Sync Flow -> YAML
  const generateYamlFromFlow = () => {
    const conversationObj: any = {
        'conversation_root': {
            npc: [],
            player: []
        }
    };
    
    nodes.forEach((node: Node) => {
        const label = node.data.label;
        if (label.startsWith('NPC:')) {
            conversationObj['conversation_root'].npc.push(label.replace('NPC: ', ''));
        } else if (label.startsWith('Player:')) {
            conversationObj['conversation_root'].player.push({
                reply: label.replace('Player: ', ''),
                then: 'goto next_node'
            });
        }
    });

    updateFileContent(fileId, 'conversation', toYaml(conversationObj));
  };

  return (
    <Paper h="100%" radius={0} style={{ overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--mantine-color-dark-6)' }}>
        <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                proOptions={{ hideAttribution: true }}
                style={{ width: '100%', height: '100%' }}
            >
                <Background color="#333" gap={16} />
                <Controls />
                <MiniMap style={{ backgroundColor: '#1a1b1e' }} nodeColor="#4dabf7" />
                <Panel position="top-left">
                    <Stack gap="xs" p="xs" bg="rgba(0,0,0,0.7)" style={{ borderRadius: 8 }}>
                        <Text size="xs" fw={700} c="dimmed">工具栏</Text>
                        <Button size="xs" variant="filled" color="blue" leftSection={<IconPlus size={12} />} onClick={() => addNode('npc')}>
                            添加 NPC 节点
                        </Button>
                        <Button size="xs" variant="filled" color="green" leftSection={<IconPlus size={12} />} onClick={() => addNode('player')}>
                            添加玩家节点
                        </Button>
                        <Button size="xs" variant="light" onClick={generateYamlFromFlow}>
                            同步到 YAML
                        </Button>
                    </Stack>
                </Panel>
            </ReactFlow>
        </div>
    </Paper>
  );
}
