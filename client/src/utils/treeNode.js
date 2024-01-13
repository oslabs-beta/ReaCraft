export default class TreeNode {
  constructor(component, index) {
    this.name = component.name;
    this.attributes = { index: index, tag: component.html_tag };
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
  }

  removeChild(child) {
    this.children = this.children.filter((c) => c.index !== child.index);
  }

  searchNode(index) {
    if (this.attributes.index === index) return this;
    else if (this.children.length === 0) return;
    else {
      let res;
      this.children.forEach((child) => {
        const searchChild = child.searchNode(index);
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
  const stack = [0];
  while (stack.length > 0) {
    const cur = stack.pop();
    seen.add(cur);
    const children = components.flatMap((item, idx) =>
      item.parent === cur ? idx : []
    );
    children.forEach((i) => {
      if (seen.has(i)) return false;
      stack.push(i);
    });
  }
  return seen.size === components.length;
}

export function convertToTree(components, fromDb) {
  const rootId = fromDb ? components[0]._id : 0;
  const stack = [rootId];
  const tree = new TreeNode(components[0], rootId);

  while (stack.length > 0) {
    const cur = stack.pop();
    const node = tree.searchNode(cur);
    const childrenIndices = components.flatMap((item, idx) =>
      item.parent === cur || item.parent_id === cur ? idx : []
    );

    childrenIndices.forEach((i) => {
      const child = components[i];
      const childId = fromDb ? child._id : i;
      stack.push(childId);
      const childNode = new TreeNode(child, childId);
      node.addChild(childNode);
    });
  }
  return tree;
}
