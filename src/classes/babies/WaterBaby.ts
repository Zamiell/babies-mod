import {
  CollectibleAnimation,
  CollectibleType,
  ModCallback,
  PlayerItemAnimation,
} from "isaac-typescript-definitions";
import { Callback, repeat } from "isaacscript-common";
import { Baby } from "../Baby";

const NUM_VANILLA_ISAAC_TEARS_TEARS = 8;
const BASE_VELOCITY: Readonly<Vector> = Vector(10, 0);

/** Starts with Isaac's Tears (improved). */
export class WaterBaby extends Baby {
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.ISAACS_TEARS)
  preUseItem(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    repeat(NUM_VANILLA_ISAAC_TEARS_TEARS, (i) => {
      const velocity = BASE_VELOCITY.Rotated(45 * (i + 1));
      const tear = player.FireTear(
        player.Position,
        velocity,
        false,
        false,
        false,
      );

      // Increase the damage and make it look more impressive. (We retain the flat +5 damage bonus
      // granted in the Repentance version of the item.)
      tear.CollisionDamage = player.Damage * 2 + 5;
      tear.Scale = 2;
      tear.KnockbackMultiplier = 20;
    });

    // When we return from the function below, no animation will play, so we have to explicitly
    // perform one.
    player.AnimateCollectible(
      CollectibleType.ISAACS_TEARS,
      PlayerItemAnimation.USE_ITEM,
      CollectibleAnimation.PLAYER_PICKUP,
    );

    // Cancel the original effect.
    return true;
  }
}
