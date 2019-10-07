const themes = [
  'default',
  'primary',
  'secondary-1',
  'secondary-2',
  'complement',
];

let themeIdx = -1;

export function theme() {
  themeIdx = (themeIdx + 1) % themes.length;
  return themes[themeIdx];
}

export function resetTheme() {
  themeIdx = -1;
}
