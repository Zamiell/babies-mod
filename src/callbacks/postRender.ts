import {
  ActiveSlot,
  ItemType,
  ModCallback,
} from "isaac-typescript-definitions";
import { getCollectibleItemType } from "isaacscript-common";
import { getBabyType } from "../classes/features/babySelection/v";
import type { BabyDescription } from "../interfaces/BabyDescription";
import { mod } from "../mod";
import { BABIES } from "../objects/babies";
import { newSprite } from "../sprite";

const CLOCK_POSITION = Vector(30, 30);
const CLOCK_SPRITE = newSprite("gfx/clock.anm2");

export function init(): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  const babyType = getBabyType();
  if (babyType === undefined) {
    return;
  }

  const baby = BABIES[babyType];
  drawTempIconNextToActiveCollectible(baby);
}

/**
 * Draw a temporary icon next to the baby's active item to signify that it will go away at the of
 * the floor.
 */
function drawTempIconNextToActiveCollectible(baby: BabyDescription) {
  if (baby.collectible === undefined) {
    return;
  }

  const itemType = getCollectibleItemType(baby.collectible);
  if (itemType !== ItemType.ACTIVE) {
    return;
  }

  const player = Isaac.GetPlayer();
  const activeCollectibleType = player.GetActiveItem(ActiveSlot.PRIMARY);
  if (activeCollectibleType !== baby.collectible) {
    return;
  }

  // The player has the item in their main active slot. Draw the icon in the bottom-right hand
  // corner.
  CLOCK_SPRITE.Render(CLOCK_POSITION);
}
