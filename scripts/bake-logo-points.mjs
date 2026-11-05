// Bakes the 3D logo into the point cloud the hero particles use, so the browser downloads a small
// buffer instead of a Draco-compressed model, its decoder and a surface sampler.
// Usage: node scripts/bake-logo-points.mjs   (reads assets-src/logo.glb, writes public/logo-points.bin)
//
// Output: Int16 x, y, z per point, centred and scaled so the logo is 3 units across, quantised over
// ±RANGE. Points are shuffled, so any prefix (phones use fewer) is an even sample of the whole logo.
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { writeFile } from 'node:fs/promises';

const COUNT = 22000;
const RANGE = 2;

const io = new NodeIO()
  .registerExtensions([KHRDracoMeshCompression])
  .registerDependencies({ 'draco3d.decoder': await draco3d.createDecoderModule() });
const doc = await io.read('assets-src/logo.glb');

// Every mesh primitive as a three.js mesh in world space
const meshes = [];
for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const matrix = new THREE.Matrix4().fromArray(node.getWorldMatrix());
  for (const prim of mesh.listPrimitives()) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(prim.getAttribute('POSITION').getArray(), 3));
    const normal = prim.getAttribute('NORMAL');
    if (normal) geo.setAttribute('normal', new THREE.BufferAttribute(normal.getArray(), 3));
    else geo.computeVertexNormals();
    const indices = prim.getIndices();
    if (indices) geo.setIndex(new THREE.BufferAttribute(indices.getArray(), 1));
    const m = new THREE.Mesh(geo);
    m.matrixWorld.copy(matrix);
    meshes.push(m);
  }
}

// Same sampling the page used to do at runtime: share by vertex count, front-facing surface only
const totalVerts = meshes.reduce((n, m) => n + m.geometry.attributes.position.count, 0) || 1;
const targets = [];
const p = new THREE.Vector3();
const n = new THREE.Vector3();
const normalMatrix = new THREE.Matrix3();
for (const mesh of meshes) {
  const share = Math.max(1, Math.round((mesh.geometry.attributes.position.count / totalVerts) * COUNT));
  const sampler = new MeshSurfaceSampler(mesh).build();
  normalMatrix.getNormalMatrix(mesh.matrixWorld);
  let placed = 0;
  let guard = 0;
  while (placed < share && guard < share * 4) {
    guard++;
    sampler.sample(p, n);
    n.applyMatrix3(normalMatrix).normalize();
    if (n.z < -0.35) continue; // skip the back plate: keeps the silhouette crisp from the front
    p.applyMatrix4(mesh.matrixWorld);
    targets.push([p.x, p.y, p.z]);
    placed++;
  }
}

// Centre and normalise to 3 units across
const box = new THREE.Box3();
for (const t of targets) box.expandByPoint(p.fromArray(t));
const center = box.getCenter(new THREE.Vector3());
const size = box.getSize(new THREE.Vector3());
const scale = 3 / Math.max(size.x, size.y);

for (let i = targets.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [targets[i], targets[j]] = [targets[j], targets[i]];
}

const out = new Int16Array(targets.length * 3);
targets.forEach((t, i) => {
  for (let k = 0; k < 3; k++) {
    const v = (t[k] - center.getComponent(k)) * scale;
    out[i * 3 + k] = Math.round(Math.max(-1, Math.min(1, v / RANGE)) * 32767);
  }
});
await writeFile('public/logo-points.bin', Buffer.from(out.buffer));
console.log(`${targets.length} points, ${Math.round(out.byteLength / 1024)} KB → public/logo-points.bin`);
