import { log } from "isaacscript-common";
import g from "./globals";
import { CollectibleTypeCustom } from "./types/enums";
import { getItemConfig } from "./util";

export function checkBabiesValid(): void {
  checkBabiesDuplicateName();
  checkBabiesDuplicateItem();
  checkBabiesDuplicateTrinket();
}

function checkBabiesDuplicateName() {
  const nameMap = new Map<string, boolean>();
  for (let i = 0; i < g.babies.length; i++) {
    const baby = g.babies[i];

    if (nameMap.has(baby.name)) {
      log(`ERROR: Baby #${i} has a duplicate name: ${baby.name}`);
    } else {
      nameMap.set(baby.name, true);
    }
  }
}

function checkBabiesDuplicateItem() {
  const itemExceptions: Array<CollectibleType | CollectibleTypeCustom> = [
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
    CollectibleType.COLLECTIBLE_THE_WIZ, // 358
    CollectibleType.COLLECTIBLE_INCUBUS, // 360
    CollectibleType.COLLECTIBLE_MARKED, // 394
  ];
  for (let i = 0; i < g.babies.length; i++) {
    const baby = g.babies[i];

    if (baby.item !== undefined && baby.item2 === undefined) {
      for (let j = 0; j < g.babies.length; j++) {
        if (i === j) {
          continue;
        }

        const baby2 = g.babies[j];
        if (
          baby2.item !== undefined &&
          baby2.item2 === undefined &&
          baby2.item === baby.item &&
          !itemExceptions.includes(baby.item)
        ) {
          log(`ERROR: Baby #${i} has a duplicate item: ${baby.item}`);
        }
      }
    }

    if (baby.item !== undefined && baby.item2 !== undefined) {
      for (let j = 0; j < g.babies.length; j++) {
        if (i === j) {
          continue;
        }

        const baby2 = g.babies[j];
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
      getItemConfig(baby.item2).Type === ItemType.ITEM_ACTIVE
    ) {
      log(`ERROR: Baby #${i} has an active item in the second slot.`);
    }
  }
}

function checkBabiesDuplicateTrinket() {
  const trinketMap = new Map<TrinketType, boolean>();
  for (let i = 0; i < g.babies.length; i++) {
    const baby = g.babies[i];

    if (baby.trinket !== undefined) {
      if (trinketMap.has(baby.trinket)) {
        log(`ERROR: Baby #${i} has a duplicate trinket: ${baby.trinket}`);
      } else {
        trinketMap.set(baby.trinket, true);
      }
    }
  }
}
