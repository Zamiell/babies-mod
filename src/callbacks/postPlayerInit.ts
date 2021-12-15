import { BABIES } from "../babies";
import { updateCachedPlayer } from "../cache";
import * as costumeProtector from "../lib/characterCostumeProtector";
import { NullItemIDCustom, PlayerTypeCustom } from "../types/enums";

const CUSTOM_PLAYER_ANM2 = "gfx/001.000_player_custom_baby.anm2";

export function main(player: EntityPlayer): void {
  // log(`MC_POST_PLAYER_INIT (Babies Mod)`);

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
  initCostumeProtector(player);
}

export function setBabyANM2(player: EntityPlayer) {
  const sprite = player.GetSprite();
  sprite.Load(CUSTOM_PLAYER_ANM2, true);
}

function initCostumeProtector(player: EntityPlayer) {
  costumeProtector.AddPlayer(
    player,
    PlayerTypeCustom.PLAYER_RANDOM_BABY,
    // The sprite will be replaced when the baby gets applied in the PostNewLevel callback
    // For now, default to loading the first baby sprite to avoid error in the "log.txt" file
    `gfx/characters/player2/${BABIES[0].sprite}`,
    NullItemIDCustom.BABY_FLYING,
  );
}
