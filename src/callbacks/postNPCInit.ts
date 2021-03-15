import * as misc from "../misc";
import postNPCInitBabyFunctions from "./postNPCInitBabies";

export function main(npc: EntityNPC): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postNPCInitBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(npc);
  }
}
