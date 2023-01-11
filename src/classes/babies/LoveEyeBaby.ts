import {
  EntityType,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getNPCs,
  ModCallbackCustom,
  spawn,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Falls in loves with the first enemy killed. */
export class LoveEyeBaby extends Baby {
  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (g.run.babyBool) {
      return;
    }
    g.run.babyBool = true;

    // Store the killed enemy.
    g.run.babyNPC = {
      entityType: entity.Type,
      variant: entity.Variant,
      subType: entity.SubType,
    };

    // Respawn all of the existing enemies in the room.
    for (const npc of getNPCs()) {
      // Don't respawn the entity that just died.
      if (npc.Index !== entity.Index) {
        spawn(
          npc.Type,
          npc.Variant,
          npc.SubType,
          npc.Position,
          npc.Velocity,
          undefined,
          npc.InitSeed,
        );
        npc.Remove();
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    // Make an exception for Boss Rooms and Devil Rooms.
    const roomType = g.r.GetType();
    if (
      !g.run.babyBool ||
      roomType === RoomType.BOSS ||
      roomType === RoomType.DEVIL
    ) {
      return;
    }

    // Replace all of the existing enemies with the stored one.
    const npcs = getNPCs();
    const filteredNPCs = npcs.filter(
      (npc) =>
        npc.Type !== EntityType.SHOPKEEPER && // 17
        npc.Type !== EntityType.FIREPLACE, // 33
    );
    for (const npc of filteredNPCs) {
      npc.Remove();
      spawn(
        g.run.babyNPC.entityType,
        g.run.babyNPC.variant,
        g.run.babyNPC.subType,
        npc.Position,
        npc.Velocity,
        undefined,
        npc.InitSeed,
      );
    }
  }
}
