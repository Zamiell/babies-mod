import {
  EntityType,
  ModCallback,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Lemon Party effect on hit. */
export class YellowBaby extends Baby {
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(entity: Entity): boolean | undefined {
    const player = entity.ToPlayer();
    if (player === undefined) {
      return;
    }

    player.UsePill(PillEffect.LEMON_PARTY, PillColor.NULL);

    return undefined;
  }
}
