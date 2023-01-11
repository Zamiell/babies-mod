import {
  EntityFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, copyColor, spawnWithSeed } from "isaacscript-common";
import { removeAllFriendlyEntities } from "../../utils";
import { Baby } from "../Baby";

/** Brings back enemies from the dead. */
export class ZombieBaby extends Baby {
  override onRemove(): void {
    removeAllFriendlyEntities();
  }

  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (
      !entity.IsBoss() &&
      entity.Type !== EntityType.MOVABLE_TNT &&
      !entity.HasEntityFlags(EntityFlag.FRIENDLY)
    ) {
      const friend = spawnWithSeed(
        entity.Type,
        entity.Variant,
        entity.SubType,
        entity.Position,
        entity.InitSeed,
      );
      friend.AddEntityFlags(EntityFlag.CHARM); // 1 << 8
      friend.AddEntityFlags(EntityFlag.FRIENDLY); // 1 << 29
      friend.AddEntityFlags(EntityFlag.PERSISTENT); // 1 << 37

      // Fade the entity so that it is easier to see everything. (This is also reapplied on every
      // frame because enemies can be unfaded occasionally.)
      const fadeAmount = 0.25;
      const color = friend.GetColor();
      const newColor = copyColor(color);
      newColor.A = fadeAmount;
      friend.SetColor(newColor, 0, 0, true, true);
    }
  }
}
