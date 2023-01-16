import { BombVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity, spawnBomb } from "isaacscript-common";
import { isValidRandomBabyPlayer } from "../../utils";
import { Baby } from "../Baby";

/** Placed bombs are Mega Troll Bombs. */
export class OrangeGhostBaby extends Baby {
  @Callback(ModCallback.POST_BOMB_INIT)
  postBombInit(bomb: EntityBomb): void {
    const player = getPlayerFromEntity(bomb);
    if (player === undefined) {
      return;
    }

    if (!isValidRandomBabyPlayer(player)) {
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
