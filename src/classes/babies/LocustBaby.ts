import {
  CollectibleType,
  EntityType,
  FamiliarVariant,
} from "isaac-typescript-definitions";
import { removeAllMatchingEntities, spawnFamiliar } from "isaacscript-common";
import { Baby } from "../Baby";

const SPECIAL_ABYSS_LOCUSTS = [
  CollectibleType.SPOON_BENDER, // 3
  CollectibleType.CRICKETS_HEAD, // 4
  CollectibleType.NUMBER_ONE, // 6
  CollectibleType.BLOOD_OF_THE_MARTYR, // 7
  CollectibleType.HALO_OF_FLIES, // 10
  CollectibleType.IPECAC, // 149
  CollectibleType.FIRE_MIND, // 257
  CollectibleType.SCORPIO, // 305
  CollectibleType.HOLY_LIGHT, // 374
  CollectibleType.JACOBS_LADDER, // 494
] as const;

/** Starts with 10 special Abyss locusts + blindfolded. */
export class LocustBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    for (const SPECIAL_ABYSS_LOCUST of SPECIAL_ABYSS_LOCUSTS) {
      spawnFamiliar(
        FamiliarVariant.ABYSS_LOCUST,
        SPECIAL_ABYSS_LOCUST,
        player.Position,
      );
    }
  }

  override onRemove(): void {
    removeAllMatchingEntities(
      EntityType.FAMILIAR,
      FamiliarVariant.ABYSS_LOCUST,
    );
  }
}
