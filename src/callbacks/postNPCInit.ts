import { getCurrentBaby } from "../util";
import postNPCInitBabyFunctions from "./postNPCInitBabies";

export function main(npc: EntityNPC): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postNPCInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(npc);
  }
}
