import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import { getCurrentBaby } from "../utils";
import { postGridEntityUpdateBabyFunctionMap } from "./postGridEntityUpdateBabyFunctionMap";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE, main);
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
