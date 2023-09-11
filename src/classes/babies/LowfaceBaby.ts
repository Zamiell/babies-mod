import { SoundEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  sfxManager,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numHits: 0,
  },
};

/** Reveals the floor layout after 6 hits. */
export class LowfaceBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    const num = this.getAttribute("requireNumHits");

    v.run.numHits++;
    if (v.run.numHits === num) {
      const level = game.GetLevel();
      level.ApplyMapEffect();
      level.ApplyCompassEffect(true);
      level.ApplyBlueMapEffect();

      sfxManager.Play(SoundEffect.THUMBS_UP);
    }

    return undefined;
  }
}
