import {
  CollectibleType,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getRandom,
  inRoomType,
  newRNG,
} from "isaacscript-common";
import { mod } from "../../mod";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** 50% chance to spawn a random pedestal item on room clear. */
export class BandaidBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();

    if (inRoomType(RoomType.BOSS)) {
      return undefined;
    }

    const chance = getRandom(v.run.rng);
    if (chance < 0.5) {
      const position = room.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      mod.spawnCollectible(CollectibleType.NULL, position, roomSeed);
    }

    return undefined;
  }
}
