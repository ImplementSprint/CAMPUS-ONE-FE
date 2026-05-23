import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultBackendCandidates = [
  path.resolve(repoRoot, '../campus-one-be'),
  path.resolve(repoRoot, '../campus-one-backend'),
];
const backendRoot = process.env.CAMPUS_ONE_BACKEND_DIR
  ? path.resolve(process.env.CAMPUS_ONE_BACKEND_DIR)
  : defaultBackendCandidates.find((candidate) =>
      existsSync(path.join(candidate, 'contract-artifacts/shared-contracts.ts')),
    ) ?? defaultBackendCandidates[0];
const sourceArtifactPath = path.join(backendRoot, 'contract-artifacts/shared-contracts.ts');
const sourceManifestPath = path.join(backendRoot, 'contract-artifacts/contracts-manifest.json');
const targetDir = path.join(repoRoot, 'packages/shared-contracts/src');
const targetArtifactPath = path.join(targetDir, 'index.ts');
const targetManifestPath = path.join(repoRoot, 'packages/shared-contracts/contracts-manifest.json');
const checkOnly = process.argv.includes('--check');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (checkOnly) {
  const currentArtifact = readFileSync(targetArtifactPath, 'utf8').replace(/\r\n/g, '\n');
  const currentManifest = readFileSync(targetManifestPath, 'utf8').replace(/\r\n/g, '\n');
  const manifestJson = JSON.parse(currentManifest);
  const currentHash = createHash('sha256').update(currentArtifact).digest('hex');

  if (manifestJson.sha256 !== currentHash) {
    fail('Frontend contract manifest does not match packages/shared-contracts/src/index.ts.');
  }

  if (existsSync(sourceArtifactPath) && existsSync(sourceManifestPath)) {
    const sourceArtifact = readFileSync(sourceArtifactPath, 'utf8').replace(/\r\n/g, '\n');
    const sourceManifest = readFileSync(sourceManifestPath, 'utf8').replace(/\r\n/g, '\n');
    if (currentArtifact !== sourceArtifact) fail('Frontend shared contracts are stale. Run `npm run contracts:sync`.');
    if (currentManifest !== sourceManifest) fail('Frontend contract manifest is stale. Run `npm run contracts:sync`.');
    console.log('Frontend shared contracts match the backend artifact.');
  } else {
    console.log('Frontend shared contracts are internally consistent. Backend artifact not found; skipped cross-repo drift check.');
  }

  process.exit(0);
}

const artifact = readFileSync(sourceArtifactPath, 'utf8').replace(/\r\n/g, '\n');
const manifest = readFileSync(sourceManifestPath, 'utf8').replace(/\r\n/g, '\n');

mkdirSync(targetDir, { recursive: true });
writeFileSync(targetArtifactPath, artifact, 'utf8');
writeFileSync(targetManifestPath, manifest, 'utf8');
console.log('Synced frontend shared contracts from backend artifact.');
