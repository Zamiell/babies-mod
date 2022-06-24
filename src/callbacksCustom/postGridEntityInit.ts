import { GridEntityType, RoomType } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded, removeGrid } from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_INIT,
    trapdoor,
    GridEntityType.TRAPDOOR,
  );
}

// GridEntityType.TRAPDOOR (17)
function trapdoor(gridEntity: GridEntity) {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // 535
  if (baby.name === "Eyebat Baby") {
    // Floors are reversed
    const roomType = g.r.GetType();
    if (roomType === RoomType.BOSS) {
      removeGrid(gridEntity, false);
    }
  }
}
