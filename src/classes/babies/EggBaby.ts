import {
  DamageFlag,
  EntityType,
  ModCallback,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import { Callback, getRandomEnumValue } from "isaacscript-common";
import { g } from "../../globals";
import { isRacingPlusEnabled } from "../../utils";
import { Baby } from "../Baby";

/** Random pill effect on hit. */
export class EggBaby extends Baby {
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

    const exceptions = isRacingPlusEnabled()
      ? [
          PillEffect.AMNESIA, // 25
          PillEffect.QUESTION_MARKS, // 31
        ]
      : [];
    const pillEffect = getRandomEnumValue(PillEffect, g.run.rng, exceptions);

    player.UsePill(pillEffect, PillColor.NULL);
    // (The animation will automatically be canceled by the damage.)

    return undefined;
  }
}
