import {
  DamageFlag,
  EntityType,
  HeartSubType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  getEnumValues,
  getRandomArrayElement,
  spawnHeart,
  VectorZero,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Spawns a random heart on hit. */
export class RevengeBaby extends Baby {
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

    const heartSubTypes = getEnumValues(HeartSubType);
    const heartSubType = getRandomArrayElement(heartSubTypes, g.run.rng);
    spawnHeart(heartSubType, player.Position, VectorZero, player, g.run.rng);

    return undefined;
  }
}
