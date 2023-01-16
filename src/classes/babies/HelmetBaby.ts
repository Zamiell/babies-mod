import { ButtonAction } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  copyColor,
  isActionPressed,
  ModCallbackCustom,
  setEntityOpacity,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const FADE_AMOUNT = 0.5;

/** Invulnerability when standing still. */
export class HelmetBaby extends Baby {
  /** Make sure that the fade is removed (or else it will persist to the next character). */
  override onRemove(player: EntityPlayer): void {
    const color = player.GetColor();
    const newColor = copyColor(color);
    newColor.A = 1;
    player.SetColor(newColor, 0, 0, true, true);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    if (g.run.babyBool) {
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

    // Keep track of whether they are moving or not. Also, fade the character to indicate that they
    // are invulnerable.
    if (!g.run.babyBool && noMovementInputsPressed) {
      // They stopped moving.
      g.run.babyBool = true;
      setEntityOpacity(player, FADE_AMOUNT);
    } else if (g.run.babyBool && anyMovementInputPressed) {
      // They started moving.
      g.run.babyBool = false;
      setEntityOpacity(player, 1);
    }
  }
}
