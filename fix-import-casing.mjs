#!/usr/bin/env node
/**
 * Arregla el casing (mayúsculas/minúsculas) de los imports relativos
 * comparándolos contra los nombres REALES que tiene GIT (no el disco).
 *
 * Por qué git y no el disco: en Windows/Mac el sistema de ficheros es
 * case-insensitive, así que el nombre en disco puede no coincidir con el
 * que está realmente commiteado. El CI (Linux) clona lo que hay en git,
 * y ESO es lo que importa. git ls-files da el nombre canónico, igual en
 * cualquier sistema operativo.
 *
 * Uso (desde la raíz del proyecto):
 *   node fix-import-casing.mjs           -> solo informa (dry run)
 *   node fix-import-casing.mjs --write   -> aplica los cambios
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, posix } from "node:path";

const WRITE = process.argv.includes("--write");
const EXTS = ["", ".ts", ".tsx", ".js", ".jsx", ".d.ts", "/index.ts", "/index.tsx", "/index.js", "/index.jsx"];

// Fuente de verdad: nombres reales tal y como están en git (siempre con /)
const tracked = execSync("git ls-files", { encoding: "utf8" })
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

// Mapa: ruta en minúsculas -> ruta real (para buscar ignorando el case)
const byLower = new Map();
for (const f of tracked) byLower.set(f.toLowerCase(), f);

// Solo procesamos ficheros fuente
const sources = tracked.filter((f) => /\.(ts|tsx|js|jsx)$/.test(f));

// Resuelve un import relativo (desde fromFile) al nombre real en git
function resolveReal(fromFile, spec) {
  // base = ruta del import relativa a la raíz del repo, normalizada con /
  const base = posix.normalize(posix.join(posix.dirname(fromFile), spec));
  for (const ext of EXTS) {
    const candidate = (base + ext).replace(/^\.\//, "");
    const real = byLower.get(candidate.toLowerCase());
    if (real) return real;
  }
  return null;
}

const importRe = /(\bfrom\s+|\bimport\s+)(['"])(\.\.?\/[^'"]+)\2/g;
let totalFixed = 0;
const report = [];

for (const file of sources) {
  let src = readFileSync(file, "utf8");
  let changed = false;

  src = src.replace(importRe, (match, kw, quote, spec) => {
    const real = resolveReal(file, spec);
    if (!real) {
      report.push(`  ⚠️  ${file}: NO se resuelve '${spec}' en git`);
      return match;
    }
    // Reconstruye el import relativo con el casing real de git
    const hadExt = /\.(ts|tsx|js|jsx)$/.test(spec);
    let rel = posix.relative(posix.dirname(file), real);
    if (!hadExt) rel = rel.replace(/\.(ts|tsx|js|jsx)$/, "");
    if (!rel.startsWith(".")) rel = "./" + rel;

    if (rel !== spec) {
      report.push(`  ✏️  ${file}: '${spec}' -> '${rel}'`);
      totalFixed++;
      changed = true;
      return `${kw}${quote}${rel}${quote}`;
    }
    return match;
  });

  if (changed && WRITE) writeFileSync(file, src);
}

console.log(report.join("\n") || "  (sin cambios)");
console.log(`\n${WRITE ? "APLICADOS" : "DETECTADOS (dry run)"}: ${totalFixed} imports con casing incorrecto`);
if (!WRITE && totalFixed > 0) console.log("Ejecuta con --write para aplicar.");
