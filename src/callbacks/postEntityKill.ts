import { ModCallback } from "isaac-typescript-definitions";
import g from "../globals";
import { getCurrentBaby } from "../utils";
import { postEntityKillBabyFunctionMap } from "./postEntityKillBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_ENTITY_KILL, main);
}

function main(entity: Entity) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // We only care if an actual enemy dies.
  const npc = entity.ToNPC();
  if (npc === undefined) {
    return;
  }

  // With respect to the pseudo-room-clear feature, we don't want to clear the room too fast after
  // an enemy dies.
  g.run.room.clearDelayFrame = g.g.GetFrameCount() + 1;

  const postEntityKillBabyFunction =
    postEntityKillBabyFunctionMap.get(babyType);
  if (postEntityKillBabyFunction !== undefined) {
    postEntityKillBabyFunction(npc);
  }
}
