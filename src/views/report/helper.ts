/**
 * @description: 将级联组件的二维数组值转为去重后的树形结构
 * @param {any} paths
 * @return {*}
 */
export function buildUniqueTree(paths: any[]) {
  const nodeMap = new Map()
  // 构建节点映射表
  paths.forEach(path => {
    let parentId: null = null
    path.forEach((nodeId: null) => {
      if (!nodeMap.has(nodeId)) {
        nodeMap.set(nodeId, {
          id: nodeId,
          parentId: parentId,
          children: []
        })
      }
      const currentNode = nodeMap.get(nodeId)
      if (parentId !== null) {
        const parentNode = nodeMap.get(parentId)
        if (!parentNode.children.includes(nodeId)) {
          parentNode.children.push(nodeId)
        }
      }
      parentId = nodeId
    })
  })
  // 构建树形结构
  const buildTree = (parentId: null) => {
    const nodes: any[] = []
    nodeMap.forEach(node => {
      if (node.parentId === parentId) {
        nodes.push({
          ...node,
          children: buildTree(node.id)
        })
      }
    })
    return nodes
  }
  return buildTree(null)
}

/**
 * @description: 根据级联全量树更新转换后的结果树，添加名称和子节点数量
 * @return {*}
 */
export function updateResultWithNameAndCount(
  channelTree: any[],
  resultTree: any[],
  field = { value: 'code', label: 'name', children: 'child' }
) {
  // 构建渠道树的映射，使用 code 作为键
  const channelMap = new Map()
  function buildChannelMap(nodes: any[]) {
    nodes.forEach(node => {
      channelMap.set(node[field.value], node)
      if (node[field.children]) {
        buildChannelMap(node[field.children])
      }
    })
  }
  buildChannelMap(channelTree)
  // 递归更新结果树节点
  function updateNode(resultNode: {
    [x: string]: any
    id: any
    childrenCount: any
    children: any[]
  }) {
    const channelNode = channelMap.get(resultNode.id) // 假设结果树使用 id 作为标识
    if (channelNode) {
      resultNode[field.label] = channelNode[field.label]
      // 使用渠道树的子节点数量
      resultNode.childrenCount = channelNode[field.children]
        ? channelNode[field.children].length
        : 0
    } else {
      // 如果渠道树中没有该节点，保留结果树的子节点数量
      resultNode.childrenCount = resultNode.children ? resultNode.children.length : 0
    }

    if (resultNode.children) {
      resultNode.children.forEach(child => {
        updateNode(child)
      })
    }
    return resultNode
  }

  return resultTree.map(resultNode => updateNode(resultNode))
}

/**
 * @description: 提取结果树中的name
 * @param {any} resultTree
 * @return {*}
 */
export function getMatchingNames(resultTree: any[]): any {
  const matchingNames = new Set()
  for (const oneItem of resultTree) {
    if (oneItem.children && oneItem.children.length === oneItem.childrenCount) {
      matchingNames.add(oneItem.name)
    } else {
      for (const twoItem of oneItem.children) {
        if (twoItem.children && twoItem.children.length === twoItem.childrenCount) {
          matchingNames.add(twoItem.name)
        } else {
          for (const threeItem of twoItem.children) {
            if (threeItem.children && threeItem.children.length === threeItem.childrenCount) {
              matchingNames.add(threeItem.name)
            }
          }
        }
      }
    }
  }

  return Array.from(matchingNames)
}

/**
 * @description: 获取二维数组中的每一项的最后一个值
 * @param {any} result
 * @return {*}
 */
export function getArrByResult(result: any[]) {
  if (!result || result.length === 0) {
    return result
  }
  const arr = []

  for (const element of result) {
    const lastStr = element[element.length - 1]
    arr.push(lastStr)
  }
  return arr
}

export function getTagNameByCode(
  tree: any[],
  codeArray: any[],
  field = { value: 'tagCode', label: 'tagName', children: 'child' }
) {
  function findTagByCode(nodes: string | any[], code: any): any {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (node[field.value] === code) {
        return node[field.label]
      }
      if (node[field.children] && node[field.children].length > 0) {
        const result = findTagByCode(node[field.children], code)
        if (result) {
          return result
        }
        // 处理三级树结构，检查子节点的子节点
        for (let j = 0; j < node[field.children].length; j++) {
          const grandChild = node[field.children][j]
          if (grandChild[field.children] && grandChild[field.children].length > 0) {
            const grandResult = findTagByCode(grandChild[field.children], code)
            if (grandResult) {
              return grandResult
            }
          }
        }
      }
    }
    return null
  }

  return codeArray.map(subArray => {
    return subArray.map((code: any) => {
      return findTagByCode(tree, code)
    })
  })
}
