import { getCurrentBaby } from "../utils";
import { postNPCUpdateBabyFunctionMap } from "./postNPCUpdateBabyFunctionMap";

export function main(npc: EntityNPC): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postNPCUpdateBabyFunction = postNPCUpdateBabyFunctionMap.get(babyType);
  if (postNPCUpdateBabyFunction !== undefined) {
    postNPCUpdateBabyFunction(npc);
  }
}
