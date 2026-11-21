// main.ts — hands the Double Take game in. It copies this repository's
// game/ and screenshots/ into the output directory and writes dossier.json,
// the summary the judge reads, using the kit's vendored library.
// Node 22, standard library only. Run it with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function handIn() {
  // Fail loudly instead of handing in an empty or broken entry.
  if (!existsSync(join(repoRoot, 'game', 'index.html'))) {
    throw new Error('missing game/index.html: the game was not built');
  }
  if (!existsSync(join(repoRoot, 'screenshots'))) {
    throw new Error('missing screenshots/: take 3 or 4 screenshots first');
  }
  mkdirSync(outDir, { recursive: true });
  cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  if (existsSync(join(repoRoot, 'screenshots'))) {
    cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
  }
  // The scorer's own caps: only text_max_bytes shapes the bytes; the rest
  // refuse an entry the scorer would refuse (more than 4 screenshots or one
  // over 256 KiB; more than 993 files in game/ or 48 MiB of game files in
  // all, or a path under game/ over 1000 bytes).
  writeFileSync(
    join(outDir, 'dossier.json'),
    buildDossier(outDir, {
      text_max_bytes: 163840,
      screenshots: { max: 4, max_bytes: 262144 },
      game_max_files: 993,
      game_max_bytes: 50331648,
      game_path_max_bytes: 1000,
    }),
  );
}

handIn();
