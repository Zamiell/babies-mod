import { ButtonAction } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  copyColor,
  isActionPressed,
  ModCallbackCustom,
  setEntityOpacity,
} from "isaacscript-common";
import { Baby } from "../Baby";

const FADE_AMOUNT = 0.5;

const v = {
  run: {
    isInvulnerable: false,
  },
};

/** Invulnerability when standing still. */
export class HelmetBaby extends Baby {
  v = v;

  /** Make sure that the fade is removed (or else it will persist to the next character). */
  override onRemove(player: EntityPlayer): void {
    const color = player.GetColor();
    const newColor = copyColor(color);
    newColor.A = 1;
    player.SetColor(newColor, 0, 0, true, true);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    if (v.run.isInvulnerable) {
      return false;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const leftPressed = isActionPressed(
      player.ControllerIndex,
      ButtonAction.LEFT,
    );
    const rightPressed = isActionPressed(
      player.ControllerIndex,
      ButtonAction.RIGHT,
    );
    const upPressed = isActionPressed(player.ControllerIndex, ButtonAction.UP);
    const downPressed = isActionPressed(
      player.ControllerIndex,
      ButtonAction.DOWN,
    );
    const anyMovementInputPressed =
      leftPressed || rightPressed || upPressed || downPressed;
    const noMovementInputsPressed =
      !leftPressed && !rightPressed && !upPressed && !downPressed;

    // Keep track of whether they are moving. Also, fade the character to indicate that they are
    // invulnerable.
    if (!v.run.isInvulnerable && noMovementInputsPressed) {
      // They stopped moving.
      v.run.isInvulnerable = true;
      setEntityOpacity(player, FADE_AMOUNT);
    } else if (v.run.isInvulnerable && anyMovementInputPressed) {
      // They started moving.
      v.run.isInvulnerable = false;
      setEntityOpacity(player, 1);
    }
  }
}
