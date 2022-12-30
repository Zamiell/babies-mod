import {
  CollectibleType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import { Callback, sfxManager, useActiveItemTemp } from "isaacscript-common";
import { g } from "../../globals";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Monster Manual effect every N seconds. */
export class BoundBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      useActiveItemTemp(g.p, CollectibleType.MONSTER_MANUAL);
      sfxManager.Stop(SoundEffect.SATAN_GROW);
    }, num);
  }
}
