import type { ButtonAction } from "isaac-typescript-definitions";
import { InputHook } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  hasCollectible,
  isShootAction,
} from "isaacscript-common";
import { COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS } from "../../constantsCollectibleTypes";
import { Baby } from "../Baby";

/** Can't shoot while moving. */
export class MaskedBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(
      player,
      ...COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS,
    );
  }

  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    undefined,
    undefined,
    InputHook.IS_ACTION_PRESSED,
  )
  inputActionPlayerIsActionPressed(
    player: EntityPlayer,
    _inputHook: InputHook,
    buttonAction: ButtonAction,
  ): number | boolean | undefined {
    if (!isShootAction(buttonAction)) {
      return undefined;
    }

    // This ability does not interact well with charged items, so don't do anything if the player
    // has a charged item.
    if (hasCollectible(player, ...COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS)) {
      return undefined;
    }

    const amMoving = player.Velocity.Length() > 0.75;
    return amMoving ? false : undefined;
  }
}
