import type { EntityType } from "isaac-typescript-definitions";
import { ModCallback, RoomType } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  getNPCs,
  inRoomType,
  spawn,
} from "isaacscript-common";
import { shouldReplaceOrDuplicateNPC } from "../../utils";
import { Baby } from "../Baby";

interface NPCDescription {
  entityType: EntityType;
  variant: int;
  subType: int;
}

const v = {
  run: {
    loveNPC: null as NPCDescription | null,
  },
};

/** Falls in loves with the first enemy killed. */
export class LoveEyeBaby extends Baby {
  v = v;

  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (v.run.loveNPC !== null) {
      return;
    }

    // Only fall in love with NPCs.
    const npc = entity.ToNPC();
    if (npc === undefined) {
      return;
    }

    // Certain NPCs are exempt.
    if (!shouldReplaceOrDuplicateNPC(npc)) {
      return;
    }

    // Store the killed enemy.
    v.run.loveNPC = {
      entityType: npc.Type,
      variant: npc.Variant,
      subType: npc.SubType,
    };

    replaceAllNPCsWith(
      v.run.loveNPC.entityType,
      v.run.loveNPC.variant,
      v.run.loveNPC.subType,
      npc.Index,
    );
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (v.run.loveNPC === null) {
      return;
    }

    // Make an exception for certain room types.
    if (inRoomType(RoomType.BOSS, RoomType.DEVIL)) {
      return;
    }

    replaceAllNPCsWith(
      v.run.loveNPC.entityType,
      v.run.loveNPC.variant,
      v.run.loveNPC.subType,
      undefined,
    );
  }
}

function replaceAllNPCsWith(
  entityType: EntityType,
  variant: int,
  subType: int,
  exceptionIndex: int | undefined,
) {
  const npcs = getNPCs();
  const filteredNPCs = npcs.filter(
    (npc) => shouldReplaceOrDuplicateNPC(npc) && npc.Index !== exceptionIndex,
  );
  for (const npc of filteredNPCs) {
    npc.Remove();
    spawn(
      entityType,
      variant,
      subType,
      npc.Position,
      npc.Velocity,
      npc.SpawnerEntity,
      npc.InitSeed,
    );
  }
}
