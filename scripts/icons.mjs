import sharp from 'sharp'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
  <rect width="60" height="60" fill="#FFFAED"/>
  <g transform="translate(9 9) scale(.7)">
    <g fill="#FF7D59"><circle cx="30" cy="14" r="11"/><circle cx="46" cy="26" r="11"/><circle cx="40" cy="45" r="11"/><circle cx="20" cy="45" r="11"/><circle cx="14" cy="26" r="11"/></g>
    <circle cx="30" cy="31" r="9" fill="#FFDE94"/>
  </g>
</svg>`

for (const [name, size] of [['icon-192', 192], ['icon-512', 512], ['apple-touch-icon', 180]]) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/${name}.png`)
}
