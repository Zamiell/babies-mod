import {
  BombVariant,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, spawnBomb } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Every 8th tear is a bomb. */
export class MushroomGirlBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.DR_FETUS);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    g.run.babyCounters++;
    if (g.run.babyCounters === num) {
      g.run.babyCounters = 0;
      tear.Remove();
      spawnBomb(
        BombVariant.NORMAL,
        0,
        tear.Position,
        tear.Velocity,
        tear.SpawnerEntity,
        tear.InitSeed,
      );
    }
  }
}
