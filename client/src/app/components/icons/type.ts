import { NodeState } from '../../../utils/file-tree-node';

export default interface IconProps {
  nodeData: NodeState;
  onClick: () => void;
}
