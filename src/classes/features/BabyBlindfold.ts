import {
  CallbackCustom,
  ModCallbackCustom,
  setBlindfold,
} from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { BabyModFeature } from "../BabyModFeature";
import { setBabyANM2 } from "./CostumeProtector";
import { getBabyType } from "./babySelection/v";

export class BabyBlindfold extends BabyModFeature {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const babyType = getBabyType();
    if (babyType === undefined) {
      return;
    }

    const baby: BabyDescription = BABIES[babyType];
    if (baby.blindfolded !== true) {
      return;
    }

    const player = Isaac.GetPlayer();

    // The blindfold has to be reapplied on every room in case the player dies.
    setBlindfold(player, true, false);

    // Setting a blindfold changes the player type, which resets the ANM2. Manually set it back.
    setBabyANM2(player);
  }
}
