import * as misc from "../misc";
import postEntityKillBabyFunctions from "./postEntityKillBabies";

export function main(entity: Entity): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  // We only care if an actual enemy dies
  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  const babyFunc = postEntityKillBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(npc);
  }
}
