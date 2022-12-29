import {
  ActiveSlot,
  CollectibleType,
  EntityGridCollisionClass,
  EntityType,
  FamiliarVariant,
  LevelCurse,
  SeedEffect,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  copyColor,
  removeAllMatchingEntities,
  repeat,
  sfxManager,
} from "isaacscript-common";
import { RandomBabyType } from "./enums/RandomBabyType";
import { g } from "./globals";
import { removeAllFriendlyEntities } from "./utils";
import { getCurrentBabyDescription } from "./utilsBaby";

export const babyRemoveFunctionMap = new Map<
  RandomBabyType,
  (oldBabyCounters: int) => void
>();

// 31
babyRemoveFunctionMap.set(RandomBabyType.RAGE, (oldBabyCounters: int) => {
  // Restore the bomb count to what it was before we got this baby.
  g.p.AddBombs(-99);
  g.p.AddBombs(oldBabyCounters);
});

// 40
babyRemoveFunctionMap.set(RandomBabyType.HIVE, () => {
  removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_SPIDER);
  removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_SPIDER);
});

// 61
babyRemoveFunctionMap.set(RandomBabyType.ZOMBIE, () => {
  removeAllFriendlyEntities();
});

// 62
babyRemoveFunctionMap.set(RandomBabyType.GOAT, () => {
  g.p.RemoveCollectible(CollectibleType.GOAT_HEAD); // 215
  g.p.RemoveCollectible(CollectibleType.DUALITY); // 498
});

// 107
babyRemoveFunctionMap.set(RandomBabyType.BROWNIE, () => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error('Brownie Baby does not have a "num" property defined.');
  }

  for (const collectibleType of [
    CollectibleType.CUBE_OF_MEAT,
    CollectibleType.BALL_OF_BANDAGES,
  ]) {
    repeat(baby.num, () => {
      g.p.RemoveCollectible(collectibleType);
    });
  }
});

// 157
babyRemoveFunctionMap.set(RandomBabyType.ATTRACTIVE, () => {
  removeAllFriendlyEntities();
});

// 162
babyRemoveFunctionMap.set(RandomBabyType.DIGITAL, () => {
  g.seeds.RemoveSeedEffect(SeedEffect.OLD_TV); // B00B T00B
});

// 163
babyRemoveFunctionMap.set(RandomBabyType.HELMET, () => {
  // Make sure that the fade is removed (or else it will persist to the next character).
  const color = g.p.GetColor();
  const newColor = copyColor(color);
  newColor.A = 1;
  g.p.SetColor(newColor, 0, 0, true, true);
});

// 187
babyRemoveFunctionMap.set(RandomBabyType.SICK, () => {
  removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_FLY);
});

// 219
babyRemoveFunctionMap.set(RandomBabyType.ISAAC, () => {
  // Starts with The Battery. We need to remove any additional charge that has accumulated.
  for (const slot of [ActiveSlot.PRIMARY, ActiveSlot.SECONDARY]) {
    if (
      g.p.GetActiveItem(slot) !== CollectibleType.NULL &&
      g.p.GetBatteryCharge(slot) > 0
    ) {
      g.p.DischargeActiveItem();
      g.p.FullCharge();
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
    }
  }
});

// 332
babyRemoveFunctionMap.set(RandomBabyType.BUTTERFLY_2, () => {
  g.p.GridCollisionClass = EntityGridCollisionClass.GROUND;
});

// 343
babyRemoveFunctionMap.set(RandomBabyType.CYBORG, () => {
  Isaac.ExecuteCommand("debug 7");
});

// 376
babyRemoveFunctionMap.set(RandomBabyType.DINO, () => {
  // Remove any leftover eggs.
  removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BOBS_BRAIN);
});

// 515
babyRemoveFunctionMap.set(RandomBabyType.HALF_SPIDER, () => {
  // Only one Pretty Fly is removed after removing a Halo of Flies. Thus, after removing 2x Halo of
  // Flies, one fly remains.
  g.p.RemoveCollectible(CollectibleType.HALO_OF_FLIES);
});

// 550
babyRemoveFunctionMap.set(RandomBabyType.BULLET, (oldBabyCounters: int) => {
  // Restore the bomb count to what it was before we got this baby.
  g.p.AddBombs(-99);
  g.p.AddBombs(oldBabyCounters);
});

// 556
babyRemoveFunctionMap.set(RandomBabyType.CURSED_ROOM, () => {
  g.l.RemoveCurses(LevelCurse.CURSED);
});

// 587
babyRemoveFunctionMap.set(RandomBabyType.ROTTEN, () => {
  // Remove all of the Blue Flies.
  removeAllMatchingEntities(EntityType.FAMILIAR, FamiliarVariant.BLUE_FLY);
});
