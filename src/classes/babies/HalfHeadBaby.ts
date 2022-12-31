import {
  DamageFlag,
  DamageFlagZero,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Takes 2x damage. */
export class HalfHeadBaby extends Baby {
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(
    entity: Entity,
    amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    countdownFrames: int,
  ): boolean | undefined {
    const player = entity.ToPlayer();
    if (player === undefined) {
      return undefined;
    }

    if (g.run.babyBool) {
      return undefined;
    }

    g.run.babyBool = true;
    player.TakeDamage(
      amount,
      DamageFlagZero,
      EntityRef(player),
      countdownFrames,
    );
    g.run.babyBool = false;

    return undefined;
  }
}
