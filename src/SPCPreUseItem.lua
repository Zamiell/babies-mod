local SPCPreUseItem = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

--
-- MC_PRE_USE_ITEM (23)
--

-- CollectibleType.COLLECTIBLE_POOP (36)
function SPCPreUseItem:Item36(collectibleType, RNG)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil or
     baby.name ~= "Panda Baby" then -- 262

    return
  end

  -- Spawn White Poop next to the player
  Isaac.GridSpawn(GridEntityType.GRID_POOP, PoopVariant.POOP_WHITE, player.Position, false) -- 14

  -- Playing ID 37 will randomly play one of the three farting sound effects
  sfx:Play(SoundEffect.SOUND_FART, 1, 0, false, 1) -- 37

  return true -- Cancel the original effect
end

-- CollectibleType.COLLECTIBLE_LEMON_MISHAP (56)
function SPCPreUseItem:Item56(collectibleType, RNG)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil or
     baby.name ~= "Lemon Baby" then -- 232

    return
  end

  player:UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, PillColor.PILL_NULL) -- 26, 0
  player:AnimateCollectible(CollectibleType.COLLECTIBLE_LEMON_MISHAP, "UseItem", "PlayerPickup") -- 56
  return true -- Cancel the original effect
end

-- CollectibleType.COLLECTIBLE_ISAACS_TEARS (323)
function SPCPreUseItem:Item323(collectibleType, RNG)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil or
     baby.name ~= "Water Baby" then -- 3

    return
  end

  SPCGlobals.run.babyCounters = 8
end

-- CollectibleType.COLLECTIBLE_SMELTER (479)
-- This callback is used naturally by Gulp! pills
function SPCPreUseItem:Item479(collectibleType, RNG)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil or
     baby.trinket == nil then

    return
  end

  -- We want to keep track if the player smelts the trinket so that we don't give another copy back to them
  local trinket1 = player:GetTrinket(0) -- This will be 0 if there is no trinket
  local trinket2 = player:GetTrinket(1) -- This will be 0 if there is no trinket
  if trinket1 == baby.trinket or
     trinket2 == baby.trinket then

    SPCGlobals.run.trinketGone = true
  end

  -- By returning nothing, it will go on to do the Smelter effect
end

-- CollectibleType.COLLECTIBLE_BROWN_NUGGET (504)
function SPCPreUseItem:Item504(collectibleType, RNG)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil or
     baby.name ~= "Pizza Baby" then -- 303

    return
  end

  -- Mark to spawn more of them on subsequent frames
  if SPCGlobals.run.babyCounters == 0 then
    SPCGlobals.run.babyCounters = 1
    SPCGlobals.run.babyFrame = gameFrameCount + baby.delay
  end
end

return SPCPreUseItem
