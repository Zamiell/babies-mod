import { ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import { postNPCUpdateBabyFunctionMap } from "./postNPCUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_NPC_UPDATE, main);
}

function main(npc: EntityNPC) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postNPCUpdateBabyFunction = postNPCUpdateBabyFunctionMap.get(babyType);
  if (postNPCUpdateBabyFunction !== undefined) {
    postNPCUpdateBabyFunction(npc);
  }
}
