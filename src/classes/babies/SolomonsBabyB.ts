import { ButtonAction, InputHook } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Can't shoot left. */
export class SolomonsBabyB extends Baby {
  // 0, 4
  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    undefined,
    undefined,
    InputHook.IS_ACTION_PRESSED,
    ButtonAction.SHOOT_LEFT,
  )
  inputActionPlayerIsActionPressedShootLeft(): boolean | undefined {
    return false;
  }

  // 2, 4
  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    undefined,
    undefined,
    InputHook.GET_ACTION_VALUE,
    ButtonAction.SHOOT_LEFT,
  )
  inputActionPlayerGetActionValueShootLeft(): float | undefined {
    return 0;
  }
}
