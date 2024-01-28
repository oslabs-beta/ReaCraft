export function jsxCodeForApp(pageLen: number, title: string): string {
  let code = "import React, { useEffect } from 'react';\nimport './App.css';\n";
  for (let i = 0; i < pageLen; i++) {
    code += `import Page${i} from './Page${i}/Page${i}.jsx';\n`;
  }

  code += `\nexport default function App() {
  useEffect(() => {
    document.title = "${title}";
  },[]);
  return (
    <div className='App'>
      Your design: ${title}`;

  for (let i = 0; i < pageLen; i++) {
    code += `
      <Page${i} />`;
  }
  code += `
    </div>
  )
}`;
  return code;
}
