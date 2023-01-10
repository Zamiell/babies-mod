import { PickupVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  spawnPickup,
  VectorZero,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Spawns a random bomb on hit. */
export class RockerBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnPickup(
      PickupVariant.BOMB,
      0,
      player.Position,
      VectorZero,
      player,
      g.run.rng,
    );

    return undefined;
  }
}
