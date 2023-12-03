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

export function toKey(x: any, y: any) {
  return `${y}|${x}`;
}
