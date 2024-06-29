interface MarkerEnd {
  type: string
  color: string
}

interface Edge {
  animated: boolean
  type: string
  markerEnd: MarkerEnd
  style: {
    strokeWidth: number
    stroke: string
  }
  source: string
  sourceHandle: string | null
  target: string
  targetHandle: string
  id: string
}

interface Position {
  x: number
  y: number
}

interface BaseNodeData {
  label: string
  nodeData: {
    logicParameters?: {
      [key: string]: any
    }
  }
}

export interface Node {
  id: string
  position: Position
  data: BaseNodeData
  type: string
  width: number
  height: number
  selected: boolean
  positionAbsolute: Position
  dragging: boolean
}

export interface CustomRuleNode extends Node {
  type: 'customRuleNode'
  data: BaseNodeData & {
    nodeData: {
      logicParameters: {
        customRuleProperties: {
          inputKey: string
          condition: string
          value: string
        }
      }
    }
  }
}

export interface WebhookNode extends Node {
  type: 'webhook'
  data: BaseNodeData & {
    nodeData: {
      logicParameters: {
        webhookProperties: {
          method: string
          url: string
          headers: Record<string, string>
          body: string
          bodyInputMode: string
        }
      }
    }
  }
}

export interface JsonOutcomeNode extends Node {
  type: 'jsonOutcomeNode'
  data: BaseNodeData & {
    nodeData: {
      logicParameters: {
        jsonOutcomeProperties: {
          jsonContent: string
        }
      }
    }
  }
}

export interface ComponentOutcomeNode extends Node {
  type: 'componentOutcomeNode'
  data: BaseNodeData & {
    nodeData: {
      logicParameters: {
        componentOutcomeProperties: {
          selectedComponent: string
        }
      }
    }
  }
}

export interface Graph {
  edges: Edge[]
  nodes: (
    | Node
    | CustomRuleNode
    | WebhookNode
    | JsonOutcomeNode
    | ComponentOutcomeNode
  )[]
}

export enum HandleType {
  In,
  Out,
  Yes,
  No,
}

export interface NodeConnection {
  [HandleType.In]: string[]
  [HandleType.Out]: string // id;
  [HandleType.Yes]: string
  [HandleType.No]: string
}

export enum Condition {
  StartsWith = 'startsWith',
  EndsWith = 'endsWith',
  Equals = 'equals',
  Contains = 'contains',
  Matches = 'matches',
}
