// This is code relating to making the player always have the baby sprite. We use Sanio's Costume
// Protector library to accomplish this.

import { NullItemID } from "isaac-typescript-definitions";
import { BABIES, RandomBabyType } from "./babies";
import * as costumeProtector from "./lib/characterCostumeProtector";
import { NullItemIDCustom } from "./types/NullItemIDCustom";
import { getCurrentBaby } from "./utils";

const CUSTOM_PLAYER_ANM2 = "gfx/001.000_player_custom_baby.anm2";
const FIRST_BABY_WITH_SPRITE_IN_FAMILIAR_DIRECTORY =
  RandomBabyType.BROTHER_BOBBY;

const firstBaby = BABIES[0];
if (firstBaby === undefined) {
  error("Failed to get the first baby.");
}
const DEFAULT_BABY_SPRITE = firstBaby.sprite;

export function initCostumeProtector(mod: Mod): void {
  costumeProtector.Init(mod);
}

/**
 * Babies use a custom ANM2 file because they have different animations than a typical custom
 * character would.
 */
export function setBabyANM2(player: EntityPlayer): void {
  const sprite = player.GetSprite();
  sprite.Load(CUSTOM_PLAYER_ANM2, true);
}

export function addPlayerToCostumeProtector(player: EntityPlayer): void {
  setBabyANM2(player);

  const character = player.GetPlayerType();
  const [spritesheetPath, flightCostumeNullItemID] =
    getCostumeProtectorArguments();

  costumeProtector.AddPlayer(
    player,
    character,
    spritesheetPath,
    flightCostumeNullItemID,
  );

  // The sprite will be also replaced when the baby gets applied in the PostNewLevel callback
  // However, we still initialize it "properly" for the case where the PostPlayerInit callback gets
  // re-entered (e.g. when the player uses Genesis)
}

export function updatePlayerWithCostumeProtector(player: EntityPlayer): void {
  setBabyANM2(player);

  const character = player.GetPlayerType();
  const [spritesheetPath, flightCostumeNullItemID] =
    getCostumeProtectorArguments();

  costumeProtector.UpdatePlayer(
    player,
    character,
    spritesheetPath,
    flightCostumeNullItemID,
  );
}

function getCostumeProtectorArguments(): [
  spritesheetPath: string,
  flightCostumeNullItemID: NullItemID | undefined,
] {
  const [babyType, baby, valid] = getCurrentBaby();
  if (!valid) {
    return [`gfx/characters/player2/${DEFAULT_BABY_SPRITE}`, undefined];
  }

  const gfxDirectory =
    babyType >= (FIRST_BABY_WITH_SPRITE_IN_FAMILIAR_DIRECTORY as int)
      ? "gfx/familiar"
      : "gfx/characters/player2";
  const spritesheetPath = `${gfxDirectory}/${baby.sprite}`;
  const flightCostumeNullItemID =
    baby.name === "Butterfly Baby 2" ? undefined : NullItemIDCustom.BABY_FLYING;

  return [spritesheetPath, flightCostumeNullItemID];
}
