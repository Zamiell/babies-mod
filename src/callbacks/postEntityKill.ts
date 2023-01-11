import { ModCallback } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { g } from "../globals";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";

export function init(): void {
  mod.AddCallback(ModCallback.POST_ENTITY_KILL, main);
}

function main(entity: Entity) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // We only care if an actual enemy dies.
  const npc = entity.ToNPC();
  if (npc === undefined) {
    return;
  }

  const gameFrameCount = game.GetFrameCount();

  // With respect to the pseudo-room-clear feature, we don't want to clear the room too fast after
  // an enemy dies.
  g.run.room.clearDelayFrame = gameFrameCount + 1;
}
