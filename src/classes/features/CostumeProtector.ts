import type { NullItemID } from "isaac-typescript-definitions";
import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ModFeature,
  isCharacter,
} from "isaacscript-common";
import { NullItemIDCustom } from "../../enums/NullItemIDCustom";
import { PlayerTypeCustom } from "../../enums/PlayerTypeCustom";
import { RandomBabyType } from "../../enums/RandomBabyType";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import * as costumeProtector from "../../lib/characterCostumeProtector";
import { mod } from "../../mod";
import { BABIES } from "../../objects/babies";
import { getBabyType } from "./babySelection/v";

const CUSTOM_PLAYER_ANM2 = "gfx/001.000_player_custom_baby.anm2";
const FIRST_BABY_WITH_SPRITE_IN_FAMILIAR_DIRECTORY =
  RandomBabyType.BROTHER_BOBBY;
const DEFAULT_BABY_SPRITE = BABIES[0].sprite;

export function initCostumeProtector(): void {
  costumeProtector.Init(mod);
}

/**
 * We use the Costume Protector library to make the player always have the baby sprite.
 *
 * This feature does not extend from `BabyModFeature` because we do not want any validation.
 */
export class CostumeProtector extends ModFeature {
  // 9
  @Callback(ModCallback.POST_PLAYER_INIT)
  postPlayerInit(player: EntityPlayer): void {
    this.addPlayerToCostumeProtector(player);
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_CHANGE_TYPE)
  postPlayerChangeType(player: EntityPlayer): void {
    this.addPlayerToCostumeProtector(player);
  }

  addPlayerToCostumeProtector(player: EntityPlayer): void {
    if (!isCharacter(player, PlayerTypeCustom.RANDOM_BABY)) {
      return;
    }

    setBabyANM2(player);

    const character = player.GetPlayerType();
    const babyType = getBabyType();
    const baby = babyType === undefined ? undefined : BABIES[babyType];
    const [spritesheetPath, flightCostumeNullItemID] =
      getCostumeProtectorArguments(babyType, baby);

    costumeProtector.AddPlayer(
      player,
      character,
      spritesheetPath,
      flightCostumeNullItemID,
    );

    // The sprite will be also replaced when the baby gets applied in the `POST_NEW_LEVEL` callback
    // However, we still initialize it "properly" for the case where the `POST_PLAYER_INIT` callback
    // gets re-entered (e.g. when the player uses Genesis)
  }
}

/**
 * Babies use a custom ANM2 file because they have different animations than a typical custom
 * character would.
 */
export function setBabyANM2(player: EntityPlayer): void {
  const sprite = player.GetSprite();
  sprite.Load(CUSTOM_PLAYER_ANM2, true);
}

export function updatePlayerWithCostumeProtector(
  player: EntityPlayer,
  babyType: RandomBabyType,
  baby: BabyDescription,
): void {
  setBabyANM2(player);

  const character = player.GetPlayerType();
  const [spritesheetPath, flightCostumeNullItemID] =
    getCostumeProtectorArguments(babyType, baby);

  costumeProtector.UpdatePlayer(
    player,
    character,
    spritesheetPath,
    flightCostumeNullItemID,
  );
}

function getCostumeProtectorArguments(
  babyType: RandomBabyType | undefined,
  baby: BabyDescription | undefined,
): [spritesheetPath: string, flightCostumeNullItemID: NullItemID | undefined] {
  if (babyType === undefined || baby === undefined) {
    return [`gfx/characters/player2/${DEFAULT_BABY_SPRITE}`, undefined];
  }

  const gfxDirectory =
    babyType >= FIRST_BABY_WITH_SPRITE_IN_FAMILIAR_DIRECTORY
      ? "gfx/familiar"
      : "gfx/characters/player2";
  const spritesheetPath = `${gfxDirectory}/${baby.sprite}`;
  const flightCostumeNullItemID =
    babyType === RandomBabyType.BUTTERFLY_2
      ? undefined
      : NullItemIDCustom.BABY_FLYING;

  return [spritesheetPath, flightCostumeNullItemID];
}
