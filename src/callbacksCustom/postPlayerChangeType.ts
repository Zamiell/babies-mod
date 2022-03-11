import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import { addPlayerToCostumeProtector } from "../costumes";
import g from "../globals";
import { getCurrentBaby } from "../utils";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_PLAYER_CHANGE_TYPE, main);
}

function main(player: EntityPlayer) {
  if (!g.run.startedRunAsRandomBaby) {
    return;
  }

  const [, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  addPlayerToCostumeProtector(player);
}
