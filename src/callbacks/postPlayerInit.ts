import { log } from "isaacscript-common";
import { updateCachedPlayer } from "../cache";
import { addPlayerToCostumeProtector, setBabyANM2 } from "../costumes";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";

export function main(player: EntityPlayer): void {
  log("MC_POST_PLAYER_INIT (Babies Mod)");

  // We don't care if this is a co-op baby
  if (player.Variant !== PlayerVariant.PLAYER) {
    return;
  }

  updateCachedPlayer(player);

  const character = player.GetPlayerType();
  if (character !== PlayerTypeCustom.PLAYER_RANDOM_BABY) {
    return;
  }

  setBabyANM2(player);
  addPlayerToCostumeProtector(player);
}
