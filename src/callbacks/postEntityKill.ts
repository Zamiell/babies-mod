import { getCurrentBaby } from "../util";
import { postEntityKillBabyFunctionMap } from "./postEntityKillBabyFunctionMap";

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

  const postEntityKillBabyFunction =
    postEntityKillBabyFunctionMap.get(babyType);
  if (postEntityKillBabyFunction !== undefined) {
    postEntityKillBabyFunction(npc);
  }
}
