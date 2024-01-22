export function convertArrToObj(arr: { key: string; value: string }[]): {
  [key: string]: string;
} {
  // arr is an array of objects {key, value}
  const obj: { [key: string]: string } = {};
  arr.forEach(({ key, value }) => (obj[key] = value));
  return obj;
}

export function convertObjToArr(obj: {
  [key: string]: string;
}): { key: string; value: string }[] {
  return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
}
