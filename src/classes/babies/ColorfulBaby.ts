import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  setEntityRandomColor,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Acid trip. */
export class ColorfulBaby extends Baby {
  // 27
  @Callback(ModCallback.POST_NPC_INIT)
  postNPCInit(npc: EntityNPC): void {
    setEntityRandomColor(npc);
  }

  /** This does not work in the `POST_LASER_INIT` callback for some reason. */
  @CallbackCustom(ModCallbackCustom.POST_LASER_INIT_LATE)
  postLaserInitLate(laser: EntityLaser): void {
    setEntityRandomColor(laser);
  }
}
