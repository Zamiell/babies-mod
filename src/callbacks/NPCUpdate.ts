import { getCurrentBaby } from "../misc";
import NPCUpdateBabyFunctions from "./NPCUpdateBabies";

export function main(npc: EntityNPC): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = NPCUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(npc);
  }
}
