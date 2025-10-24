import TriggerNode from './TriggerNode';
import HttpNode from './HttpNode';
import AiNode from './AiNode';
import LogicNode from './LogicNode';
import OutputNode from './OutputNode';

export const nodeTypes = {
  trigger: TriggerNode,
  http: HttpNode,
  ai: AiNode,
  logic: LogicNode,
  output: OutputNode,
};
