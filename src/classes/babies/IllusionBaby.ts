import {
  DamageFlag,
  EntityType,
  ModCallback,
  SlotVariant,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { spawnSlotHelper } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a Crane Game on hit. */
export class IllusionBaby extends Baby {
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

    spawnSlotHelper(
      SlotVariant.CRANE_GAME,
      player.Position,
      g.run.craneGameRNG,
    );

    return undefined;
  }
}
