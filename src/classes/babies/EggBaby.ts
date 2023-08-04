import { PillColor, PillEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getRandomEnumValue,
} from "isaacscript-common";
import { g } from "../../globals";
import { isRacingPlusEnabled } from "../../utils";
import { Baby } from "../Baby";

/** Random pill effect on hit. */
export class EggBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
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
