import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { getCurrentBaby } from "../utils";
import { postGridEntityUpdateBabyFunctionMap } from "./postGridEntityUpdateBabyFunctionMap";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_GRID_ENTITY_UPDATE, main);
}

function main(gridEntity: GridEntity) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postGridEntityUpdateBabyFunction =
    postGridEntityUpdateBabyFunctionMap.get(babyType);
  if (postGridEntityUpdateBabyFunction !== undefined) {
    postGridEntityUpdateBabyFunction(gridEntity);
  }
}
