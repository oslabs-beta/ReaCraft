import { convertObjToArr } from './convertBetweenObjArr';

export default class JsxCode {
  constructor(components) {
    this.components = components;
  }
}

export function jsxCode(components, tree) {
  const code = {};
  let stack = [tree];
  while (stack.length > 0) {
    const cur = stack.pop();
    const component = components.find((item) => item._id === cur.id);
    const { html_tag, inner_html, name } = component;
    const children = cur.children;
    let html;
    if (children.length === 0) {
      html = `  return (\n    ${html_tag}${inner_html}${html_tag.replace(
        '<',
        '</'
      )}
  );`;
    } else {
      html =
        '  return (\n    <div>\n' +
        children
          .map((child) => {
            const childComponent = components.find(
              (item) => item._id === child.id
            );
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
    if (code[name]) {
      const codeStr = code[name];
      const functionRegex = new RegExp(
        `function\\s+${name}\\(\\{\\s*([^)]*?)\\s*\\}\\)`
      );
      const matches = codeStr.match(functionRegex);
      if (matches) {
        const oldPropKeys = new Set(matches[1].split(', '));
        propKeys = new Set([...propKeys, ...oldPropKeys]);
      }
    }
    const propsCode = '{ ' + [...propKeys].join(', ') + ' }';
    code[name] = `import React from 'react';
export default function ${name}(${propsCode}) {
${html}
}`;
    stack = stack.concat(children);
  }
  return code;
}
