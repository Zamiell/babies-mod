import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postNPCInitBabyFunctionMap } from "./postNPCInitBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_NPC_INIT, main);
}

function main(npc: EntityNPC) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postNPCInitBabyFunction = postNPCInitBabyFunctionMap.get(babyType);
  if (postNPCInitBabyFunction !== undefined) {
    postNPCInitBabyFunction(npc);
  }
}
