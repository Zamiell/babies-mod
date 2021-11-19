import { getCurrentBaby } from "../util";
import { postNPCInitBabyFunctionMap } from "./postNPCInitBabyFunctionMap";

export function main(npc: EntityNPC): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postNPCInitBabyFunction = postNPCInitBabyFunctionMap.get(babyType);
  if (postNPCInitBabyFunction !== undefined) {
    postNPCInitBabyFunction(npc);
  }
}
