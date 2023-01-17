import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { pseudoRoomClearPostEntityKill } from "../pseudoRoomClear";
import { getCurrentBaby } from "../utilsBaby";

export function init(): void {
  mod.AddCallback(ModCallback.POST_ENTITY_KILL, main);
}

function main(entity: Entity) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  pseudoRoomClearPostEntityKill(entity);
}
