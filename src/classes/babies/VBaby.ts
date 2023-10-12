import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, hasCollectible } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const RING_RADIUS = 5;

const ANTI_SYNERGY_COLLECTIBLES = [
  CollectibleType.C_SECTION, // 678
] as const;

/** Electric ring tears. */
export class VBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(player, ...ANTI_SYNERGY_COLLECTIBLES);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    player.FireTechXLaser(tear.Position, tear.Velocity, RING_RADIUS);
    tear.Remove();
  }
}
