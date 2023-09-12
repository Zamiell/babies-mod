import { CollectibleType } from "isaac-typescript-definitions";
import { CallbackCustom, game, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Mama Mega effect on hit. */
export class NuclearBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.MAMA_MEGA);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const room = game.GetRoom();
    room.MamaMegaExplosion(player.Position);

    return undefined;
  }
}
