import { CollectibleType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { getBabyCollectiblesSet } from "../../babyCheckValid";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { isPlayerGoingToNextFloor } from "../../utils";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";
import { v } from "./detectTrapdoorTouched/v";

const COLLECTIBLE_TYPES_THAT_CHANGE_MINIMAP = [
  CollectibleType.COMPASS, // 21
  CollectibleType.TREASURE_MAP, // 54
  CollectibleType.SPELUNKER_HAT, // 91
  CollectibleType.BLUE_MAP, // 246
  CollectibleType.MIND, // 333
  CollectibleType.SOL, // 588
  CollectibleType.LUNA, // 589
] as const;

const COLLECTIBLE_TYPES_THAT_AFFECT_FLOOR = [
  CollectibleType.STAIRWAY,
  ...COLLECTIBLE_TYPES_THAT_CHANGE_MINIMAP,
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

    if (isPlayerGoingToNextFloor(player)) {
      v.level.touchedTrapdoor = true;
      this.removeMappingCollectibles(player, baby);
    }
  }

  /**
   * Certain collectibles apply as soon as the floor changes. Thus, if our current baby grants one
   * of these, they need to be taken away before we actually get to the next floor.
   */
  removeMappingCollectibles(player: EntityPlayer, baby: BabyDescription): void {
    const babyCollectiblesSet = getBabyCollectiblesSet(baby);

    for (const collectibleType of COLLECTIBLE_TYPES_THAT_AFFECT_FLOOR) {
      if (babyCollectiblesSet.has(collectibleType)) {
        player.RemoveCollectible(collectibleType, undefined, undefined, false);

        // Handle the special case of the Racing+ custom version of Sol.
        if (collectibleType === CollectibleType.SOL) {
          const solCustom = Isaac.GetItemIdByName("Sol (Custom)") as
            | CollectibleType
            | -1;
          if (solCustom !== -1 && player.HasCollectible(solCustom)) {
            player.RemoveCollectible(solCustom, undefined, undefined, false);
          }
        }
      }
    }
  }
}
