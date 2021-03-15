import * as misc from "../misc";
import NPCUpdateBabyFunctions from "./NPCUpdateBabies";

export function main(npc: EntityNPC): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = NPCUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(npc);
  }
}
