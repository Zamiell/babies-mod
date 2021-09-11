import { getCurrentBaby } from "../misc";
import postEntityKillBabyFunctions from "./postEntityKillBabies";

export function main(entity: Entity): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // We only care if an actual enemy dies
  const npc = entity.ToNPC();
  if (npc === undefined) {
    return;
  }

  const babyFunc = postEntityKillBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(npc);
  }
}
