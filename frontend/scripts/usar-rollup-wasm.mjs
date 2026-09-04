import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destino = path.join(root, 'node_modules', 'rollup');
const origen = path.join(root, 'node_modules', '@rollup', 'wasm-node');

if (!fs.existsSync(origen)) {
  console.warn('No está @rollup/wasm-node; omite el parche de Rollup.');
  process.exit(0);
}

fs.rmSync(destino, { recursive: true, force: true });
fs.cpSync(origen, destino, { recursive: true });
console.log('Rollup WASM listo para Windows.');
