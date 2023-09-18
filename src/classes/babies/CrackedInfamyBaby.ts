import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearsFired: 0,
  },
};

/** Every Nth tear is a ghost from Ghost Bombs. */
export class CrackedInfamyBaby extends Baby {
  v = v;

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const num = this.getAttribute("num");

    v.run.numTearsFired++;
    if (v.run.numTearsFired === num) {
      v.run.numTearsFired = 0;
      tear.Remove();
      spawnEffect(
        EffectVariant.HUNGRY_SOUL,
        1,
        tear.Position,
        tear.Velocity,
        tear.SpawnerEntity,
        tear.InitSeed,
      );
    }
  }
}
