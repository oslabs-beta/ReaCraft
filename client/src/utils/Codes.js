import { convertObjToArr } from './convertBetweenObjArr';

export default class Codes {
  constructor(components, tree) {
    this.components = components;
    this.tree = tree;
  }

  converToJsx() {
    const components = this.components;
    const tree = this.tree;
    const jsx = {};
    let stack = [tree];
    while (stack.length > 0) {
      const cur = stack.pop();
      const component = components.find((item) => item._id === cur.id);
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
          childrenComps.map((childComponent) => childComponent.name)
        );
        childrenNames.forEach((name) => {
          importChildren += `import ${name} from './${name}.jsx'\n`;
        });

        html =
          `  return (\n    <div${classAndId}\n` +
          childrenComps
            .map((childComponent) => {
              const props = convertObjToArr(JSON.parse(childComponent.props));
              return `      <${childComponent.name} ${props
                .map(({ key, value }) => `${key}={${value}}`)
                .join(' ')}/>`;
            })
            .join('\n') +
          '\n    </div>\n);';
      }

      const componentProps = convertObjToArr(JSON.parse(component.props));
      let propKeys = new Set(componentProps.map(({ key }) => key));
      if (jsx[name]) {
        const jsxStr = jsx[name];
        const functionRegex = new RegExp(
          `function\\s+${name}\\(\\{\\s*([^)]*?)\\s*\\}\\)`
        );
        const matches = jsxStr.match(functionRegex);
        if (matches) {
          const oldPropKeys = new Set(matches[1].split(', '));
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
    css = {};
    const components = this.components;
    const rootWidth = components[0].rectangle.width;
    const rootHeight = components[0].rectangle.height;
    components.forEach((component, i) => {
      const { name, rectangle } = component;
      cssCode = `#${name}-${i} {
  position: ${i === 0 ? 'relative' : 'absolute'};
  width: ${
    i === 0 ? '100%' : `${Math.round(rectangle.width / rootWidth) * 100}%`
  };
  height: ${
    i === 0 ? '100%' : `${Math.round(rectangle.height / rootHeight) * 100}%`
  };
}`;
    });
  }
}
