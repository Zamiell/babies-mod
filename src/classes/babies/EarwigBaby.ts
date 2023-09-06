import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  changeRoom,
  game,
  getAllRoomGridIndexes,
  getRandomArrayElement,
  hasCollectible,
  newRNG,
  onFirstFloor,
  onStage,
  setSeed,
  stopAllSoundEffects,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    explored: false,
    rng: newRNG(),
  },
};

/** N rooms are already explored. */
export class EarwigBaby extends Baby {
  v = v;

  /**
   * - If the player has mapping, this effect is largely useless (but having the Blue Map is okay).
   * - We don't want this baby on the first floor since it interferes with resetting.
   * - We don't want this baby on floors where mapping is useless.
   */
  override isValid(player: EntityPlayer): boolean {
    return (
      !hasCollectible(
        player,
        CollectibleType.COMPASS, // 21
        CollectibleType.TREASURE_MAP, // 54
        CollectibleType.MIND, // 333
      ) &&
      !onFirstFloor() &&
      !onStage(
        LevelStage.BLUE_WOMB, // 9
        LevelStage.HOME, // 13
      )
    );
  }

  override onAdd(): void {
    const level = game.GetLevel();
    const seed = level.GetDungeonPlacementSeed();
    setSeed(v.run.rng, seed);
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const level = game.GetLevel();
    const startingRoomGridIndex = level.GetStartingRoomIndex();
    const room = game.GetRoom();
    const centerPos = room.GetCenterPos();
    const allRoomGridIndexes = getAllRoomGridIndexes();
    const num = this.getAttribute("num");

    // We only want to explore once.
    if (v.run.explored) {
      return;
    }
    v.run.explored = true;

    // Get N unique random indexes.
    const randomFloorGridIndexes: int[] = [];
    do {
      // Get a random room index on the floor.
      const randomFloorGridIndex = getRandomArrayElement(
        allRoomGridIndexes,
        v.run.rng,
      );

      // Check to see if this is one of the indexes that we are already warping to.
      if (randomFloorGridIndexes.includes(randomFloorGridIndex)) {
        continue;
      }

      // We don't want the starting room to count.
      if (randomFloorGridIndex === startingRoomGridIndex) {
        continue;
      }

      randomFloorGridIndexes.push(randomFloorGridIndex);
    } while (randomFloorGridIndexes.length < num);

    // Explore these rooms
    for (const roomGridIndex of randomFloorGridIndexes) {
      changeRoom(roomGridIndex);

      // We might have traveled to the Boss Room, so stop the Portcullis sound effect just in case.
      // Other sound effects can also play, such as the unlock sound from traveling to an Ultra
      // Secret room.
      stopAllSoundEffects();
    }

    changeRoom(startingRoomGridIndex);
    player.Position = centerPos;
  }
}
