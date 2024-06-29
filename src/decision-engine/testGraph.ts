import type { Graph } from 'decision-engine/Types'

export const graph: Graph = {
  edges: [
    {
      animated: false,
      type: 'smoothstep',
      markerEnd: {
        type: 'arrowclosed',
        color: '#000',
      },
      style: {
        strokeWidth: 2,
        stroke: '#000',
      },
      source: '1',
      sourceHandle: null,
      target: 'dndnode_94afb463-6845-42eb-bff9-8c877699e49e',
      targetHandle: 'input-dndnode_94afb463-6845-42eb-bff9-8c877699e49e',
      id: 'reactflow__edge-1-dndnode_94afb463-6845-42eb-bff9-8c877699e49einput-dndnode_94afb463-6845-42eb-bff9-8c877699e49e',
    },
    {
      animated: false,
      type: 'smoothstep',
      markerEnd: {
        type: 'arrowclosed',
        color: '#000',
      },
      style: {
        strokeWidth: 2,
        stroke: '#000',
      },
      source: 'dndnode_94afb463-6845-42eb-bff9-8c877699e49e',
      sourceHandle: 'yes-dndnode_94afb463-6845-42eb-bff9-8c877699e49e',
      target: 'dndnode_8c100aea-d62a-4095-ac1c-4f2b077d6425',
      targetHandle: 'input-dndnode_8c100aea-d62a-4095-ac1c-4f2b077d6425',
      id: 'reactflow__edge-dndnode_94afb463-6845-42eb-bff9-8c877699e49eyes-dndnode_94afb463-6845-42eb-bff9-8c877699e49e-dndnode_8c100aea-d62a-4095-ac1c-4f2b077d6425input-dndnode_8c100aea-d62a-4095-ac1c-4f2b077d6425',
    },
    {
      animated: false,
      type: 'smoothstep',
      markerEnd: {
        type: 'arrowclosed',
        color: '#000',
      },
      style: {
        strokeWidth: 2,
        stroke: '#000',
      },
      source: 'dndnode_cb086f43-e539-43d1-a62b-0012f1377835',
      sourceHandle: 'out-dndnode_cb086f43-e539-43d1-a62b-0012f1377835',
      target: 'dndnode_c9e10439-4c02-4007-989e-9c04e607e402',
      targetHandle: 'input-dndnode_c9e10439-4c02-4007-989e-9c04e607e402',
      id: 'reactflow__edge-dndnode_cb086f43-e539-43d1-a62b-0012f1377835out-dndnode_cb086f43-e539-43d1-a62b-0012f1377835-dndnode_c9e10439-4c02-4007-989e-9c04e607e402input-dndnode_c9e10439-4c02-4007-989e-9c04e607e402',
    },
    {
      animated: false,
      type: 'smoothstep',
      markerEnd: {
        type: 'arrowclosed',
        color: '#000',
      },
      style: {
        strokeWidth: 2,
        stroke: '#000',
      },
      source: 'dndnode_94afb463-6845-42eb-bff9-8c877699e49e',
      sourceHandle: 'no-dndnode_94afb463-6845-42eb-bff9-8c877699e49e',
      target: 'dndnode_cb086f43-e539-43d1-a62b-0012f1377835',
      targetHandle: 'input-dndnode_cb086f43-e539-43d1-a62b-0012f1377835',
      id: 'reactflow__edge-dndnode_94afb463-6845-42eb-bff9-8c877699e49eno-dndnode_94afb463-6845-42eb-bff9-8c877699e49e-dndnode_cb086f43-e539-43d1-a62b-0012f1377835input-dndnode_cb086f43-e539-43d1-a62b-0012f1377835',
    },
  ],
  nodes: [
    {
      id: '1',
      position: {
        x: -225.29537488659915,
        y: -48.29996012833275,
      },
      data: {
        label: 'A',
        nodeData: {},
      },
      type: 'inputNode',
      width: 158,
      height: 92,
      selected: false,
      positionAbsolute: {
        x: -225.29537488659915,
        y: -48.29996012833275,
      },
      dragging: false,
    },
    {
      id: 'dndnode_94afb463-6845-42eb-bff9-8c877699e49e',
      type: 'customRuleNode',
      position: {
        x: 112.1562121681103,
        y: -233.79111781360228,
      },
      data: {
        label: 'customRuleNode node',
        nodeData: {
          logicParameters: {
            customRuleProperties: {
              inputKey: 'hello',
              condition: 'equals',
              value: 'world',
            },
          },
        },
      },
      width: 120,
      height: 168,
      selected: false,
      positionAbsolute: {
        x: 112.1562121681103,
        y: -233.79111781360228,
      },
      dragging: false,
    },
    {
      id: 'dndnode_cb086f43-e539-43d1-a62b-0012f1377835',
      type: 'webhook',
      position: {
        x: 220.09328123058265,
        y: 19.066961541362353,
      },
      data: {
        label: 'webhook node',
        nodeData: {
          logicParameters: {
            webhookProperties: {
              method: 'POST',
              url: 'https://6unz7rw6.e90.io/abc',
              headers: {},
              body: '{"hello":"world"}',
              bodyInputMode: 'application/json',
            },
          },
        },
      },
      width: 343,
      height: 144,
      selected: false,
      positionAbsolute: {
        x: 220.09328123058265,
        y: 19.066961541362353,
      },
      dragging: false,
    },
    {
      id: 'dndnode_8c100aea-d62a-4095-ac1c-4f2b077d6425',
      type: 'jsonOutcomeNode',
      position: {
        x: 451.2958112520579,
        y: -288.10996806264075,
      },
      data: {
        label: 'jsonOutcomeNode node',
        nodeData: {
          logicParameters: {
            jsonOutcomeProperties: {
              jsonContent: '{"success":true}',
            },
          },
        },
      },
      width: 211,
      height: 116,
      selected: false,
      positionAbsolute: {
        x: 451.2958112520579,
        y: -288.10996806264075,
      },
      dragging: false,
    },
    {
      id: 'dndnode_c9e10439-4c02-4007-989e-9c04e607e402',
      type: 'jsonOutcomeNode',
      position: {
        x: 654.0092271049175,
        y: -69.9212954739306,
      },
      data: {
        label: 'jsonOutcomeNode node',
        nodeData: {
          logicParameters: {
            jsonOutcomeProperties: {
              jsonContent: '{"available":false}',
            },
          },
        },
      },
      width: 228,
      height: 116,
      selected: true,
      positionAbsolute: {
        x: 654.0092271049175,
        y: -69.9212954739306,
      },
      dragging: false,
    },
  ],
}
