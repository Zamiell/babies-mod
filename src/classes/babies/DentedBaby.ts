import {
  DamageFlag,
  EntityType,
  KeySubType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, spawnKey, VectorZero } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Spawns a random key on hit. */
export class DentedBaby extends Baby {
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

    spawnKey(KeySubType.NULL, player.Position, VectorZero, player, g.run.rng);

    return undefined;
  }
}
