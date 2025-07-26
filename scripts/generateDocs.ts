import fs from "node:fs";
import path from "node:path";

/** A simplified version of `BabyDescription`. */
interface BabyDescriptionSimple {
  id: number;
  name: string;
  description: string;
  sprite: string;
  requireNoEndFloors: boolean;
}

const NUM_BABY_DESCRIPTION_SIMPLE_FIELDS = 4;
const NUM_BABY_DESCRIPTION_SIMPLE_OPTIONAL_FIELDS = 1;

const REPO_ROOT = path.join(import.meta.dirname, "..");
const BABIES_TS_PATH = path.join(REPO_ROOT, "src", "objects", "babies.ts");
const BABIES_MD_PATH = path.join(REPO_ROOT, "docs", "babies.md");

main();

function main() {
  const babyDescriptions = getBabyDescriptionsFromBabiesTS();
  const markdownText = getMarkdownText(babyDescriptions);
  fs.writeFileSync(BABIES_MD_PATH, markdownText);
}

/**
 * We can't import the "babies.ts" file directly because it uses `isaacscript-common` and the
 * corresponding JavaScript files are never created. Thus, we revert to reading the file as text and
 * constructing a simplified babies object from it.
 */
function getBabyDescriptionsFromBabiesTS(): readonly BabyDescriptionSimple[] {
  const babiesTS = fs.readFileSync(BABIES_TS_PATH, "utf8");
  const lines = babiesTS.split("\n");

  const babyDescriptions: BabyDescriptionSimple[] = [];

  let currentBabyDescription: Partial<BabyDescriptionSimple> = {};
  let onBabiesObject = false;

  for (const [i, line] of lines.entries()) {
    if (!onBabiesObject) {
      if (line === "export const BABIES = {") {
        onBabiesObject = true;
      }
      continue;
    }

    if (line.startsWith("  // ") && !line.startsWith("  // ---")) {
      const match = line.match(/ {2}\/\/ (\d+)/);
      if (match === null) {
        throw new Error(`Failed to parse a comment on line ${i + 1}: ${line}`);
      }

      const idString = match[1];
      if (idString === undefined) {
        throw new Error(`Failed to parse a comment on line ${i + 1}: ${line}`);
      }

      const id = Number.parseInt(idString, 10);
      if (Number.isNaN(id)) {
        throw new TypeError(
          `Failed to convert a string to a number on line ${i + 1}: ${line}`,
        );
      }

      currentBabyDescription.id = id;
    }

    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("name: ")) {
      const match = trimmedLine.match(/name: "(.+)"/);
      if (match === null) {
        throw new Error(`Failed to parse a name on line ${i + 1}: ${line}`);
      }

      const name = match[1];
      if (name === undefined) {
        throw new Error(`Failed to parse a name on line ${i + 1}: ${line}`);
      }

      currentBabyDescription.name = name;
    } else if (trimmedLine.startsWith("description: ")) {
      const match = trimmedLine.match(/description: "(.+)"/);
      if (match === null) {
        throw new Error(
          `Failed to parse a description on line ${i + 1}: ${line}`,
        );
      }

      const description = match[1];
      if (description === undefined) {
        throw new Error(
          `Failed to parse a description on line ${i + 1}: ${line}`,
        );
      }

      currentBabyDescription.description = description;
    } else if (trimmedLine.startsWith("description2: ")) {
      const match = trimmedLine.match(/description2: "(.+)"/);
      if (match === null) {
        throw new Error(
          `Failed to parse a description2 on line ${i + 1}: ${line}`,
        );
      }

      const description = match[1];
      if (description === undefined) {
        throw new Error(
          `Failed to parse a description2 on line ${i + 1}: ${line}`,
        );
      }

      if (currentBabyDescription.description === undefined) {
        throw new Error("Failed to add the second line of a description.");
      } else {
        currentBabyDescription.description += ` ${description}`;
      }
    } else if (trimmedLine.startsWith("sprite: ")) {
      const match = trimmedLine.match(/sprite: "(.+)"/);
      if (match === null) {
        throw new Error(`Failed to parse a sprite on line ${i + 1}: ${line}`);
      }

      const sprite = match[1];
      if (sprite === undefined) {
        throw new Error(`Failed to parse a sprite on line ${i + 1}: ${line}`);
      }

      currentBabyDescription.sprite = sprite;
    } else if (trimmedLine.startsWith("requireNoEndFloors: true")) {
      currentBabyDescription.requireNoEndFloors = true;
    } else if (trimmedLine === "},") {
      const numKeys = Object.keys(currentBabyDescription).length;
      if (
        numKeys !== NUM_BABY_DESCRIPTION_SIMPLE_FIELDS
        && numKeys
          !== NUM_BABY_DESCRIPTION_SIMPLE_FIELDS
            + NUM_BABY_DESCRIPTION_SIMPLE_OPTIONAL_FIELDS
      ) {
        console.error("currentBabyDescription:", currentBabyDescription);
        throw new Error(
          `Failed to collect ${NUM_BABY_DESCRIPTION_SIMPLE_FIELDS} fields from a baby description. (See above error output.)`,
        );
      }
      babyDescriptions.push(currentBabyDescription as BabyDescriptionSimple);
      currentBabyDescription = {};
    }
  }

  return babyDescriptions;
}

function getMarkdownText(
  babyDescriptions: readonly BabyDescriptionSimple[],
): string {
  let text = "# Baby List\n\n";
  text += "<!-- DO NOT EDIT THIS FILE. -->\n";
  text +=
    '<!-- THIS FILE WAS AUTOMATICALLY GENERATED BY THE "generateDocs.sh" SCRIPT. -->\n\n';
  text += "<!-- markdownlint-disable MD033 -->\n\n";
  text += `There are ${babyDescriptions.length} babies in total.\n\n`;
  text +=
    "| ID | Appearance | Name | Description | Appears on Womb 2 & Beyond\n";
  text += "| --- | --- | --- | --- | ---\n";

  for (const babyDescription of babyDescriptions) {
    const { id, name, description, sprite, requireNoEndFloors } =
      babyDescription;

    // We copy paste all of the vanilla PNG files into the "images" directory and then crop/resize
    // them using ImageMagick. (See the comment in "cropImages.sh".)
    const spriteURL = `./images/${sprite}`;

    // We use an `img` tag instead of the Markdown image format because the former does not work
    // properly if the file name has a space in it.
    const image = `<img src="${spriteURL}" alt="${sprite}">`;

    const requireNoEndFloorsText = requireNoEndFloors ? "❌" : "✔️";

    text += `| ${id} | ${image} | ${name} | ${description} | ${requireNoEndFloorsText}\n`;
  }

  return text;
}
