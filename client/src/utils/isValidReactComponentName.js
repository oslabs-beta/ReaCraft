export default function isValidReactComponentName(name) {
  const isPascalCase = /^[A-Z][a-zA-Z]*$/.test(name);
  const reservedWords = ['React', 'Component', 'Fragment'];
  return isPascalCase && !reservedWords.includes(name);
}
