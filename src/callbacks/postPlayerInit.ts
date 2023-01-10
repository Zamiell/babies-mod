import { ModCallback } from "isaac-typescript-definitions";
import { isCharacter, isFirstPlayer } from "isaacscript-common";
import { updateCachedPlayer } from "../cache";
import { addPlayerToCostumeProtector } from "../costumes";
import { mod } from "../mod";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";

export function init(): void {
  mod.AddCallback(ModCallback.POST_PLAYER_INIT, main);
}

function main(player: EntityPlayer) {
  if (!isFirstPlayer(player)) {
    return;
  }

  updateCachedPlayer(player);

  if (isCharacter(player, PlayerTypeCustom.RANDOM_BABY)) {
    addPlayerToCostumeProtector(player);
  }
}
