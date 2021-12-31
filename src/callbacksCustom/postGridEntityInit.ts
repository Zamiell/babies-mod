import {
  ModCallbacksCustom,
  ModUpgraded,
  removeGridEntity,
} from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../util";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT,
    trapdoor,
    GridEntityType.GRID_TRAPDOOR,
  );
}

// GridEntityType.GRID_TRAPDOOR (17)
function trapdoor(gridEntity: GridEntity) {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // 535
  if (baby.name === "Eyebat Baby") {
    const roomType = g.r.GetType();
    if (roomType === RoomType.ROOM_BOSS) {
      removeGridEntity(gridEntity, false);
    }
  }
}
