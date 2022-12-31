import {
  DamageFlag,
  EntityType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import { Callback, spawnPickup, VectorZero } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Spawns a random bomb on hit. */
export class RockerBaby extends Baby {
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(
    entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    const player = entity.ToPlayer();
    if (player === undefined) {
      return undefined;
    }

    spawnPickup(
      PickupVariant.BOMB,
      0,
      player.Position,
      VectorZero,
      player,
      g.run.rng,
    );

    return undefined;
  }
}
