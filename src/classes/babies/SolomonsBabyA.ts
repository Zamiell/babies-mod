import { ButtonAction, InputHook } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Can't shoot right. */
export class SolomonsBabyA extends Baby {
  // 0, 5
  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    undefined,
    undefined,
    InputHook.IS_ACTION_PRESSED,
    ButtonAction.SHOOT_RIGHT,
  )
  inputActionPlayerIsActionPressedShootRight(): boolean | undefined {
    return false;
  }

  // 2, 5
  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    undefined,
    undefined,
    InputHook.GET_ACTION_VALUE,
    ButtonAction.SHOOT_RIGHT,
  )
  inputActionPlayerGetActionValuedShootRight(): float | undefined {
    return 0;
  }
}
