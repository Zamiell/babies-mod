import { ModCallback } from "isaac-typescript-definitions";
import { Callback, hasCollectible, setSpriteOpacity } from "isaacscript-common";
import { EXPLOSIVE_COLLECTIBLE_TYPES } from "../../constantsCollectibleTypes";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

/** Slice tears. */
export class SlicerBaby extends Baby {
  /** Explosive tears are too dangerous for a low-range build. */
  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(player, ...EXPLOSIVE_COLLECTIBLE_TYPES);
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const num = this.getAttribute("num");

    const sprite = tear.GetSprite();
    const alpha = 1 - tear.FrameCount / num;
    setSpriteOpacity(sprite, alpha);

    if (tear.FrameCount > num) {
      tear.Remove();
    }
  }

  /** Make the Soy Milk tears do extra damage. */
  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    tear.CollisionDamage = player.Damage * 3;
  }
}
