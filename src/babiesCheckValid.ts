import type { TrinketType } from "isaac-typescript-definitions";
import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import {
  ReadonlySet,
  getCollectibleItemType,
  getCollectibleName,
  getTrinketName,
  log,
} from "isaacscript-common";
import type { BabyDescription } from "./interfaces/BabyDescription";
import { BABIES } from "./objects/babies";

const SHOULD_LOG = false as boolean;

const VALID_DUPLICATE_ITEMS = new ReadonlySet<CollectibleType>([
  CollectibleType.POOP, // 36
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.BRIMSTONE, // 118
  CollectibleType.PONY, // 130
  CollectibleType.CANDLE, // 164
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.SACRIFICIAL_DAGGER, // 172
  CollectibleType.ABEL, // 188
  CollectibleType.SAD_BOMBS, // 220
  CollectibleType.HOW_TO_JUMP, // 282
  CollectibleType.HOLY_MANTLE, // 313
  CollectibleType.WIZ, // 358
  CollectibleType.INCUBUS, // 360
  CollectibleType.MARKED, // 394
]);

export function babiesCheckValid(): void {
  babiesCheckValidDuplicateName();
  babiesCheckValidDuplicateItem();
  babiesCheckValidDuplicateTrinket();

  if (SHOULD_LOG) {
    logSpecificBabies();
  }
}

function babiesCheckValidDuplicateName() {
  const nameSet = new Set<string>();

  for (const [babyNum, baby] of Object.entries(BABIES)) {
    if (nameSet.has(baby.name)) {
      logBabyInvalid(baby, babyNum, `has a duplicate name: ${baby.name}`);
    } else {
      nameSet.add(baby.name);
    }
  }
}

function babiesCheckValidDuplicateItem() {
  for (const [baby1Num, baby1Raw] of Object.entries(BABIES)) {
    const baby1 = baby1Raw as BabyDescription;

    // Babies with 1 item.
    if (baby1.collectible !== undefined && baby1.collectible2 === undefined) {
      for (const [baby2Num, baby2Raw] of Object.entries(BABIES)) {
        const baby2 = baby2Raw as BabyDescription;

        if (baby1Num === baby2Num) {
          continue;
        }

        if (
          baby2.collectible !== undefined &&
          baby2.collectible2 === undefined &&
          baby2.collectible === baby1.collectible &&
          !VALID_DUPLICATE_ITEMS.has(baby1.collectible)
        ) {
          logBabyInvalid(
            baby1,
            baby1Num,
            `has a duplicate item: ${baby1.collectible}`,
          );
        }
      }
    }

    // Babies with 2 items.
    if (baby1.collectible !== undefined && baby1.collectible2 !== undefined) {
      for (const [baby2Num, baby2Raw] of Object.entries(BABIES)) {
        const baby2 = baby2Raw as BabyDescription;

        if (baby1Num === baby2Num) {
          continue;
        }

        if (
          baby2.collectible !== undefined &&
          baby2.collectible2 !== undefined &&
          (baby2.collectible === baby1.collectible ||
            baby2.collectible2 === baby1.collectible) &&
          (baby2.collectible === baby1.collectible2 ||
            baby2.collectible2 === baby1.collectible2)
        ) {
          logBabyInvalid(
            baby1,
            baby1Num,
            `has a duplicate pair of items: ${baby1.collectible} & ${baby1.collectible2}`,
          );
        }
      }
    }

    if (
      baby1.collectible2 !== undefined &&
      getCollectibleItemType(baby1.collectible2) === ItemType.ACTIVE &&
      // Make an exception for a Book of Virtues combo.
      baby1.collectible !== CollectibleType.BOOK_OF_VIRTUES
    ) {
      logBabyInvalid(baby1, baby1Num, "has an active item in the second slot.");
    }

    if (
      baby1.collectible3 !== undefined &&
      getCollectibleItemType(baby1.collectible3) === ItemType.ACTIVE
    ) {
      logBabyInvalid(baby1, baby1Num, "has an active item in the third slot.");
    }
  }
}

function babiesCheckValidDuplicateTrinket() {
  const trinketSet = new Set<TrinketType>();

  for (const [i, baby] of Object.entries(BABIES)) {
    if ("trinket" in baby) {
      if (trinketSet.has(baby.trinket)) {
        logBabyInvalid(baby, i, `has a duplicate trinket: ${baby.trinket}`);
      } else {
        trinketSet.add(baby.trinket);
      }
    }
  }
}

function logBabyInvalid(baby: BabyDescription, babyNum: string, msg: string) {
  log(`ERROR: ${baby.name} (#${babyNum}) ${msg}`);
}

/** Use this function to find babies that are uninteresting. */
function logSpecificBabies() {
  log("Potentially boring babies with only a collectible:");

  for (const [babyNum, babyRaw] of Object.entries(BABIES)) {
    const baby = babyRaw as BabyDescription;

    if (
      baby.collectible !== undefined &&
      baby.collectible2 === undefined &&
      baby.collectibleNum === undefined &&
      baby.trinket === undefined &&
      baby.trinketNum === undefined &&
      baby.class === undefined
    ) {
      const collectibleName = getCollectibleName(baby.collectible);
      log(`- ${baby.name} (#${babyNum}) - Starts with ${collectibleName}`);
    }
  }

  log("Potentially boring babies with only a trinket:");

  for (const [babyNum, babyRaw] of Object.entries(BABIES)) {
    const baby = babyRaw as BabyDescription;

    if (
      baby.collectible === undefined &&
      baby.collectible2 === undefined &&
      baby.collectibleNum === undefined &&
      baby.trinket !== undefined &&
      baby.trinketNum === undefined &&
      baby.class === undefined
    ) {
      const trinketName = getTrinketName(baby.trinket);
      log(`- ${baby.name} (#${babyNum}) - Starts with ${trinketName}`);
    }
  }
}
