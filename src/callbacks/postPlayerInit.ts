import { ModCallback } from "isaac-typescript-definitions";
import { isCharacter, isFirstPlayer } from "isaacscript-common";
import { addPlayerToCostumeProtector } from "../costumes";
import { PlayerTypeCustom } from "../enums/PlayerTypeCustom";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_PLAYER_INIT, main);
}

function main(player: EntityPlayer) {
  if (!isFirstPlayer(player)) {
    return;
  }

  if (isCharacter(player, PlayerTypeCustom.RANDOM_BABY)) {
    addPlayerToCostumeProtector(player);
  }
}
