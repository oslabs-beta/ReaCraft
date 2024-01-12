export function convertArrToObj(arr) {
  // arr is an array of objects {key, value}
  const obj = {};
  arr.forEach(({ key, value }) => (obj[key] = value));
  return obj;
}

export function convertObjToArr(obj) {
  return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
}
