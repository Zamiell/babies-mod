import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  ModCallbackCustom,
  newRNG,
} from "isaacscript-common";
import { mod } from "../../../mod";
import { setInitialBabyRNG } from "../../../utils";
import { Baby } from "../../Baby";

const v = {
  run: {
    numHits: 0,
    rng: newRNG(),
  },
};

/** Spawns a pedestal item after N hits. */
export class SirenShooter extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const room = game.GetRoom();
    const num = this.getAttribute("requireNumHits");

    v.run.numHits++;
    if (v.run.numHits === num) {
      v.run.numHits = 0;
      const position = room.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      mod.spawnCollectible(CollectibleType.NULL, position, v.run.rng);
    }

    return undefined;
  }
}
