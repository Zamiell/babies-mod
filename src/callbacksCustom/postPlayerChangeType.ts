import { isCharacter, ModCallbackCustom } from "isaacscript-common";
import { addPlayerToCostumeProtector } from "../costumes";
import { PlayerTypeCustom } from "../enums/PlayerTypeCustom";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_CHANGE_TYPE, main);
}

function main(player: EntityPlayer) {
  if (isCharacter(player, PlayerTypeCustom.RANDOM_BABY)) {
    addPlayerToCostumeProtector(player);
  }
}
