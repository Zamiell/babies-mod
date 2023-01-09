import {
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, GAME_FRAMES_PER_SECOND, getNPCs } from "isaacscript-common";
import { Baby } from "../Baby";

const FREEZE_SECONDS = 5;

/** All enemies get frozen on hit. */
export class MufflerscarfBaby extends Baby {
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

    for (const npc of getNPCs()) {
      if (npc.IsVulnerableEnemy()) {
        const freezeFrames = FREEZE_SECONDS * GAME_FRAMES_PER_SECOND;
        npc.AddFreeze(EntityRef(player), freezeFrames);
      }
    }

    return undefined;
  }
}
