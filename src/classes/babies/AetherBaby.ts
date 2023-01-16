import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** All direction tears. */
export class AetherBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.IPECAC);
  }

  /** Shoot 8 tears at a time. (We store the rotation angle inside the "babyCounters" variable.) */
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    g.run.babyCounters += 45;
    if (g.run.babyCounters < 360) {
      const velocity = tear.Velocity.Rotated(g.run.babyCounters);
      player.FireTear(player.Position, velocity, false, true, false);
    } else {
      g.run.babyCounters = 0;
    }
  }
}
