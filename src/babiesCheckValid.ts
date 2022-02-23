import { getCollectibleItemType, log } from "isaacscript-common";
import { BABIES } from "./babies";
import { CollectibleTypeCustom } from "./types/CollectibleTypeCustom";

const VALID_DUPLICATE_ITEMS: ReadonlySet<
  CollectibleType | CollectibleTypeCustom
> = new Set([
  CollectibleType.COLLECTIBLE_POOP, // 36
  CollectibleType.COLLECTIBLE_MOMS_KNIFE, // 114
  CollectibleType.COLLECTIBLE_BRIMSTONE, // 118
  CollectibleType.COLLECTIBLE_PONY, // 130
  CollectibleType.COLLECTIBLE_CANDLE, // 164
  CollectibleType.COLLECTIBLE_EPIC_FETUS, // 168
  CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, // 172
  CollectibleType.COLLECTIBLE_ABEL, // 188
  CollectibleType.COLLECTIBLE_SAD_BOMBS, // 220
  CollectibleType.COLLECTIBLE_FIRE_MIND, // 257
  CollectibleType.COLLECTIBLE_HOW_TO_JUMP, // 282
  CollectibleType.COLLECTIBLE_HOLY_MANTLE, // 313
  CollectibleType.COLLECTIBLE_THE_WIZ, // 358
  CollectibleType.COLLECTIBLE_INCUBUS, // 360
  CollectibleType.COLLECTIBLE_MARKED, // 394
]);

export function babiesCheckValid(): void {
  babiesCheckValidDuplicateName();
  babiesCheckValidDuplicateItem();
  babiesCheckValidDuplicateTrinket();
}

function babiesCheckValidDuplicateName() {
  const nameSet = new Set<string>();
  for (let i = 0; i < BABIES.length; i++) {
    const baby = BABIES[i];

    if (nameSet.has(baby.name)) {
      log(`ERROR: Baby #${i} has a duplicate name: ${baby.name}`);
    } else {
      nameSet.add(baby.name);
    }
  }
}

function babiesCheckValidDuplicateItem() {
  for (let i = 0; i < BABIES.length; i++) {
    const baby = BABIES[i];

    // Babies with 1 item
    if (baby.item !== undefined && baby.item2 === undefined) {
      for (let j = 0; j < BABIES.length; j++) {
        if (i === j) {
          continue;
        }

        const baby2 = BABIES[j];
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

    // Babies with 2 items
    if (baby.item !== undefined && baby.item2 !== undefined) {
      for (let j = 0; j < BABIES.length; j++) {
        if (i === j) {
          continue;
        }

        const baby2 = BABIES[j];
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
      getCollectibleItemType(baby.item2) === ItemType.ITEM_ACTIVE
    ) {
      log(`ERROR: Baby #${i} has an active item in the second slot.`);
    }

    if (
      baby.item3 !== undefined &&
      getCollectibleItemType(baby.item3) === ItemType.ITEM_ACTIVE
    ) {
      log(`ERROR: Baby #${i} has an active item in the third slot.`);
    }
  }
}

function babiesCheckValidDuplicateTrinket() {
  const trinketSet = new Set<TrinketType>();
  for (let i = 0; i < BABIES.length; i++) {
    const baby = BABIES[i];

    if (baby.trinket !== undefined) {
      if (trinketSet.has(baby.trinket)) {
        log(`ERROR: Baby #${i} has a duplicate trinket: ${baby.trinket}`);
      } else {
        trinketSet.add(baby.trinket);
      }
    }
  }
}
