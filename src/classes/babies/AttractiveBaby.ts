import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, ReadonlySet } from "isaacscript-common";
import { removeAllFriendlyEntities } from "../../utils";
import { Baby } from "../Baby";

/** Some NPCs can cause softlocks if they are permanently charmed. */
const WALL_HUGGING_ENTITY_TYPES_SET = new ReadonlySet([
  EntityType.WALL_CREEP, // 240 (this includes Soy Creep & Rag Creep & Tainted Soy Creep)
  EntityType.RAGE_CREEP, // 241
  EntityType.BLIND_CREEP, // 242
  EntityType.THING, // 304
]);

/** All enemies are permanently charmed. */
export class AttractiveBaby extends Baby {
  override onRemove(): void {
    removeAllFriendlyEntities();
  }

  @Callback(ModCallback.POST_NPC_UPDATE)
  postNPCUpdate(npc: EntityNPC): void {
    if (WALL_HUGGING_ENTITY_TYPES_SET.has(npc.Type)) {
      return;
    }

    if (!npc.IsDead() && npc.IsVulnerableEnemy()) {
      npc.AddCharmed(EntityRef(undefined), 10);
    }
  }
}
