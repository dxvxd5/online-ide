class Node {
    childrens:Node[]
    parent:Node
    name:string
    url:string

    constructor(parent:Node, name:string, id:string){
        this.parent = parent;
        this.name = name;
        this.url = id;
    }

    addChild(child:Node){
        this.children.
    }
}

const treeState = {
  name: 'root [half checked and opened]',
  checked: 0.5, // half check: some children are checked
  isOpen: true, // this folder is opened, we can see it's children
  children: [
    { name: 'children 1 [not checked]', checked: 0 },
    {
      name: 'children 2 [half checked and not opened]',
      checked: 0.5,
      isOpen: false,
      children: [
        { name: 'children 2-1 [not checked]', checked: 0 },
        { name: 'children 2-2 [checked]', checked: 1 },
      ],
    },
  ],
};

{
    // reserved keys, can customize initial value
    name: 'root node',  
    checked (optional): 0 (unchecked, default) | 0.5 (half checked) | 1(checked),
    isOpen (optional): true (default) | false,
    children (optional): [array of treenode],
  
    // internal keys (auto generated), plz don't include them in the initial data
    path: [],    // path is an array of indexes to this node from root node
    _id: 0,
  
    // not reserved, can carry any extra info about this node
    nickname (optional): 'pikachu',
    url (optional): 'url of this node',
  }
