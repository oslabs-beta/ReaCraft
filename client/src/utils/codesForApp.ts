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
      <span class='slide'>
        <h1>Your design: ${title}</h1>
      </span>`;

  for (let i = 0; i < pageLen; i++) {
    code += `
      <span class='slide'>
        <Page${i} />
      </span>`;
  }
  code += `
    </div>
  )
}`;
  return code;
}
