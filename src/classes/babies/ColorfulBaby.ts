import { ModCallback } from "isaac-typescript-definitions";
import { Callback, setEntityRandomColor } from "isaacscript-common";
import { Baby } from "../Baby";

/** Acid trip. */
export class ColorfulBaby extends Baby {
  @Callback(ModCallback.POST_NPC_INIT)
  postNPCInit(npc: EntityNPC): void {
    setEntityRandomColor(npc);
  }
}
