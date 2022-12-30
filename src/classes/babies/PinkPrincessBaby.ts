import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnEffect } from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Summons random stomps every N seconds. */
export class PinkPrincessBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      const randomPosition = Isaac.GetRandomPosition();
      spawnEffect(EffectVariant.MOM_FOOT_STOMP, 0, randomPosition);
    }, num);
  }
}
