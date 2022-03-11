import { getCurrentBaby } from "../utils";
import { postNPCInitBabyFunctionMap } from "./postNPCInitBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_NPC_INIT, main);
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
