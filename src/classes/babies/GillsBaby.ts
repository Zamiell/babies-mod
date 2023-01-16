import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  getPlayerFromEntity,
  spawnEffect,
  VectorZero,
} from "isaacscript-common";
import { setTearColor } from "../../utils";
import { Baby } from "../Baby";

const LIGHT_CYAN = Color(0.7, 1.5, 2, 0.7, 1, 1, 1);

/** Splash tears. */
export class GillsBaby extends Baby {
  // 42
  @Callback(ModCallback.PRE_TEAR_COLLISION)
  preTearCollision(tear: EntityTear, collider: Entity): boolean | undefined {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    if (tear.SubType === 1) {
      const creep = spawnEffect(
        EffectVariant.PLAYER_CREEP_HOLY_WATER,
        0,
        collider.Position,
        VectorZero,
        player,
      );
      creep.Timeout = 120;
    }

    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    setTearColor(tear, LIGHT_CYAN);
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
