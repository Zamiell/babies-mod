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

const NEXT_FLOOR_PLAYER_ANIMATIONS = new ReadonlySet<string>([
  "Trapdoor",
  "Trapdoor2",
  "LightTravel",
]);

const MAPPING_COLLECTIBLE_TYPES = [
  CollectibleType.COMPASS, // 21
  CollectibleType.TREASURE_MAP, // 54
  CollectibleType.BLUE_MAP, // 246
  CollectibleType.MIND, // 333
] as const;

export class RemoveMappingBaby extends BabyModFeature {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const babyType = getBabyType();
    const baby = babyType === undefined ? undefined : BABIES[babyType];
    if (baby !== undefined) {
      this.checkPlayerGoingToNextFloor(player, baby);
    }
  }

  /**
   * If our current baby grants a mapping collectible, we cannot wait until the next floor to remove
   * it because its effect will have already been applied. So, we need to monitor for the trapdoor
   * animation.
   */
  checkPlayerGoingToNextFloor(
    player: EntityPlayer,
    baby: BabyDescription,
  ): void {
    const sprite = player.GetSprite();
    const animation = sprite.GetAnimation();

    if (NEXT_FLOOR_PLAYER_ANIMATIONS.has(animation)) {
      return;
    }

    const babyCollectiblesSet = getBabyCollectiblesSet(baby);

    for (const collectibleType of MAPPING_COLLECTIBLE_TYPES) {
      if (babyCollectiblesSet.has(collectibleType)) {
        player.RemoveCollectible(collectibleType);
      }
    }
  }
}
