import { getCurrentBaby } from "../utils";
import { postNPCUpdateBabyFunctionMap } from "./postNPCUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_NPC_UPDATE, main);
}

function main(npc: EntityNPC) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postNPCUpdateBabyFunction = postNPCUpdateBabyFunctionMap.get(babyType);
  if (postNPCUpdateBabyFunction !== undefined) {
    postNPCUpdateBabyFunction(npc);
  }
}
