import { GridEntityType, RoomType } from "isaac-typescript-definitions";
import { ModCallbackCustom, removeGridEntity } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_INIT,
    trapdoor,
    GridEntityType.TRAPDOOR,
  );
}

// GridEntityType.TRAPDOOR (17)
function trapdoor(gridEntity: GridEntity) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // 535
  if (babyType === RandomBabyType.EYEBAT) {
    // Floors are reversed.
    const roomType = g.r.GetType();
    if (roomType === RoomType.BOSS) {
      removeGridEntity(gridEntity, false);
    }
  }
}
