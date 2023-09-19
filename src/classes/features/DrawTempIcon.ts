import {
  ActiveSlot,
  ItemType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  getCollectibleItemType,
  newSprite,
} from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";

const CLOCK_POSITION = Vector(30, 30);
const CLOCK_SPRITE = newSprite("gfx/clock.anm2");

/**
 * This draws an icon next to a baby's active item in order to indicate that it will go away at the
 * end of the floor.
 */
export class DrawTempIcon extends BabyModFeature {
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const babyType = getBabyType();
    if (babyType === undefined) {
      return;
    }
    const baby: BabyDescription = BABIES[babyType];

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

    CLOCK_SPRITE.Render(CLOCK_POSITION);
  }
}
