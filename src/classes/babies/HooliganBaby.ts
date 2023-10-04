import {
  CallbackCustom,
  DISTANCE_OF_GRID_TILE,
  ModCallbackCustom,
  game,
  spawn,
} from "isaacscript-common";
import { shouldReplaceOrDuplicateNPC } from "../../utils";
import { Baby } from "../Baby";

const v = {
  room: {
    duplicatedNPCs: new Set<PtrHash>(),
  },
};

/** Double enemies. */
export class HooliganBaby extends Baby {
  v = v;

  /**
   * We duplicate enemies in the `POST_NPC_INIT_LATE` callback instead of the `POST_NPC_INIT`
   * callback so that we have time to add their hashes to the set.
   */
  // 27
  @CallbackCustom(ModCallbackCustom.POST_NPC_INIT_LATE)
  postNPCInitLate(npc: EntityNPC): void {
    if (this.shouldDuplicateNPC(npc)) {
      this.duplicateNPC(npc);
    }
  }

  shouldDuplicateNPC(npc: EntityNPC): boolean {
    const ptrHash = GetPtrHash(npc);

    return (
      !v.room.duplicatedNPCs.has(ptrHash) && shouldReplaceOrDuplicateNPC(npc)
    );
  }

  duplicateNPC(npc: EntityNPC): void {
    const room = game.GetRoom();
    const player = Isaac.GetPlayer();

    const position = room.FindFreePickupSpawnPosition(npc.Position, 1, true);
    if (position.Distance(player.Position) >= DISTANCE_OF_GRID_TILE) {
      const newNPC = spawn(
        npc.Type,
        npc.Variant,
        npc.SubType,
        position,
        npc.Velocity,
        npc,
        npc.InitSeed,
      );
      const ptrHash = GetPtrHash(newNPC);
      v.room.duplicatedNPCs.add(ptrHash);
    }
  }

  /** Fix the bug where an enemy can sometimes spawn next to where the player spawns. */
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    const room = game.GetRoom();
    const roomFrameCount = room.GetFrameCount();

    if (roomFrameCount === 0) {
      return false;
    }

    return undefined;
  }
}
