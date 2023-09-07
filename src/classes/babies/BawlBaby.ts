import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  useActiveItemTemp,
} from "isaacscript-common";
import { doesBigChestExist, getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

/** Constant Isaac's Tears effect + blindfolded. */
export class BawlBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.IPECAC);
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    tear.CollisionDamage = player.Damage / 2;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const hearts = player.GetHearts();
    const soulHearts = player.GetSoulHearts();
    const boneHearts = player.GetBoneHearts();

    if (doesBigChestExist()) {
      return;
    }

    // Prevent dying animation softlocks.
    if (hearts + soulHearts + boneHearts === 0) {
      return;
    }

    // Constant Isaac's Tears effect + blindfolded.
    if (gameFrameCount % 3 === 0) {
      useActiveItemTemp(player, CollectibleType.ISAACS_TEARS);
    }
  }
}
