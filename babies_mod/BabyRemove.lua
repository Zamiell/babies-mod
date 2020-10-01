local BabyRemove = {}

-- Includes
local g = require("babies_mod/globals")

function BabyRemove:Main()
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  -- If we are on an item baby, remove the item
  if baby.item ~= nil then
    -- If the item is in the vanilla Schoolbag, this will successfully remove it
    g.p:RemoveCollectible(baby.item)

    -- We have to handle the Racing+ Schoolbag explicitly
    if (
      RacingPlusGlobals ~= nil
      and g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM)
      and RacingPlusGlobals.run.schoolbag.item == baby.item
    ) then
      RacingPlusSchoolbag:Remove()
    end
  end
  if baby.item2 ~= nil then
    -- If the item is in the vanilla Schoolbag, this will successfully remove it
    g.p:RemoveCollectible(baby.item2)

    -- We have to handle the Racing+ Schoolbag explicitly
    if (
      RacingPlusGlobals ~= nil
      and g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM)
      and RacingPlusGlobals.run.schoolbag.item == baby.item2
    ) then
      RacingPlusSchoolbag:Remove()
    end
  end

  -- If we are on a multiple item baby, remove the extra items
  if baby.itemNum ~= nil then
    for i = 1, baby.itemNum - 1 do
      g.p:RemoveCollectible(baby.item)
    end
  end

  -- If we are on a trinket baby, remove the trinket
  local trinket = baby.trinket
  if trinket ~= nil then
    g.p:TryRemoveTrinket(trinket)
  end

  -- Remove the Dead Eye multiplier
  if baby.item == CollectibleType.COLLECTIBLE_DEAD_EYE then -- 373
    for i = 1, 100 do
      -- Each time this function is called, it only has a chance of working,
      -- so just call it 100 times to be safe
      g.p:ClearDeadEyeCharge()
    end
  end

  -- Remove easter eggs
  if baby.seed ~= nil then
    g.seeds:RemoveSeedEffect(baby.seed)
  end

  -- Remove miscellaneous effects
  local babyFunc = BabyRemove.functions[babyType]
  if babyFunc ~= nil then
    babyFunc()
  end
end

-- The collection of functions for each baby
BabyRemove.functions = {}

-- Hive Baby
BabyRemove.functions[40] = function()
  -- Remove all of the Blue Flies and Blue Spiders
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
    if (
      entity.Type == EntityType.ENTITY_FAMILIAR -- 3
      and (
        entity.Variant == FamiliarVariant.BLUE_FLY -- 43
        or entity.Variant == FamiliarVariant.BLUE_SPIDER -- 73
      )
    ) then
      entity:Remove()
    end
  end
end

-- Zombie Baby
BabyRemove.functions[61] = function()
  -- Remove all of the friendly enemies
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
    if entity:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then -- 1 << 29
      entity:Remove()
    end
  end
end

-- Goat Baby
BabyRemove.functions[62] = function()
  g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD) -- 215
  g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_DUALITY) -- 498
end

-- Attractive Baby
BabyRemove.functions[157] = function()
  -- Remove all of the friendly enemies
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
    if entity:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then -- 1 << 29
      entity:Remove()
    end
  end
end

-- Digital Baby
BabyRemove.functions[162] = function()
  -- B00B T00B
  g.seeds:RemoveSeedEffect(SeedEffect.SEED_OLD_TV) -- 8
end

-- Helmet Baby
BabyRemove.functions[163] = function()
  -- Make sure that the fade is removed
  -- (or else it will persist to the next character)
  local color = g.p:GetColor()
  local newColor = Color(color.R, color.G, color.B, 1, color.RO, color.GO, color.BO)
  g.p:SetColor(newColor, 0, 0, true, true)
end

-- Sick Baby
BabyRemove.functions[187] = function()
  -- Remove all of the explosive Blue Flies
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
    if (
      entity.Type == EntityType.ENTITY_FAMILIAR -- 3
      and entity.Variant == FamiliarVariant.BLUE_FLY -- 43
    ) then
      entity:Remove()
    end
  end
end

-- Isaac Baby
BabyRemove.functions[219] = function()
  -- Starts with The Battery
  -- We need to remove any additional charge that has accumulated
  if (
    g.p:GetActiveItem() ~= 0
    and g.p:GetBatteryCharge() > 0
  ) then
    g.p:DischargeActiveItem()
    g.p:FullCharge()
    g.sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
  end
  if (
    RacingPlusGlobals ~= nil
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM)
    and RacingPlusGlobals.run.schoolbag.item ~= 0
    and RacingPlusGlobals.run.schoolbag.chargeBattery ~= 0
  ) then
    RacingPlusGlobals.run.schoolbag.chargeBattery = 0
  end
end

-- Butterfly Baby 2
BabyRemove.functions[332] = function()
  g.p.GridCollisionClass = GridCollisionClass.COLLISION_WALL_EXCEPT_PLAYER -- 5
end

-- Cyborg Baby
BabyRemove.functions[343] = function()
  Isaac.ExecuteCommand("debug 7")
end

-- Yellow Princess Baby
BabyRemove.functions[375] = function()
  -- This is the third item given, so we have to handle it manually
  g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) -- 540
end

-- Dino Baby
BabyRemove.functions[376] = function()
  -- Remove any leftover eggs
  local brains = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR, -- 3
    FamiliarVariant.BOBS_BRAIN, -- 59
    -1,
    false,
    false
  )
  for _, brain in ipairs(brains) do
    brain:Remove()
  end
end

-- Dream Knight Baby
BabyRemove.functions[393] = function()
  g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_KEY_BUM) -- 388
end

-- Blurred Baby
BabyRemove.functions[407] = function()
  -- This is the third item given, so we have to handle it manually
  g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) -- 540
end

-- Half Spider Baby
BabyRemove.functions[515] = function()
  -- Only one Pretty Fly is removed after removing a Halo of Flies
  -- Thus, after removing 2x Halo of Flies, one fly remains
  g.p:RemoveCollectible(CollectibleType.COLLECTIBLE_HALO_OF_FLIES) -- 10
end

-- Spider Baby
BabyRemove.functions[521] = function()
  -- Remove all of the Blue Spiders
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
    if (
      entity.Type == EntityType.ENTITY_FAMILIAR -- 3
      and entity.Variant == FamiliarVariant.BLUE_SPIDER -- 73
    ) then
      entity:Remove()
    end
  end
end

-- Rotten Baby
BabyRemove.functions[533] = function()
  -- Remove all of the Blue Flies
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
    if (
      entity.Type == EntityType.ENTITY_FAMILIAR -- 3
      and entity.Variant == FamiliarVariant.BLUE_FLY -- 43
    ) then
      entity:Remove()
    end
  end
end

return BabyRemove
