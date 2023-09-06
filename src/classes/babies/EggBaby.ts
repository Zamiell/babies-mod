import { PillColor, PillEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getRandomEnumValue,
  newRNG,
} from "isaacscript-common";
import { isRacingPlusEnabled, setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Random pill effect on hit. */
export class EggBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const exceptions = isRacingPlusEnabled()
      ? [
          PillEffect.AMNESIA, // 25
          PillEffect.QUESTION_MARKS, // 31
        ]
      : [];
    const pillEffect = getRandomEnumValue(PillEffect, v.run.rng, exceptions);

    player.UsePill(pillEffect, PillColor.NULL);
    // (The animation will automatically be canceled by the damage.)

    return undefined;
  }
}
