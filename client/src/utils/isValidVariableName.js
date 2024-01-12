export default function isValidVariableName(name) {
  const validNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return validNameRegex.test(name) && !isReservedWord(name);
}

function isReservedWord(name) {
  // List of reserved words in JavaScript
  const reservedWords = [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'let',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
    // ES6 and beyond
    'await',
    'enum',
    'implements',
    'interface',
    'package',
    'private',
    'protected',
    'public',
    'static',
  ];

  return reservedWords.includes(name);
}
