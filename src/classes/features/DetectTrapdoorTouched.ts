import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
} from "isaacscript-common";
import { getBabyCollectiblesSet } from "../../babyCheckValid";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";
import { v } from "./detectTrapdoorTouched/v";

const NEXT_FLOOR_PLAYER_ANIMATIONS = new ReadonlySet<string>([
  "Trapdoor",
  "TrapdoorCustom",
  "LightTravel",
  "LightTravelCustom",
]);

const COLLECTIBLE_TYPES_THAT_CHANGE_MINIMAP = [
  CollectibleType.COMPASS, // 21
  CollectibleType.TREASURE_MAP, // 54
  CollectibleType.SPELUNKER_HAT, // 91
  CollectibleType.BLUE_MAP, // 246
  CollectibleType.MIND, // 333
  CollectibleType.SOL, // 588
  CollectibleType.LUNA, // 589
] as const;

export class DetectTrapdoorTouched extends BabyModFeature {
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const babyType = getBabyType();
    const baby = babyType === undefined ? undefined : BABIES[babyType];
    if (baby !== undefined) {
      this.checkBabyGoingToNextFloor(player, baby);
    }
  }

  checkBabyGoingToNextFloor(player: EntityPlayer, baby: BabyDescription): void {
    if (v.level.touchedTrapdoor) {
      return;
    }

    const sprite = player.GetSprite();
    const animation = sprite.GetAnimation();

    if (NEXT_FLOOR_PLAYER_ANIMATIONS.has(animation)) {
      v.level.touchedTrapdoor = true;
      this.removeMappingCollectibles(player, baby);
    }
  }

  /**
   * If our current baby grants a mapping collectible, we cannot wait until the next floor to remove
   * it because its effect will have already been applied. So, we need to monitor for the trapdoor
   * animation.
   */
  removeMappingCollectibles(player: EntityPlayer, baby: BabyDescription): void {
    const babyCollectiblesSet = getBabyCollectiblesSet(baby);

    for (const collectibleType of COLLECTIBLE_TYPES_THAT_CHANGE_MINIMAP) {
      if (babyCollectiblesSet.has(collectibleType)) {
        player.RemoveCollectible(collectibleType, undefined, undefined, false);
      }
    }
  }
}
