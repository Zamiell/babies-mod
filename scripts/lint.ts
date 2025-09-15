import {
  $,
  commandExists,
  diff,
  echo,
  exit,
  lintScript,
  readFile,
} from "complete-node";
import path from "node:path";

await lintScript(import.meta.dirname, async (packageRoot) => {
  const promises = [
    // Use TypeScript to type-check the code.
    $`tsc --noEmit`,

    // Use ESLint to lint the TypeScript code.
    // - "--max-warnings 0" makes warnings fail, since we set all ESLint errors to warnings.
    $`eslint --max-warnings 0 .`,

    // Use Prettier to check formatting.
    // - "--log-level=warn" makes it only output errors.
    $`prettier --log-level=warn --check .`,

    // Use ts-prune to check for unused exports.
    // - "--error" makes it return an error code of 1 if unused exports are found.
    $`ts-prune --error`,

    // Use CSpell to spell check every file.
    // - "--no-progress" and "--no-summary" make it only output errors.
    $`cspell --no-progress --no-summary .`,

    // Check for unused words in the CSpell configuration file.
    $`cspell-check-unused-words`,

    // @template-customization-start

    // Check for base file updates.
    $`isaacscript check --ignore lint.ts`,
    // (We can't do a "@template-ignore-next-line" on the first line of this file.)

    checkDocs(packageRoot),

    // @template-customization-end
  ];

  const pythonExists = await commandExists("python");
  if (pythonExists) {
    await $`pip install isaac-xml-validator --upgrade --quiet`;
    promises.push($`isaac-xml-validator --quiet`);
  }

  await Promise.all(promises);
});

// @template-customization-start

/** Check that the documentation is up to date. */
async function checkDocs(projectRoot: string) {
  const babiesMDPath = path.join(projectRoot, "docs", "babies.md");
  const oldBabiesMD = await readFile(babiesMDPath);
  await $`tsx ./scripts/generateDocs.ts`;
  const newBabiesMD = await readFile(babiesMDPath);

  if (oldBabiesMD !== newBabiesMD) {
    echo("The documentation is not up to date:");
    diff(oldBabiesMD, newBabiesMD);
    echo();
    exit(1);
  }
}

// @template-customization-end
