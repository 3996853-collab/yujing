'use client';

import React, { useRef, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useRuleStore } from '../../store/ruleStore';
import TriggerNode from './nodes/TriggerNode';
import TrajectoryNode from './nodes/TrajectoryNode';
import WeighingNode from './nodes/WeighingNode';
import EscalationNode from './nodes/EscalationNode';

// Map node types
const nodeTypes = {
  trigger: TriggerNode,
  trajectory: TrajectoryNode,
  weighing: WeighingNode,
  escalation: EscalationNode,
};

function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const nodes = useRuleStore((state) => state.nodes);
  const edges = useRuleStore((state) => state.edges);
  const onNodesChange = useRuleStore((state) => state.onNodesChange);
  const onEdgesChange = useRuleStore((state) => state.onEdgesChange);
  const onConnect = useRuleStore((state) => state.onConnect);
  const addNode = useRuleStore((state) => state.addNode);

  // Drag over handler
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Drop handler
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      const skill = JSON.parse(rawData);

      // Find drop coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Map categories to React Flow node types
      let nodeType = 'trajectory';
      if (skill.category === 'Equipment-System') {
        nodeType = 'weighing';
      } else if (skill.category === 'Actions') {
        nodeType = 'escalation';
      } else if (skill.id && (skill.id.includes('weighing') || skill.id.includes('deviation') || skill.id.includes('dws'))) {
        nodeType = 'weighing';
      }

      addNode(nodeType, position, skill);
    },
    [screenToFlowPosition, addNode]
  );

  return (
    <div className="relative w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        className="w-full h-full"
      >
        <Background color="#1e293b" gap={16} size={1} />
        <Controls className="!bg-gray-900 !border-gray-800 !text-gray-300" />
        <MiniMap 
          className="!bg-gray-950/80 !border-gray-800 !rounded-lg overflow-hidden" 
          nodeColor={(node) => {
            if (node.type === 'trigger') return '#10b981';
            if (node.type === 'trajectory') return '#a855f7';
            if (node.type === 'weighing') return '#f97316';
            if (node.type === 'escalation') return '#ec4899';
            return '#64748b';
          }}
          maskColor="rgba(0, 0, 0, 0.6)"
        />
      </ReactFlow>
    </div>
  );
}

export default function SkillCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
