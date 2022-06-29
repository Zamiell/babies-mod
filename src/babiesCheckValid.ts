import {
  CollectibleType,
  ItemType,
  TrinketType,
} from "isaac-typescript-definitions";
import { getCollectibleItemType, log } from "isaacscript-common";
import { BABIES } from "./objects/babies";

const VALID_DUPLICATE_ITEMS: ReadonlySet<CollectibleType> = new Set([
  CollectibleType.POOP, // 36
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.BRIMSTONE, // 118
  CollectibleType.PONY, // 130
  CollectibleType.CANDLE, // 164
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.SACRIFICIAL_DAGGER, // 172
  CollectibleType.ABEL, // 188
  CollectibleType.SAD_BOMBS, // 220
  CollectibleType.FIRE_MIND, // 257
  CollectibleType.HOW_TO_JUMP, // 282
  CollectibleType.HOLY_MANTLE, // 313
  CollectibleType.THE_WIZ, // 358
  CollectibleType.INCUBUS, // 360
  CollectibleType.MARKED, // 394
]);

export function babiesCheckValid(): void {
  babiesCheckValidDuplicateName();
  babiesCheckValidDuplicateItem();
  babiesCheckValidDuplicateTrinket();
}

function babiesCheckValidDuplicateName() {
  const nameSet = new Set<string>();

  for (const [babyType, baby] of Object.entries(BABIES)) {
    if (nameSet.has(baby.name)) {
      log(`ERROR: Baby #${babyType} has a duplicate name: ${baby.name}`);
    } else {
      nameSet.add(baby.name);
    }
  }
}

function babiesCheckValidDuplicateItem() {
  for (const [i, baby] of Object.entries(BABIES)) {
    // Babies with 1 item.
    if (baby.item !== undefined && baby.item2 === undefined) {
      for (const [j, baby2] of Object.entries(BABIES)) {
        if (i === j) {
          return;
        }

        if (
          baby2.item !== undefined &&
          baby2.item2 === undefined &&
          baby2.item === baby.item &&
          !VALID_DUPLICATE_ITEMS.has(baby.item)
        ) {
          log(`ERROR: Baby #${i} has a duplicate item: ${baby.item}`);
        }
      }
    }

    // Babies with 2 items.
    if (baby.item !== undefined && baby.item2 !== undefined) {
      for (const [j, baby2] of Object.entries(BABIES)) {
        if (i === j) {
          return;
        }

        if (
          baby2.item !== undefined &&
          baby2.item2 !== undefined &&
          (baby2.item === baby.item || baby2.item2 === baby.item) &&
          (baby2.item === baby.item2 || baby2.item2 === baby.item2)
        ) {
          log(
            `ERROR: Baby #${i} has a duplicate pair of items: ${baby.item} & ${baby.item2}`,
          );
        }
      }
    }

    if (
      baby.item2 !== undefined &&
      getCollectibleItemType(baby.item2) === ItemType.ACTIVE
    ) {
      log(`ERROR: Baby #${i} has an active item in the second slot.`);
    }

    if (
      baby.item3 !== undefined &&
      getCollectibleItemType(baby.item3) === ItemType.ACTIVE
    ) {
      log(`ERROR: Baby #${i} has an active item in the third slot.`);
    }
  }
}

function babiesCheckValidDuplicateTrinket() {
  const trinketSet = new Set<TrinketType>();

  for (const [i, baby] of Object.entries(BABIES)) {
    if (baby.trinket !== undefined) {
      if (trinketSet.has(baby.trinket)) {
        log(`ERROR: Baby #${i} has a duplicate trinket: ${baby.trinket}`);
      } else {
        trinketSet.add(baby.trinket);
      }
    }
  }
}
