export function stringToColor(name: string = ''): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const red = (hash & 0xFF0000) >> 16;
  const green = (hash & 0x00FF00) >> 8;
  const blue = hash & 0x0000FF;

  const color = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  return color;
}