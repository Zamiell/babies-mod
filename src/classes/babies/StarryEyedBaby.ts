import { CardType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  spawnCard,
  VectorZero,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a Stars Card on hit. */
export class StarryEyedBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnCard(CardType.STARS, player.Position, VectorZero, player);

    return undefined;
  }
}
