import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  removeCollectibleFromItemTracker,
  repeat,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { BabyDescription } from "../../types/BabyDescription";
import { Baby } from "../Baby";

/** Starts with Flock of Succubi. */
export class CoolGhostBaby extends Baby {
  v = {
    run: {
      removeSuccubusCollectiblesOnNextRoom: false,
    },
  };

  constructor(babyType: RandomBabyType, baby: BabyDescription) {
    super(babyType, baby);
    this.saveDataManager(this.v);
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
      removeCollectibleFromItemTracker(CollectibleType.SUCCUBUS);
    });

    this.v.run.removeSuccubusCollectiblesOnNextRoom = true;

    return true;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!this.v.run.removeSuccubusCollectiblesOnNextRoom) {
      return;
    }
    this.v.run.removeSuccubusCollectiblesOnNextRoom = false;

    const player = Isaac.GetPlayer();
    const num = this.getAttribute("num");

    repeat(num, () => {
      player.RemoveCollectible(CollectibleType.SUCCUBUS);
    });
  }
}
