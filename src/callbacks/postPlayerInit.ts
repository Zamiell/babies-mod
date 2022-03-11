import { updateCachedPlayer } from "../cache";
import { addPlayerToCostumeProtector } from "../costumes";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, main);
}

function main(player: EntityPlayer) {
  // log("MC_POST_PLAYER_INIT (Babies Mod)");

  // We don't care if this is a co-op baby
  if (player.Variant !== PlayerVariant.PLAYER) {
    return;
  }

  updateCachedPlayer(player);

  const character = player.GetPlayerType();
  if (character !== PlayerTypeCustom.PLAYER_RANDOM_BABY) {
    return;
  }

  addPlayerToCostumeProtector(player);
}
