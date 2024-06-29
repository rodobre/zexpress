import {
  Condition,
  HandleType,
  type ComponentOutcomeNode,
  type CustomRuleNode,
  type Graph,
  type JsonOutcomeNode,
  type Node,
  type NodeConnection,
  type WebhookNode,
} from 'decision-engine/Types'

const processCondition = (
  inputData: Record<string, any>,
  input: string,
  condition: Condition,
  value: string,
  matchRegex?: string
) => {
  value = value.toString()

  if (!Object.prototype.hasOwnProperty.call(inputData, input)) {
    return false
  }

  const inputValue = inputData[input]!.toString() as string

  switch (condition) {
    case Condition.Contains:
      return inputValue.includes(value)
    case Condition.EndsWith:
      return inputValue.endsWith(value)
    case Condition.StartsWith:
      return inputValue.startsWith(value)
    case Condition.Equals:
      return inputValue === value
    case Condition.Matches:
      if (!matchRegex) return false
      return !!inputValue.match(new RegExp(matchRegex))
    default:
      return false
  }
}

const sendWebhook = async ({
  method,
  headers,
  contentType,
  body,
  url,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers: Record<string, any>
  contentType: 'application/x-www-form-urlencoded' | 'application/json'
  body: string
  url: string
}) => {
  const req = await fetch(url, {
    method,
    headers: { ...headers, 'Content-Type': contentType },
    body,
  })

  return {
    response: req,
    data: await req.json(),
  }
}

const processNode = <T extends Node>(node: T) => {
  if (node.type === 'customRuleNode') {
    const castNode = node as unknown as CustomRuleNode
  } else if (node.type === 'webhook') {
    const castNode = node as unknown as WebhookNode
  } else if (node.type === 'JsonOutcomeNode') {
    const castNode = node as unknown as JsonOutcomeNode
  } else if (node.type === 'componentOutcomeNode') {
    const castNode = node as unknown as ComponentOutcomeNode
  }
}

const mapHandleType = (handleType: string): HandleType => {
  if (handleType === 'input') return HandleType.In
  if (handleType === 'out') return HandleType.Out
  if (handleType === 'yes') return HandleType.Yes
  if (handleType === 'no') return HandleType.No
  return HandleType.No
}

type OutgoingConnections = {
  [HandleType.Out]?: string
  [HandleType.Yes]?: string
  [HandleType.No]?: string
}

type EdgeStructure = {
  [nodeId: string]: {
    incoming: string[]
    outgoing: OutgoingConnections
  }
}

export const executeGraph = async (
  graph: Graph,
  inputData: Record<string, any>
) => {
  const inputNode = graph.nodes.find((node) => node.type === 'inputNode')
  if (!inputNode) throw new Error('No input node in graph')

  const hashNodes = Object.fromEntries(
    graph.nodes.map((node) => [node.id, node])
  )

  const edgeStruct: EdgeStructure = {}

  // Initialize the structure for all nodes
  graph.nodes.forEach((node) => {
    edgeStruct[node.id] = {
      incoming: [],
      outgoing: {},
    }
  })

  // Populate the edge structure
  graph.edges.forEach((edge) => {
    const { source, target, sourceHandle, targetHandle } = edge
    edgeStruct[target].incoming.push(source)

    const handleType = mapHandleType(sourceHandle?.split('-')[0] || 'out')
    if (handleType !== HandleType.In) {
      edgeStruct[source].outgoing[handleType] = target
    }
  })

  const processNodeRecursive = async (
    nodeId: string,
    data: Record<string, any>
  ): Promise<any> => {
    const node = hashNodes[nodeId]
    if (!node) {
      return null
    }

    let result: any = {}
    let nextNodeId: string | undefined

    switch (node.type) {
      case 'inputNode':
        result = { ...data }
        nextNodeId = edgeStruct[nodeId].outgoing[HandleType.Out]
        break

      case 'customRuleNode':
        const customRuleNode = node as CustomRuleNode
        const { inputKey, condition, value } =
          customRuleNode.data.nodeData.logicParameters.customRuleProperties
        const conditionResult = processCondition(
          data,
          inputKey,
          condition as Condition,
          value
        )
        result = { conditionResult }
        nextNodeId =
          edgeStruct[nodeId].outgoing[
            conditionResult ? HandleType.Yes : HandleType.No
          ]
        break

      case 'webhook':
        const webhookNode = node as WebhookNode
        const { method, url, headers, body, bodyInputMode } =
          webhookNode.data.nodeData.logicParameters.webhookProperties
        const webhookResult = await sendWebhook({
          method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
          headers,
          contentType: bodyInputMode as
            | 'application/x-www-form-urlencoded'
            | 'application/json',
          body,
          url,
        })
        result = webhookResult.data
        nextNodeId = edgeStruct[nodeId].outgoing[HandleType.Out]
        break

      case 'jsonOutcomeNode':
        const jsonOutcomeNode = node as JsonOutcomeNode
        result = JSON.parse(
          jsonOutcomeNode.data.nodeData.logicParameters.jsonOutcomeProperties
            .jsonContent
        )
        return result // End of path, return the result

      case 'componentOutcomeNode':
        const componentOutcomeNode = node as ComponentOutcomeNode
        result =
          componentOutcomeNode.data.nodeData.logicParameters
            .componentOutcomeProperties.selectedComponent
        return result // End of path, return the result

      default:
        console.error('Unhandled node type:', node.type)
    }

    if (nextNodeId) {
      const nextResult = await processNodeRecursive(nextNodeId, {
        ...data,
        ...result,
      })
      return { ...result, ...nextResult }
    }

    return result
  }

  // Start processing from the input node
  const finalResult = await processNodeRecursive(inputNode.id, inputData)
  return finalResult
}
