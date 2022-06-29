import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import { addPlayerToCostumeProtector } from "../costumes";
import g from "../globals";
import { getCurrentBaby } from "../utils";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_CHANGE_TYPE, main);
}

function main(player: EntityPlayer) {
  if (!g.run.startedRunAsRandomBaby) {
    return;
  }

  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  addPlayerToCostumeProtector(player);
}
