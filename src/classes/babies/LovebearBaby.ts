import { EntityType, SlotVariant } from "isaac-typescript-definitions";
import {
  doesEntityExist,
  getEffectiveStage,
  spawnSlot,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts in a super Arcade. */
export class LovebearBaby extends Baby {
  /**
   * - The player won't have any resources to spend on slot machines on the first floor or second
   *   floor.
   * - We want to ensure that the starting room of the floor is clean (e.g. no Blue Womb, no The
   *   Chest, etc.)
   */
  override isValid(): boolean {
    return (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      getEffectiveStage() > 2 && !doesEntityExist(EntityType.PICKUP)
    );
  }

  override onAdd(): void {
    // Top-left
    spawnSlot(SlotVariant.SLOT_MACHINE, 0, 16);
    spawnSlot(SlotVariant.FORTUNE_TELLING_MACHINE, 0, 18);
    spawnSlot(SlotVariant.BLOOD_DONATION_MACHINE, 0, 20);

    // Top-right
    spawnSlot(SlotVariant.BEGGAR, 0, 24);
    spawnSlot(SlotVariant.SHELL_GAME, 0, 27);

    // Middle-right
    spawnSlot(SlotVariant.BOMB_BUM, 0, 54);
    spawnSlot(SlotVariant.KEY_MASTER, 0, 56);
    spawnSlot(SlotVariant.BATTERY_BUM, 0, 84);
    spawnSlot(SlotVariant.ROTTEN_BEGGAR, 0, 86);

    // Bottom-left
    spawnSlot(SlotVariant.SHOP_RESTOCK_MACHINE, 0, 106);
    spawnSlot(SlotVariant.CRANE_GAME, 0, 108);
    spawnSlot(SlotVariant.CONFESSIONAL, 0, 110);

    // Bottom-right
    spawnSlot(SlotVariant.DEVIL_BEGGAR, 0, 114);
    spawnSlot(SlotVariant.HELL_GAME, 0, 117);
  }
}
