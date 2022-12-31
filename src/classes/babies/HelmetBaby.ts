import {
  ButtonAction,
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  copyColor,
  isActionPressedOnAnyInput,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Invulnerability when standing still. */
export class HelmetBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const leftPressed = isActionPressedOnAnyInput(ButtonAction.LEFT);
    const rightPressed = isActionPressedOnAnyInput(ButtonAction.RIGHT);
    const upPressed = isActionPressedOnAnyInput(ButtonAction.UP);
    const downPressed = isActionPressedOnAnyInput(ButtonAction.DOWN);
    const anyMovementInputPressed =
      leftPressed || rightPressed || upPressed || downPressed;
    const noMovementInputsPressed =
      !leftPressed && !rightPressed && !upPressed && !downPressed;

    // Keep track of whether they are moving or not. Also, fade the character to indicate that they
    // are invulnerable.
    if (!g.run.babyBool && noMovementInputsPressed) {
      // They stopped moving.
      g.run.babyBool = true;
      const color = g.p.GetColor();
      const fadeAmount = 0.5;
      const newColor = copyColor(color);
      newColor.A = fadeAmount;
      g.p.SetColor(newColor, 0, 0, true, true);
    } else if (g.run.babyBool && anyMovementInputPressed) {
      // They started moving.
      g.run.babyBool = false;
      const color = g.p.GetColor();
      const fadeAmount = 1;
      const newColor = copyColor(color);
      newColor.A = fadeAmount;
      g.p.SetColor(newColor, 0, 0, true, true);
    }
  }

  // 11
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(
    _entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (g.run.babyBool) {
      return false;
    }

    return undefined;
  }
}
