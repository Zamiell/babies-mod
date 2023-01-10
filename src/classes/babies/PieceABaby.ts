import { ButtonAction, InputHook } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isActionPressed,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

const BUTTON_ACTIONS_LEFT_RIGHT = [ButtonAction.LEFT, ButtonAction.RIGHT];
const BUTTON_ACTIONS_UP_DOWN = [ButtonAction.UP, ButtonAction.DOWN];

const ILLEGAL_INPUTS: ReadonlyMap<ButtonAction, readonly ButtonAction[]> =
  new Map([
    [ButtonAction.LEFT, BUTTON_ACTIONS_UP_DOWN], // 0
    [ButtonAction.RIGHT, BUTTON_ACTIONS_UP_DOWN], // 1
    [ButtonAction.UP, BUTTON_ACTIONS_LEFT_RIGHT], // 2
    [ButtonAction.DOWN, BUTTON_ACTIONS_LEFT_RIGHT], // 3
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
