import {
  EntityFlag,
  EntityType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  addFlag,
  game,
  getEntities,
  removeEntities,
  sfxManager,
  spawn,
} from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

const MOMS_HAND_FLAGS = addFlag(
  EntityFlag.CHARM, // 1 << 8
  EntityFlag.FRIENDLY, // 1 << 29
);

/** Spawns a friendly Mom's Hand in every room. */
export class SquirrelBaby extends Baby {
  // 0, 213
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.MOMS_HAND)
  postNPCUpdate(npc: EntityNPC): void {
    if (npc.SpawnerEntity === undefined) {
      return;
    }

    const player = Isaac.GetPlayer();
    if (GetPtrHash(npc.SpawnerEntity) !== GetPtrHash(player)) {
      return;
    }

    // We have to re-add the flags on every frame because it will lose the flags when it goes to the
    // ceiling.
    npc.AddEntityFlags(MOMS_HAND_FLAGS);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    const isClear = room.IsClear();
    if (isClear) {
      return;
    }

    const player = Isaac.GetPlayer();
    const momsHand = spawn(
      EntityType.MOMS_HAND,
      0,
      0,
      player.Position,
      VectorZero,
      player,
    );

    // We apply the flags now to prevent Racing+ from playing the custom "Appear" animation.
    momsHand.AddEntityFlags(MOMS_HAND_FLAGS);

    // The laugh playing in every room is obnoxious.
    mod.runNextRenderFrame(() => {
      sfxManager.Stop(SoundEffect.MOM_VOX_EVIL_LAUGH);
    });
  }

  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): void {
    const momsHands = getEntities(EntityType.MOMS_HAND);
    const player = Isaac.GetPlayer();
    const ourHands = momsHands.filter(
      (entity) =>
        entity.SpawnerEntity !== undefined &&
        GetPtrHash(entity.SpawnerEntity) === GetPtrHash(player),
    );
    removeEntities(ourHands);
  }
}
