import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  rebirthItemTrackerRemoveCollectible,
  repeat,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { Baby } from "../Baby";

const v = {
  run: {
    removeSuccubusCollectiblesOnNextRoom: false,
  },
};

/** Starts with Flock of Succubi. */
export class CoolGhostBaby extends Baby {
  v = v;

  override onRemove(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    repeat(num, () => {
      player.RemoveCollectible(CollectibleType.SUCCUBUS);
    });
  }

  // 23
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleTypeCustom.FLOCK_OF_SUCCUBI)
  preUseItemFlockOfSuccubi(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    const num = this.getAttribute("num");

    repeat(num, () => {
      player.AddCollectible(CollectibleType.SUCCUBUS, 0, false);
      rebirthItemTrackerRemoveCollectible(CollectibleType.SUCCUBUS);
    });

    v.run.removeSuccubusCollectiblesOnNextRoom = true;

    return true;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!v.run.removeSuccubusCollectiblesOnNextRoom) {
      return;
    }
    v.run.removeSuccubusCollectiblesOnNextRoom = false;

    const player = Isaac.GetPlayer();
    const num = this.getAttribute("num");

    repeat(num, () => {
      player.RemoveCollectible(CollectibleType.SUCCUBUS);
    });
  }
}
