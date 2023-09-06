import {
  CallbackCustom,
  ModCallbackCustom,
  spawnBomb,
} from "isaacscript-common";
import { getRandomOffsetPosition } from "../../utils";
import { Baby } from "../Baby";

const v = {
  room: {
    duplicatedBombs: new Set<PtrHash>(),
  },
};

/** All bombs are doubled. */
export class BonyBaby extends Baby {
  v = v;

  /**
   * We duplicate enemies in the `POST_BOMB_INIT_LATE` callback instead of the `POST_BOMB_INIT`
   * callback so that we have time to add their hashes to the set.
   */
  @CallbackCustom(ModCallbackCustom.POST_BOMB_INIT_LATE)
  postBombInitLate(bomb: EntityBomb): void {
    const ptrHash = GetPtrHash(bomb);
    if (v.room.duplicatedBombs.has(ptrHash)) {
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

    // There is a bug where Dr. Fetus bombs that are doubled have twice as long of a cooldown.
    if (bomb.IsFetus) {
      doubledBomb.SetExplosionCountdown(28);
    }

    const newPtrHash = GetPtrHash(doubledBomb);
    v.room.duplicatedBombs.add(newPtrHash);
  }
}
