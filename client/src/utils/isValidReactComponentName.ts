export default function isValidReactComponentName(name: string): boolean {
  const isPascalCase = /^[A-Z][a-zA-Z]*$/.test(name);
  const reservedWords = ['React', 'Component', 'Fragment'];
  return isPascalCase && !reservedWords.includes(name);
}
