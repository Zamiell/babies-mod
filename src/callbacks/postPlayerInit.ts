import { getPlayerIndex, log } from "isaacscript-common";
import { updateCachedPlayer } from "../cache";
import { PlayerTypeCustom } from "../types/enums";

const CUSTOM_PLAYER_ANM2 = "gfx/001.000_player_custom_baby.anm2";

export function main(player: EntityPlayer): void {
  const playerIndex = getPlayerIndex(player);

  log(`MC_POST_PLAYER_INIT (Babies Mod) - ${playerIndex}`);

  // We don't care if this is a co-op baby
  if (player.Variant !== PlayerVariant.PLAYER) {
    return;
  }

  updateCachedPlayer(player);
  setBabyANM2(player);
}

function setBabyANM2(player: EntityPlayer) {
  const character = player.GetPlayerType();
  if (character === PlayerTypeCustom.PLAYER_RANDOM_BABY) {
    const sprite = player.GetSprite();
    sprite.Load(CUSTOM_PLAYER_ANM2, true);
  }
}
