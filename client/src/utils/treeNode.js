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

export function convertToTree(components) {
  const stack = [0];
  const tree = new TreeNode(components[0], 0);
  while (stack.length > 0) {
    const cur = stack.pop();
    const node = tree.searchNode(cur);

    const children = components.flatMap((item, idx) =>
      item.parent === cur ? idx : []
    );

    children.forEach((i) => {
      stack.push(i);
      const child = new TreeNode(components[i], i);
      node.addChild(child);
    });
  }
  return tree;
}
