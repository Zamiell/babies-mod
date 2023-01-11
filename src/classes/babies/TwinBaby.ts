import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getEffectiveStage,
  inStartingRoom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Uncontrollable Teleport 2.0. */
export class TwinBaby extends Baby {
  /** If they mess up and go past the Boss Room on Womb 2, they can get the wrong path. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== LevelStage.WOMB_2;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const isFirstVisit = g.r.IsFirstVisit();

    // We don't want to teleport away from the first room.
    if (inStartingRoom() && isFirstVisit) {
      return;
    }

    if (g.run.babyBool) {
      // We teleported to this room.
      g.run.babyBool = false;
    } else {
      // We are entering a new room.
      g.run.babyBool = true;
      useActiveItemTemp(g.p, CollectibleType.TELEPORT_2);
    }
  }
}
