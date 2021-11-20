import { copyColor, removeAllMatchingEntities } from "isaacscript-common";
import g from "./globals";
import { removeAllFriendlyEntities } from "./util";

export const babyRemoveFunctionMap = new Map<int, () => void>();

// Spider Baby
babyRemoveFunctionMap.set(0, () => {
  removeAllMatchingEntities(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BLUE_SPIDER,
  );
});

// Hive Baby
babyRemoveFunctionMap.set(40, () => {
  removeAllMatchingEntities(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BLUE_SPIDER,
  );
  removeAllMatchingEntities(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BLUE_SPIDER,
  );
});

// Zombie Baby
babyRemoveFunctionMap.set(61, () => {
  removeAllFriendlyEntities();
});

// Goat Baby
babyRemoveFunctionMap.set(62, () => {
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD); // 215
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_DUALITY); // 498
});

// Attractive Baby
babyRemoveFunctionMap.set(157, () => {
  removeAllFriendlyEntities();
});

// Digital Baby
babyRemoveFunctionMap.set(162, () => {
  g.seeds.RemoveSeedEffect(SeedEffect.SEED_OLD_TV); // B00B T00B
});

// Helmet Baby
babyRemoveFunctionMap.set(163, () => {
  // Make sure that the fade is removed
  // (or else it will persist to the next character)
  const color = g.p.GetColor();
  const newColor = copyColor(color);
  newColor.A = 1;
  g.p.SetColor(newColor, 0, 0, true, true);
});

// Sick Baby
babyRemoveFunctionMap.set(187, () => {
  removeAllMatchingEntities(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BLUE_FLY,
  );
});

// Isaac Baby
babyRemoveFunctionMap.set(219, () => {
  // Starts with The Battery
  // We need to remove any additional charge that has accumulated
  for (const slot of [ActiveSlot.SLOT_PRIMARY, ActiveSlot.SLOT_SECONDARY]) {
    if (g.p.GetActiveItem(slot) !== 0 && g.p.GetBatteryCharge(slot) > 0) {
      g.p.DischargeActiveItem();
      g.p.FullCharge();
      g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE);
    }
  }
});

// Butterfly Baby 2
babyRemoveFunctionMap.set(332, () => {
  g.p.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_GROUND;
});

// Cyborg Baby
babyRemoveFunctionMap.set(343, () => {
  Isaac.ExecuteCommand("debug 7");
});

// Yellow Princess Baby
babyRemoveFunctionMap.set(375, () => {
  // This is the third item given, so we have to handle it manually
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE);
});

// Dino Baby
babyRemoveFunctionMap.set(376, () => {
  // Remove any leftover eggs
  removeAllMatchingEntities(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BOBS_BRAIN,
  );
});

// Dream Knight Baby
babyRemoveFunctionMap.set(393, () => {
  // This is the third item given, so we have to handle it manually
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_KEY_BUM);
});

// Blurred Baby
babyRemoveFunctionMap.set(407, () => {
  // This is the third item given, so we have to handle it manually
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE);
});

// Half Spider Baby
babyRemoveFunctionMap.set(515, () => {
  // Only one Pretty Fly is removed after removing a Halo of Flies
  // Thus, after removing 2x Halo of Flies, one fly remains
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_HALO_OF_FLIES);
});

// Rotten Baby
babyRemoveFunctionMap.set(533, () => {
  // Remove all of the Blue Flies
  removeAllMatchingEntities(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BLUE_FLY,
  );
});
