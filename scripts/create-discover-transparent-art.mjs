/**
 * One-time non-destructive transparent derivative of the source search art.
 * Removes contiguous near-white edge pixels while preserving internal artwork.
 * Original asset is never overwritten.
 */
import fs from 'node:fs';
import { PNG } from 'pngjs';

const source = 'src/shared/assets/ubertip-empty.png';
const target = 'src/shared/assets/ubertip-empty-transparent.png';

const png = PNG.sync.read(fs.readFileSync(source));
const { width, height, data } = png;
const size = width * height;
const visited = new Uint8Array(size);
const queue = new Int32Array(size);
let head = 0;
let tail = 0;

function isBackground(pixel) {
  const i = pixel * 4;
  return data[i] >= 245 && data[i + 1] >= 245 && data[i + 2] >= 245;
}
function offer(pixel) {
  if (visited[pixel]) return;
  visited[pixel] = 1;
  if (isBackground(pixel)) queue[tail++] = pixel;
}
for (let x = 0; x < width; x++) {
  offer(x);
  offer((height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  offer(y * width);
  offer(y * width + width - 1);
}
while (head < tail) {
  const pixel = queue[head++];
  data[pixel * 4 + 3] = 0;
  const x = pixel % width;
  const y = (pixel - x) / width;
  if (x > 0) offer(pixel - 1);
  if (x < width - 1) offer(pixel + 1);
  if (y > 0) offer(pixel - width);
  if (y < height - 1) offer(pixel + width);
}
fs.writeFileSync(target, PNG.sync.write(png));
console.log('Created transparent search artwork:', target, width + 'x' + height, tail, 'background pixels');
