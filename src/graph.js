const addNode = (graph, node) => {
    graph.set(node, {in: new Set(), out: new Set()});
  };
  
  const connectNodes = (graph, source, target) => {
    graph.get(source).out.add(target);
    graph.get(target).in.add(source);
  };
  
  const buildGraphFromEdges = (edges) => edges.reduce(
    (graph, {source, target}) => {
      if (!graph.has(source)) {
        addNode(graph, source);
      }
  
      if (!graph.has(target)) {
        addNode(graph, target);
      }
  
      connectNodes(graph, source, target);
  
      return graph;
    },
    new Map()
  );
  
  const buildPath = (target, path) => {
    const result = [];
  
    while (path.has(target)) {
      const source = path.get(target);
      result.push({source, target});
      target = source;
    }
  
    return result.reverse();
  };
  
  const findPath = (source, target, graph) => {
    if (!graph.has(source)) {
      throw new Error('Unknown source.');
    }
  
    if (!graph.has(target)) {
      throw new Error('Unknown target.');
    }
  
    const queue = [source];
    const visited = new Set();
    const path = new Map();
  
    while (queue.length > 0) {
      const start = queue.shift();
  
      if (start === target) {
        return buildPath(start, path);
      }
  
      for (const next of graph.get(start).out) {
        if (visited.has(next)) {
          continue;
        }
  
        if (!queue.includes(next)) {
          path.set(next, start);
          queue.push(next);
        }
      }
  
      visited.add(start);
    }
  
    return null;
  };
  
  //  A --* B
  //      / | \
  //     *  |  *
  //    C   |   D --* E
  //     \  |  /     *
  //      * * *     /
  //        F------/
  
  const graph = buildGraphFromEdges([
    { source: 'A', target: 'B' },
    { source: 'B', target: 'C' },
    { source: 'B', target: 'D' },
    { source: 'B', target: 'F' },
    { source: 'C', target: 'F' },
    { source: 'D', target: 'E' },
    { source: 'D', target: 'F' },
    { source: 'F', target: 'E' },
  ]);
  
  console.log('A -> A', findPath('A', 'A', graph)); // []
  console.log('A -> F', findPath('A', 'F', graph)); // [{source: 'A', target: 'B'}, {source: 'B', target: 'F'}]
  console.log('A -> E', findPath('A', 'E', graph)); // [{source: 'A', target: 'B'}, {source: 'B', target: 'D'}, {source: 'D', target: 'E'}]
  console.log('E -> A', findPath('E', 'A', graph)); // null