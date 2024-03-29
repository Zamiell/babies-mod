import { CardType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  spawnCard,
  VectorZero,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a Sun Card on hit. */
export class BlindingBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnCard(CardType.SUN, player.Position, VectorZero, player);
    return undefined;
  }
}
