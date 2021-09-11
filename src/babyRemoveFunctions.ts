import g from "./globals";

const functionMap = new Map<int, () => void>();
export default functionMap;

// Spider Baby
functionMap.set(0, () => {
  // Remove all of the Blue Spiders
  for (const entity of Isaac.GetRoomEntities()) {
    if (
      entity.Type === EntityType.ENTITY_FAMILIAR &&
      entity.Variant === FamiliarVariant.BLUE_SPIDER
    ) {
      entity.Remove();
    }
  }
});

// Hive Baby
functionMap.set(40, () => {
  // Remove all of the Blue Flies and Blue Spiders
  for (const entity of Isaac.GetRoomEntities()) {
    if (
      entity.Type === EntityType.ENTITY_FAMILIAR &&
      (entity.Variant === FamiliarVariant.BLUE_FLY ||
        entity.Variant === FamiliarVariant.BLUE_SPIDER)
    ) {
      entity.Remove();
    }
  }
});

// Zombie Baby
functionMap.set(61, () => {
  // Remove all of the friendly enemies
  for (const entity of Isaac.GetRoomEntities()) {
    if (entity.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
      entity.Remove();
    }
  }
});

// Goat Baby
functionMap.set(62, () => {
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD); // 215
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_DUALITY); // 498
});

// Attractive Baby
functionMap.set(157, () => {
  // Remove all of the friendly enemies
  for (const entity of Isaac.GetRoomEntities()) {
    if (entity.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
      entity.Remove();
    }
  }
});

// Digital Baby
functionMap.set(162, () => {
  g.seeds.RemoveSeedEffect(SeedEffect.SEED_OLD_TV); // B00B T00B
});

// Helmet Baby
functionMap.set(163, () => {
  // Make sure that the fade is removed
  // (or else it will persist to the next character)
  const color = g.p.GetColor();
  const newColor = Color(
    color.R,
    color.G,
    color.B,
    1,
    color.RO,
    color.GO,
    color.BO,
  );
  g.p.SetColor(newColor, 0, 0, true, true);
});

// Sick Baby
functionMap.set(187, () => {
  // Remove all of the explosive Blue Flies
  for (const entity of Isaac.GetRoomEntities()) {
    if (
      entity.Type === EntityType.ENTITY_FAMILIAR &&
      entity.Variant === FamiliarVariant.BLUE_FLY
    ) {
      entity.Remove();
    }
  }
});

// Isaac Baby
functionMap.set(219, () => {
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
functionMap.set(332, () => {
  g.p.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_GROUND;
});

// Cyborg Baby
functionMap.set(343, () => {
  Isaac.ExecuteCommand("debug 7");
});

// Yellow Princess Baby
functionMap.set(375, () => {
  // This is the third item given, so we have to handle it manually
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE);
});

// Dino Baby
functionMap.set(376, () => {
  // Remove any leftover eggs
  const brains = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BOBS_BRAIN,
  );
  for (const brain of brains) {
    brain.Remove();
  }
});

// Dream Knight Baby
functionMap.set(393, () => {
  // This is the third item given, so we have to handle it manually
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_KEY_BUM);
});

// Blurred Baby
functionMap.set(407, () => {
  // This is the third item given, so we have to handle it manually
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE);
});

// Half Spider Baby
functionMap.set(515, () => {
  // Only one Pretty Fly is removed after removing a Halo of Flies
  // Thus, after removing 2x Halo of Flies, one fly remains
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_HALO_OF_FLIES);
});

// Rotten Baby
functionMap.set(533, () => {
  // Remove all of the Blue Flies
  for (const entity of Isaac.GetRoomEntities()) {
    if (
      entity.Type === EntityType.ENTITY_FAMILIAR &&
      entity.Variant === FamiliarVariant.BLUE_FLY
    ) {
      entity.Remove();
    }
  }
});
