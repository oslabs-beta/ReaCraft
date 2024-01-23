import { Component } from '../../../docs/types';
import { convertObjToArr } from './convertBetweenObjArr';
import TreeNode from './treeNode';

export default class Codes {
  components: Component[];
  tree: TreeNode;
  constructor(components: Component[], tree: TreeNode) {
    this.components = components;
    this.tree = tree;
  }

  convertToJsx() {
    const components = this.components;
    const tree = this.tree;
    const jsx: { [key: string]: string } = {};
    let stack = [tree];
    while (stack.length > 0) {
      const cur = stack.pop();
      if (!cur) throw new Error('Converting to jsx: component is undefined');

      const component = components.find((item) => item._id === cur.id);
      if (!component)
        throw new Error('Converting to jsx: cannot find component');

      const { html_tag, inner_html, name } = component;
      const children = cur.children;
      let html;
      let importChildren = '';
      const classAndId = ` className='${component.name}' id='${component.name}-${component.index}'>`;
      if (children.length === 0) {
        html = `  return (\n    ${html_tag.replace(
          '>',
          classAndId
        )}${inner_html}${html_tag.replace('<', '</')}
  );`;
      } else {
        const childrenComps = children.map((child) =>
          components.find((item) => item._id === child.id)
        );
        const childrenNames = new Set(
          childrenComps.map((childComponent) => {
            if (!childComponent)
              throw new Error(
                'Converting jsx: component has an undefined child'
              );
            childComponent.name;
          })
        );
        childrenNames.forEach((name) => {
          importChildren += `import ${name} from './${name}.jsx'\n`;
        });

        html =
          `  return (\n    <div${classAndId}\n` +
          childrenComps
            .map((childComponent) => {
              if (!childComponent)
                throw new Error(
                  'Converting jsx: component has an undefined child'
                );
              return `      <${childComponent.name} ${childComponent.props
                .map(({ key, value }) => `${key}={${value}}`)
                .join(' ')}/>`;
            })
            .join('\n') +
          '\n    </div>\n);';
      }

      let propKeys = new Set(component.props.map(({ key }) => key));
      if (jsx[name]) {
        const jsxStr = jsx[name];
        const functionRegex = new RegExp(
          `function\\s+${name}\\(\\{\\s*([^)]*?)\\s*\\}\\)`
        );
        const matches = jsxStr.match(functionRegex);
        if (matches) {
          const oldPropKeys: Set<string> = new Set(matches[1].split(', '));
          propKeys = new Set([...propKeys, ...oldPropKeys]);
        }
      }
      const propsCode =
        [...propKeys].length === 0
          ? ''
          : '{ ' + [...propKeys].join(', ') + ' }';

      jsx[name] = `import 'styles.css';

import React from 'react';
${importChildren}
export default function ${name}(${propsCode}) {
${html}
}`;
      stack = stack.concat(children);
    }
    return jsx;
  }

  convertToCss() {
    const css: { [key: string]: string } = {};
    const components = this.components;
    if (!components || this.components.length === 0) {
      throw new Error('Converting css: design has no components');
    }
    if (!components[0].rectangle) {
      throw new Error('Converting css: RootContainer has no rectangle');
    }
    const rootWidth = components[0].rectangle.width;
    const rootHeight = components[0].rectangle.height;
    components.forEach((component, i) => {
      const { name, rectangle, styles } = component;
      if (!rectangle) {
        throw new Error(`Converting css: component ${name} has no rectangle`);
      }
      const {
        x_position,
        y_position,
        z_index,
        width,
        height,
        borderwidth,
        borderradius,
        backgroundcolor,
        stroke,
      } = rectangle;
      let cssCode = `#${name}-${i} {
  position: ${i === 0 ? 'relative' : 'absolute'};
  width: ${i === 0 ? '100%' : `${Math.round((width / rootWidth) * 100)}%`};
  height: ${i === 0 ? '100%' : `${Math.round((height / rootHeight) * 100)}%`};
  border-color: ${stroke};`;
      if (i > 0) {
        cssCode += `
  left: ${Math.round((x_position / rootWidth) * 100)}%;
  top: ${Math.round((y_position / rootHeight) * 100)}%;`;
      }
      if (borderwidth > 0) cssCode += `\n  border-width: ${borderwidth}px;`;
      if (borderradius) cssCode += `\n  border-radius: ${borderradius}%;`;
      if (backgroundcolor)
        cssCode += `\n  background-color: ${backgroundcolor};`;
      if (z_index) cssCode += `\n  z-index: ${z_index};`;
      styles.forEach(({ key, value }) => {
        if (value.length > 0) {
          cssCode += `\n  ${key}: ${value};`;
        }
      });
      cssCode += '\n}';
      if (!css[name]) {
        css[name] = cssCode;
      } else {
        css[name] += '\n\n' + cssCode;
      }
    });
    return css;
  }
}
