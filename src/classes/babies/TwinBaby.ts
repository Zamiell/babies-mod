import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  inStartingRoom,
  onRepentanceStage,
  onStage,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";
import { hasTouchedTrapdoor } from "../features/detectTrapdoorTouched/v";

const v = {
  run: {
    isTeleporting: false,
  },
};

/** Uncontrollable Teleport 2.0. */
export class TwinBaby extends Baby {
  v = v;

  /**
   * If they mess up and go past the Boss Room on Womb 2, they can get the wrong path. It also makes
   * the player unable to go to Corpse after Alt Mom's Heart.
   */
  override isValid(): boolean {
    return (
      !onStage(
        LevelStage.WOMB_2, // 8
        LevelStage.BLUE_WOMB, // 9
        LevelStage.HOME, // 13
      ) && !(onStage(LevelStage.DEPTHS_2) && onRepentanceStage())
    );
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();
    const player = Isaac.GetPlayer();

    // We don't want to teleport away from the first room.
    if (inStartingRoom() && isFirstVisit) {
      return;
    }

    // We don't want to teleport away if we are traveling to a new floor. (This is necessary to
    // prevent crashes with the Racing+ fast-travel feature.)
    if (hasTouchedTrapdoor()) {
      return;
    }

    if (v.run.isTeleporting) {
      v.run.isTeleporting = false;
    } else {
      // We are entering a new room.
      v.run.isTeleporting = true;
      useActiveItemTemp(player, CollectibleType.TELEPORT_2);
    }
  }
}
