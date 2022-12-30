import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, getEffects } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Spear of Destiny (improved) + flight. */
export class ElfBaby extends Baby {
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    // The Speak of Destiny effect is not yet spawned in the `POST_NEW_ROOM` callback. Thus, we
    // check for it on every frame instead. As an unfortunate side effect, the Spear of Destiny will
    // show as the vanilla graphic during room transitions.
    const spears = getEffects(EffectVariant.SPEAR_OF_DESTINY);
    for (const spear of spears) {
      const sprite = spear.GetSprite();
      const filename = sprite.GetFilename();

      if (filename === "gfx/1000.083_Spear Of Destiny.anm2") {
        sprite.Load("gfx/1000.083_spear of destiny2.anm2", true);
        sprite.Play("Idle", true);
      }
    }
  }
}
