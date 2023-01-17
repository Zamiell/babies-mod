import {
  CollectibleType,
  EffectVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, removeAllEffects, spawnEffect } from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Summons random portals. */
export class ChokeBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.OCULAR_RIFT);
  }

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      removeAllEffects(EffectVariant.RIFT);

      const position = Isaac.GetRandomPosition();
      spawnEffect(EffectVariant.RIFT, 0, position);
    }, num);
  }
}
