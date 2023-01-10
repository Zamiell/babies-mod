import { BombVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  spawnBomb,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Giga Bomb effect on hit. */
export class MagicCatBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const bomb = spawnBomb(BombVariant.GIGA, 0, player.Position);
    bomb.Visible = false;
    bomb.SetExplosionCountdown(0);

    return undefined;
  }
}
