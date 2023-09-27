import type { DamageFlag } from "isaac-typescript-definitions";
import { CardType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isSelfDamage,
  onStage,
  useCardTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Teleport to starting room on hit. */
export class RottenMeatBaby extends Baby {
  /** Too punishing on Hush and Delirium. Teleports don't work in The Beast fight. */
  override isValid(): boolean {
    return !onStage(
      LevelStage.BLUE_WOMB, // 9
      LevelStage.VOID, // 12
      LevelStage.HOME, // 13
    );
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (isSelfDamage(damageFlags)) {
      return undefined;
    }

    useCardTemp(player, CardType.FOOL);
    return undefined;
  }
}
