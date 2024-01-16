export default class TreeNode {
  constructor(component, id) {
    this.name = component.name;
    this.attributes = { tag: component.html_tag };
    this.id = id;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
  }

  removeChild(child) {
    this.children = this.children.filter((c) => c.id !== child.id);
  }

  searchNode(id) {
    if (this.id === id) return this;
    else if (this.children.length === 0) return;
    else {
      let res;
      this.children.forEach((child) => {
        const searchChild = child.searchNode(id);
        if (searchChild) {
          res = searchChild;
        }
      });
      return res;
    }
  }
}

export function validTree(components) {
  const seen = new Set();
  const stack = [components[0]._id];
  while (stack.length > 0) {
    const cur = stack.pop();
    seen.add(cur);
    const children = components.flatMap((item) =>
      item.parent_id === cur ? item._id : []
    );
    children.forEach((i) => {
      if (seen.has(i)) return false;
      stack.push(i);
    });
  }
  return seen.size === components.length;
}

export function convertToTree(components) {
  if (components.length === 0) return null;
  const rootId = components[0]._id;
  const stack = [rootId];
  const tree = new TreeNode(components[0], rootId);

  while (stack.length > 0) {
    const cur = stack.pop();
    const node = tree.searchNode(cur);
    const childrenIndices = components.flatMap((item, idx) =>
      item.parent_id === cur ? idx : []
    );

    childrenIndices.forEach((i) => {
      const child = components[i];
      const childId = child._id;
      stack.push(childId);
      const childNode = new TreeNode(child, childId);
      node.addChild(childNode);
    });
  }
  return tree;
}
