import {
  CollectibleType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  inStartingRoom,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Dull Razor effect every N seconds. */
export class HeartBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    // Ignore the starting room.
    if (inStartingRoom()) {
      return;
    }

    everyNSeconds(() => {
      useActiveItemTemp(g.p, CollectibleType.DULL_RAZOR);
      sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
    }, num);
  }
}
