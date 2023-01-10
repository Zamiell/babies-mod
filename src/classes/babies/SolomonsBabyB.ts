import { ButtonAction, InputHook } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Can't shoot left. */
export class SolomonsBabyB extends Baby {
  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    undefined,
    undefined,
    InputHook.IS_ACTION_PRESSED,
    ButtonAction.SHOOT_LEFT,
  )
  inputActionPlayerIsActionPressedShootLeft(): number | boolean | undefined {
    return false;
  }
}
