import { LevelStage, SlotVariant } from "isaac-typescript-definitions";
import {
  VectorZero,
  getEffectiveStage,
  onStage,
  spawnSlot,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starting rooms are Super-Arcades. */
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
      getEffectiveStage() > 2 &&
      !onStage(
        LevelStage.BLUE_WOMB, // 9
        LevelStage.DARK_ROOM_CHEST, // 11
        LevelStage.HOME, // 13
      )
    );
  }

  override onAdd(player: EntityPlayer): void {
    // Top-left
    spawnSlotHelper(SlotVariant.SLOT_MACHINE, 16, player);
    spawnSlotHelper(SlotVariant.FORTUNE_TELLING_MACHINE, 18, player);
    spawnSlotHelper(SlotVariant.BLOOD_DONATION_MACHINE, 20, player);

    // Top-right
    spawnSlotHelper(SlotVariant.BEGGAR, 24, player);
    spawnSlotHelper(SlotVariant.SHELL_GAME, 27, player);

    // Middle-right
    spawnSlotHelper(SlotVariant.BOMB_BUM, 54, player);
    spawnSlotHelper(SlotVariant.KEY_MASTER, 56, player);
    spawnSlotHelper(SlotVariant.BATTERY_BUM, 84, player);
    spawnSlotHelper(SlotVariant.ROTTEN_BEGGAR, 86, player);

    // Bottom-left
    spawnSlotHelper(SlotVariant.SHOP_RESTOCK_MACHINE, 106, player);
    spawnSlotHelper(SlotVariant.CRANE_GAME, 108, player);
    spawnSlotHelper(SlotVariant.CONFESSIONAL, 110, player);

    // Bottom-right
    spawnSlotHelper(SlotVariant.DEVIL_BEGGAR, 114, player);
    spawnSlotHelper(SlotVariant.HELL_GAME, 117, player);
  }
}

/** Helper function to spawn a slot entity. */
function spawnSlotHelper(
  slotVariant: SlotVariant,
  gridIndex: int,
  player: EntityPlayer,
) {
  spawnSlot(slotVariant, 0, gridIndex, VectorZero, player);
}
