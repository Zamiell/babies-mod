import { ModCallback, PlayerVariant } from "isaac-typescript-definitions";
import { isCharacter } from "isaacscript-common";
import { updateCachedPlayer } from "../cache";
import { addPlayerToCostumeProtector } from "../costumes";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_PLAYER_INIT, main);
}

function main(player: EntityPlayer) {
  // log("MC_POST_PLAYER_INIT (Babies Mod)");

  // We don't care if this is a co-op baby.
  if (player.Variant !== PlayerVariant.PLAYER) {
    return;
  }

  updateCachedPlayer(player);

  if (isCharacter(player, PlayerTypeCustom.RANDOM_BABY)) {
    addPlayerToCostumeProtector(player);
  }
}
