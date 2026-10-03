// Test-only module boundary: never import Payload config or open a database.
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";

const sources = new Map([
  ["server-only", "export {};"],
  [
    "payload",
    "export const getPayload = async () => globalThis.__contentPayload();",
  ],
  ["@payload-config", "export default {};"],
]);
const lib = new URL("../src/lib/", import.meta.url);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (sources.has(specifier))
      return { url: `content-test:${specifier}`, shortCircuit: true };
    if (
      context.parentURL === new URL("content.ts", lib).href &&
      ["./data", "./cms-ready", "./cms-timing"].includes(specifier)
    ) {
      return { url: new URL(`${specifier}.ts`, lib).href, shortCircuit: true };
    }
    if (context.parentURL === new URL("data.ts", lib).href && specifier === "./team-roster") {
      return { url: new URL("team-roster.ts", lib).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith("content-test:")) {
      return {
        format: "module",
        source: sources.get(url.slice("content-test:".length)),
        shortCircuit: true,
      };
    }
    if (
      ["content.ts", "data.ts", "cms-ready.ts", "cms-timing.ts", "team-roster.ts"].some(
        (name) => url === new URL(name, lib).href,
      )
    ) {
      return {
        format: "module",
        source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        }).outputText,
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});
