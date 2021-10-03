export interface NodeState {
  // reserved keys, can customize initial value
  name: string;
  // 0 (unchecked, default) | 0.5 (half checked) | 1(checked),
  checked?: 0 | 0.5 | 1;
  isOpen?: boolean;
  children?: NodeState[];

  // internal keys (auto generated), plz don't include them in the initial data
  // path is an array of indexes to this node from root node
  path?: Array<unknown>;
  _id?: number;

  // will contain the full path to the file or folder
  filePath: string;

  // id of the file
  fileID: string;
}

export default class TreeNode {
  children: TreeNode[] = [];

  parent: TreeNode | null;

  name: string;

  path: string;

  id: string;

  depth: number;

  constructor(
    parent: TreeNode | null,
    name: string,
    id: string,
    depth: number,
    path: string
  ) {
    this.parent = parent;
    this.name = name;
    this.id = id;
    this.depth = depth;
    this.path = path;
  }

  addChild(child: TreeNode): void {
    this.children.push(child);
  }

  hasChild(): boolean {
    return this.children.length > 0;
  }

  toString(): string {
    const thisNodePart = `|${this.name}(id:${this.id}, path:${this.path}, depth:${this.depth})`;
    const childrenPart = this.hasChild()
      ? `\n${'\t'.repeat(this.depth + 1)}${this.children
          .map((child) => child.toString())
          .join(`\n${'\t'.repeat(this.depth + 1)}`)}`
      : '';
    return thisNodePart + childrenPart;
  }

  /**
   * Return the node as a state object for react-folder-tree
   * https://github.com/shunjizhan/react-folder-tree#-custom-initial-state
   */
  toState(): NodeState {
    let state: NodeState = {
      name: this.name,
      filePath: this.path,
      fileID: this.id,
    };

    if (this.hasChild())
      state = {
        children: this.children.map((child) => child.toState()),
        ...state,
      };

    return state;
  }
}
