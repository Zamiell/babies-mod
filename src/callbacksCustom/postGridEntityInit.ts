import { GridEntityType, RoomType } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  ModUpgraded,
  removeGridEntity,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
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
