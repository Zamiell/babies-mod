local PreUseItem = {}

-- Includes
local g = require("babies_mod/globals")

-- CollectibleType.COLLECTIBLE_POOP (36)
function PreUseItem:Item36(collectibleType, RNG)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if (
    baby == nil
    or baby.name ~= "Panda Baby" -- 262
  ) then
    return
  end

  -- Spawn White Poop next to the player
  Isaac.GridSpawn(GridEntityType.GRID_POOP, g.PoopVariant.POOP_WHITE, g.p.Position, false) -- 14

  -- Playing ID 37 will randomly play one of the three farting sound effects
  g.sfx:Play(SoundEffect.SOUND_FART, 1, 0, false, 1) -- 37

  return true -- Cancel the original effect
end

-- CollectibleType.COLLECTIBLE_LEMON_MISHAP (56)
function PreUseItem:Item56(collectibleType, RNG)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if (
    baby == nil
    or baby.name ~= "Lemon Baby" -- 232
  ) then
    return
  end

  g.p:UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, PillColor.PILL_NULL) -- 26, 0
  g.p:AnimateCollectible(CollectibleType.COLLECTIBLE_LEMON_MISHAP, "UseItem", "PlayerPickup") -- 56
  return true -- Cancel the original effect
end

-- CollectibleType.COLLECTIBLE_ISAACS_TEARS (323)
function PreUseItem:Item323(collectibleType, RNG)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if (
    baby == nil
    or baby.name ~= "Water Baby" -- 3
  ) then
    return
  end

  local vel = Vector(10, 0)
  for i = 1, 8 do
    vel = vel:Rotated(45)
    local tear = g.p:FireTear(g.p.Position, vel, false, false, false)

    -- Increase the damage and make it look more impressive
    tear.CollisionDamage = g.p.Damage * 2
    tear.Scale = 2
    tear.KnockbackMultiplier = 20
  end

  -- When we return from the function below, no animation will play,
  -- so we have to explitily perform one
  g.p:AnimateCollectible(CollectibleType.COLLECTIBLE_ISAACS_TEARS, "UseItem", "PlayerPickup") -- 323

  -- Cancel the original effect
  return true
end

-- CollectibleType.COLLECTIBLE_SMELTER (479)
-- This callback is used naturally by Gulp! pills
function PreUseItem:Item479(collectibleType, RNG)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil or baby.trinket == nil then
    return
  end

  -- We want to keep track if the player smelts the trinket so that we don't give another copy back
  -- to them
  local trinket1 = g.p:GetTrinket(0) -- This will be 0 if there is no trinket
  local trinket2 = g.p:GetTrinket(1) -- This will be 0 if there is no trinket
  if trinket1 == baby.trinket or trinket2 == baby.trinket then
    g.run.trinketGone = true
  end

  -- By returning nothing, it will go on to do the Smelter effect
end

-- CollectibleType.COLLECTIBLE_BROWN_NUGGET (504)
function PreUseItem:Item504(collectibleType, RNG)
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if (
    baby == nil
    or baby.name ~= "Pizza Baby" -- 303
  ) then
    return
  end

  -- Mark to spawn more of them on subsequent frames
  if g.run.babyCounters == 0 then
    g.run.babyCounters = 1
    g.run.babyFrame = gameFrameCount + baby.delay
  end
end

return PreUseItem
