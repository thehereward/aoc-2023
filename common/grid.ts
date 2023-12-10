export function get3By3(x: number, y: number) {
  return [
    [y, x],
    [y + 1, x],
    [y - 1, x],
    [y, x + 1],
    [y + 1, x + 1],
    [y - 1, x + 1],
    [y, x - 1],
    [y + 1, x - 1],
    [y - 1, x - 1],
  ];
}

export function getNSEW(x: number, y: number) {
  return [
    [y - 1, x], // N
    [y + 1, x], // S
    [y, x + 1], // E
    [y, x - 1], // W
  ];
}

export function toKey(x: any, y: any) {
  return `${x}|${y}`;
}
