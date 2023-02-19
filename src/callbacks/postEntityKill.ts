import { ModCallback } from "isaac-typescript-definitions";
import { pseudoRoomClearPostEntityKill } from "../features/pseudoRoomClear";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";

export function init(): void {
  mod.AddCallback(ModCallback.POST_ENTITY_KILL, main);
}

function main(entity: Entity) {
  const currentBaby = getCurrentBaby();
  if (currentBaby === undefined) {
    return;
  }

  pseudoRoomClearPostEntityKill(entity);
}
