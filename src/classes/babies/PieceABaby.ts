import { ButtonAction, InputHook } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  ReadonlyMap,
  isActionPressed,
} from "isaacscript-common";
import { Baby } from "../Baby";

const ILLEGAL_INPUTS = new ReadonlyMap<ButtonAction, readonly ButtonAction[]>([
  [ButtonAction.LEFT, [ButtonAction.UP, ButtonAction.DOWN]], // 0
  [ButtonAction.RIGHT, [ButtonAction.UP, ButtonAction.DOWN]], // 1
  [ButtonAction.UP, [ButtonAction.LEFT, ButtonAction.RIGHT]], // 2
  [ButtonAction.DOWN, [ButtonAction.LEFT, ButtonAction.RIGHT]], // 3
]);

/** Can only move up + down + left + right. */
export class PieceABaby extends Baby {
  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_PLAYER,
    undefined,
    undefined,
    InputHook.GET_ACTION_VALUE,
  )
  inputActionPlayerGetActionValue(
    player: EntityPlayer,
    _inputHook: InputHook,
    buttonAction: ButtonAction,
  ): number | boolean | undefined {
    const illegalInputs = ILLEGAL_INPUTS.get(buttonAction);
    if (illegalInputs === undefined) {
      return undefined;
    }

    const pressingIllegalInput = isActionPressed(
      player.ControllerIndex,
      ...illegalInputs,
    );
    return pressingIllegalInput ? 0 : undefined;
  }
}
