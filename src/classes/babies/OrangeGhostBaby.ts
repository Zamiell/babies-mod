import {
  BombVariant,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, spawnBomb } from "isaacscript-common";
import { Baby } from "../Baby";

/** Placed bombs are Mega Troll Bombs. */
export class OrangeGhostBaby extends Baby {
  @Callback(ModCallback.POST_BOMB_INIT)
  postBombInit(bomb: EntityBomb): void {
    if (bomb.SpawnerType !== EntityType.PLAYER) {
      return;
    }

    if (bomb.Variant !== BombVariant.MEGA_TROLL) {
      bomb.Remove();
      spawnBomb(
        BombVariant.MEGA_TROLL,
        bomb.SubType,
        bomb.Position,
        bomb.Velocity,
        bomb.SpawnerEntity,
        bomb.InitSeed,
      );
    }
  }
}
