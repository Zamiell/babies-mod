import {
  EntityType,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getNPCs,
  inRoomType,
  ModCallbackCustom,
  spawn,
} from "isaacscript-common";
import { Baby } from "../Baby";

interface NPCDescription {
  entityType: EntityType;
  variant: int;
  subType: int;
}

const EXCEPTION_NPCS: ReadonlySet<EntityType> = new Set([
  EntityType.SHOPKEEPER, // 17
  EntityType.FIREPLACE, // 33
]);

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
    // Only fall in love with NPCs.
    const npc = entity.ToNPC();
    if (npc === undefined) {
      return;
    }

    if (v.run.loveNPC !== null) {
      return;
    }

    // Store the killed enemy.
    v.run.loveNPC = {
      entityType: npc.Type,
      variant: npc.Variant,
      subType: npc.SubType,
    };

    replaceAllNPCsWith(npc.Type, npc.Variant, npc.SubType, npc.Index);
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
    (npc) => !EXCEPTION_NPCS.has(npc.Type) && npc.Index !== exceptionIndex,
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
