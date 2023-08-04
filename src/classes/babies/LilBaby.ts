import { LevelStage, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  inStartingRoom,
  onStage,
} from "isaacscript-common";
import { Baby } from "../Baby";

const HALF_SIZE_VECTOR = Vector(0.5, 0.5);

/** Everything is tiny. */
export class LilBaby extends Baby {
  // 0
  @Callback(ModCallback.POST_NPC_UPDATE)
  postNPCUpdate(npc: EntityNPC): void {
    npc.Scale = 0.5;
  }

  /**
   * We do not use the `POST_FAMILIAR_INIT` callback because for some reason, familiars reset their
   * `SpriteScale` on every frame, so we have to constantly set it back.
   */
  // 6
  @Callback(ModCallback.POST_FAMILIAR_UPDATE)
  postFamiliarUpdate(familiar: EntityFamiliar): void {
    familiar.SpriteScale = HALF_SIZE_VECTOR;
  }

  // 34
  @Callback(ModCallback.POST_PICKUP_INIT)
  postPickupInit(pickup: EntityPickup): void {
    // Make an exception for the 4 Golden Chests, as those will be made giant before the babies
    // effect is removed.
    if (onStage(LevelStage.DARK_ROOM_CHEST) && inStartingRoom()) {
      return;
    }

    pickup.SpriteScale = HALF_SIZE_VECTOR;
  }

  // 39
  @Callback(ModCallback.POST_TEAR_INIT)
  postTearInit(tear: EntityTear): void {
    tear.SpriteScale = HALF_SIZE_VECTOR;
  }

  // 57
  @Callback(ModCallback.POST_BOMB_INIT)
  postBombInit(bomb: EntityBomb): void {
    bomb.SpriteScale = HALF_SIZE_VECTOR;
  }

  /** This does not work if we put it in the `POST_NEW_LEVEL` callback for some reason. */
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (player.SpriteScale.X > 0.5 || player.SpriteScale.Y > 0.5) {
      player.SpriteScale = HALF_SIZE_VECTOR;
    }
  }
}
