import {
  $,
  $s,
  commandExists,
  diff,
  echo,
  exit,
  lintScript,
  readFile,
} from "isaacscript-common-node";
import path from "node:path";

await lintScript(async ({ packageRoot }) => {
  const promises = [
    // Use Prettier to check formatting.
    // - "--log-level=warn" makes it only output errors.
    $`prettier --log-level=warn --check .`,

    // Type-check the code using the TypeScript compiler.
    $`tsc --noEmit`,

    // Use ESLint to lint the TypeScript.
    // - "--max-warnings 0" makes warnings fail, since we set all ESLint errors to warnings.
    $`eslint --max-warnings 0 .`,

    // Check for unused exports.
    // - "--error" makes it return an error code of 1 if unused exports are found.
    $`ts-prune --error`,

    // Spell check every file using CSpell.
    // - "--no-progress" and "--no-summary" make it only output errors.
    $`cspell --no-progress --no-summary .`,

    // Check for unused CSpell words.
    $`cspell-check-unused-words`,

    // @template-customization-start

    // Check for base file updates.
    $`isaacscript check --ignore lint.ts`,
    // (We can't do a "@template-ignore-next-line" on the first line of this file.)

    checkDocs(packageRoot),

    // @template-customization-end
  ];

  if (commandExists("python")) {
    $s`pip install isaac-xml-validator --upgrade --quiet`;
    // @template-ignore-next-line
    promises.push($`isaac-xml-validator --quiet --ignore cutscenes.xml`);
  }

  await Promise.all(promises);
});

// @template-customization-start

/** Check that the documentation is up to date. */
async function checkDocs(projectRoot: string): Promise<void> {
  const babiesMDPath = path.join(projectRoot, "docs", "babies.md");
  const oldBabiesMD = readFile(babiesMDPath);
  await $`tsx ./scripts/generateDocs.ts`;
  const newBabiesMD = readFile(babiesMDPath);

  if (oldBabiesMD !== newBabiesMD) {
    echo("The documentation is not up to date:");
    diff(oldBabiesMD, newBabiesMD);
    echo();
    exit(1);
  }
}

// @template-customization-end
