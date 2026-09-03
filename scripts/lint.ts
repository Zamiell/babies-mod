import { $, commandExists, diff, lintCommands, readFile } from "complete-node";
import path from "node:path";

const PACKAGE_ROOT = path.resolve(import.meta.dirname, "..");

const commands = [
  // Use TypeScript to type-check the code.
  "tsc --noEmit",
  "tsc --noEmit --project ./scripts/tsconfig.json",

  // Use ESLint to lint the TypeScript code.
  "eslint",

  // Use Prettier to check formatting.
  // - "--log-level=warn" makes it only output errors.
  "prettier --log-level=warn --check .",

  // Use ts-prune to check for unused exports.
  // - "--error" makes it return an error code of 1 if unused exports are found.
  "ts-prune --error",

  // Use CSpell to spell check every file.
  // - "--no-progress" and "--no-summary" make it only output errors.
  "cspell --no-progress --no-summary",

  // Check for unused words in the CSpell configuration file.
  "cspell-check-unused-words",

  // @template-customization-start

  // Check for base file updates.
  "isaacscript check --ignore lint.ts",

  // eslint-disable-next-line unicorn/prefer-top-level-await
  ["checkDocs", checkDocs(PACKAGE_ROOT)] as const,

  // @template-customization-end
];

const pythonExists = await commandExists("uvx");
if (pythonExists) {
  // @template-ignore-next-line
  commands.push("uvx isaac-xml-validator --quiet --ignore cutscenes.xml");
}

await lintCommands(import.meta.dirname, commands);

// @template-customization-start

/** Check that the documentation is up to date. */
async function checkDocs(projectRoot: string) {
  const babiesMDPath = path.join(projectRoot, "docs", "babies.md");
  const oldBabiesMD = await readFile(babiesMDPath);
  await $`tsx ./scripts/generateDocs.ts`;
  const newBabiesMD = await readFile(babiesMDPath);

  if (oldBabiesMD !== newBabiesMD) {
    console.log("The documentation is not up to date:");
    diff(oldBabiesMD, newBabiesMD);
    console.log();
    process.exit(1);
  }
}

// @template-customization-end
