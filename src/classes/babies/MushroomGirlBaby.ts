import {
  BombVariant,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, spawnBomb } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearsFired: 0,
  },
};

/** Every Nth tear is a bomb. */
export class MushroomGirlBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.DR_FETUS);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    v.run.numTearsFired++;
    if (v.run.numTearsFired === num) {
      v.run.numTearsFired = 0;
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
