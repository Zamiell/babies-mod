import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { doesBigChestExist } from "../../utils";
import { Baby } from "../Baby";

/** Constant Isaac's Tears effect + blindfolded. */
export class BawlBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.IPECAC);
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();
    const hearts = g.p.GetHearts();
    const soulHearts = g.p.GetSoulHearts();
    const boneHearts = g.p.GetBoneHearts();

    if (doesBigChestExist()) {
      return;
    }

    // Prevent dying animation softlocks.
    if (hearts + soulHearts + boneHearts === 0) {
      return;
    }

    // Constant Isaac's Tears effect + blindfolded.
    if (gameFrameCount % 3 === 0) {
      g.run.babyBool = true;
      useActiveItemTemp(g.p, CollectibleType.ISAACS_TEARS);
      g.run.babyBool = false;
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.CollisionDamage = g.p.Damage / 2;
  }
}
