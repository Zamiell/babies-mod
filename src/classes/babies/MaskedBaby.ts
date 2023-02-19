import {
  ButtonAction,
  CollectibleType,
  InputHook,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  hasCollectible,
  isShootAction,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

const COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS = [
  CollectibleType.CHOCOLATE_MILK, // 69
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.BRIMSTONE, // 118
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.TECH_X, // 395
  CollectibleType.MAW_OF_THE_VOID, // 399
] as const;

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
