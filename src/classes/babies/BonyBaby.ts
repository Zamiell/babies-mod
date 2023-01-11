import { ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnBomb } from "isaacscript-common";
import { getRandomOffsetPosition } from "../../utils";
import { Baby } from "../Baby";

const DATA_KEY = "BabiesModDoubled";

/** All bombs are doubled. */
export class BonyBaby extends Baby {
  @Callback(ModCallback.POST_BOMB_UPDATE)
  postBombUpdate(bomb: EntityBomb): void {
    // Doubling on frame 0 does not work.
    if (bomb.FrameCount !== 1) {
      return;
    }

    const data = bomb.GetData();
    if (data[DATA_KEY] !== undefined) {
      return;
    }

    const position = getRandomOffsetPosition(bomb.Position, 15, bomb.InitSeed);
    const doubledBomb = spawnBomb(
      bomb.Variant,
      bomb.SubType,
      position,
      bomb.Velocity,
      bomb.SpawnerEntity,
      bomb.InitSeed,
    );
    doubledBomb.Flags = bomb.Flags;
    doubledBomb.IsFetus = bomb.IsFetus;
    doubledBomb.ExplosionDamage = bomb.ExplosionDamage;
    doubledBomb.RadiusMultiplier = bomb.RadiusMultiplier;
    const doubledBombData = doubledBomb.GetData();
    doubledBombData[DATA_KEY] = true;

    // There is a bug where Dr. Fetus bombs that are doubled have twice as long of a cooldown.
    if (bomb.IsFetus) {
      doubledBomb.SetExplosionCountdown(28);
    }
  }
}
