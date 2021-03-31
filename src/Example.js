import React, { useEffect, useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import useLocalStorage from "./useLocalStorage";


function Example({name}) {
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
  
  const marketing = ['Home_appliances','garden_items','Junction1'];

  const buildPath = (target, path) => {
    const result = [];
  
    while (path.has(target)) {
      const source = path.get(target);
      result.push({source, target});
      target = source;
    }
  
    return result.reverse();
  };
  
  const dir = {
    Entrance : {
      Junction1 : 'you are at entrance walk 20 steps ahead to reach junction 1'
    },
    Junction1 : {
        Entrance : 'you are at Junction 1 walk 20 steps ahead to reach Entrance',
        garden_items : 'you are at junction 1 turn left and walk 10 steps to reach garden items',
        Toys_section : 'you are at junction 1 turn right and walk 10 steps to reach toys section',
        Junction2 : 'you are at junction 1 walk 10 steps ahead to reach junction 2'
    },
    garden_items :{
        Junction1 : 'you are at garden items turn back and walt 10 steps to reach junction 1'
    },

    Junction2 : {
       Junction1 :  'you are at junction 2 walk 10 steps ahead to reach junction 1',
       Home_appliances : 'you are at junction 2 turn right and walk 10 steps to reach home appliances section',
       Furniture_section : 'you are at junction 2 walk 15 steps ahead to reach furniture section',
       cosmetics : 'you are at junction 2 turn left and walk 10 steps to reach cosmetics section'
    },
    Toys_section : {
        Junction1 : 'you are at toys section turn back and walk 10 steps to reach junction 1'
    },
    cosmetics : {
      Junction2 : 'you are at cosmetics section turn back and walk 10 steps to junction 2'
    },
    Home_appliances : {
      Junction2 : 'you are at home appliances section turn back  and walk 10 steps to reach junction 2'
    },
    Furniture_section : {
      Junction2 : 'you are at furniture section turn back and walk 15 steps to reach junction 2'
    }
  }


  const graph = buildGraphFromEdges([
    { source: 'Entrance', target: 'Junction1' ,
     t : 'you are at entrance walk 20 steps ahead to reach junction 1'},
    { source: 'Junction1', target: 'Entrance',
    t: 'you are at Junction 1 walk 20 steps ahead to reach Entrance' },
    { source: 'Junction1', target: 'garden_items',
    t: 'you are at junction 1 turn left and walk 10 steps to reach garden items' },
    { source: 'garden_items', target: 'Junction1',
     t: 'you are at garden items turn back and walt 10 steps to reach junction 1'},
    { source: 'Junction1', target: 'Toys_section',
    t: 'you are at junction 1 turn right and walk 10 steps to reach toys section' },
    { source: 'Toys_section', target: 'Junction1',
    t: 'you are at toys section turn back and walk 10 steps to reach junction 1' },
    { source: 'Junction1', target: 'Junction2',
    t: 'you are at junction  1 walk 10 steps ahead to reach junction 2' },
    { source: 'Junction2', target: 'Junction1',
    t: 'you are at junction 2 walk 10 steps ahead to reach junction 1'},
    { source: 'Junction2', target: 'cosmetics',
    t: 'you are at junction 2 turn left and walk 10 steps to reach cosmetics section'},
    { source: 'cosmetics', target: 'Junction2',
    t: 'you are at cosmetics section turn back and walk 10 steps to junction 2'},
    { source: 'Junction2', target: 'Home_appliances',
    t: 'you are at junction 2 turn right and walk 10 steps to reach home appliances section'},
    { source: 'Home_appliances', target: 'Junction2',
    t: 'you are at home appliances section turn back  and walk 10 steps to reach junction 2'},
    { source: 'Junction2', target: 'Furniture_section',
    t: 'you are at junction 2 walk 15 steps ahead to reach furniture section'},
    { source: 'Furniture_section', target: 'Junction2',
    t: 'you are at furniture section turn back and walk 15 steps to reach junction 2'}
   ]);
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


  const [current_node,setNode] = useLocalStorage("current_node",{});

 useEffect(()=>{
   if(!localStorage.getItem('current_node')) {
    setNode({node : 'Entrance'});
    }
   },[]);

  const x = localStorage.getItem('current_node');
  const xx = JSON.parse(x);
  const y = localStorage.getItem('destination');
  const yy = JSON.parse(y);

  const [arr, setValue] = useState((findPath(xx.node , yy.node , graph))
    );
  const { speak } = useSpeechSynthesis();
    
  async function handlclick() { 
    if(arr[0]==undefined){ speak({text: "You have reached your destination"});
    if(marketing.includes(yy.node)) {
      speak({text : `we have some new amazing items in ${yy.node} today`});
    };
      }
    else {
    console.log(arr[0]);
    const a1 = arr[0].source;
    const a2 = arr[0].target;
    if(marketing.includes(a1)) {
      speak({text : `we have some new amazing items in ${a1} today`});
    };
    speak({text: dir[a1][a2] });
    const Array = arr.splice(1);
    await setValue(Array);
    console.log(arr);
    }
  };

return (
    <div onClick={handlclick} appName="fullscreen">
      <button >Go show me directions</button>
    </div>
  );
}

export default Example;