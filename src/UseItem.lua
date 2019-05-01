local UseItem = {}

-- Includes
local g = require("src/globals")

-- ModCallbacks.MC_USE_ITEM (3)
function UseItem:Main(collectibleType, RNG)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  -- Certain items like The Nail mess up the player sprite (if they are standing still)
  -- If we reload the sprite in this callback, it won't work, so mark to update it in the MC_POST_UPDATE callback
  g.run.reloadSprite = true
end

-- CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP (49)
function UseItem:Item49(collectibleType, RNG)
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local activeCharge = g.p:GetActiveCharge()
  local batteryCharge = g.p:GetBatteryCharge()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Scream Baby" then -- 81
    g.run.babyFrame = gameFrameCount
    g.run.babyCounters = activeCharge
    g.run.babyNPC.type = batteryCharge
  end
end

-- CollectibleType.COLLECTIBLE_MONSTROS_TOOTH (86)
function UseItem:Item86(collectibleType, RNG)
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Drool Baby" then -- 221
    -- Summon extra Monstro's, spaced apart
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == baby.num then
      g.run.babyCounters = 0
      g.run.babyFrame = 0
    else
      g.run.babyFrame = gameFrameCount + 15
    end
  end
end

-- CollectibleType.COLLECTIBLE_HOW_TO_JUMP (282)
function UseItem:Item282(collectibleType, RNG)
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Rabbit Baby" then -- 350
    g.run.babyFrame = gameFrameCount + baby.num
  end
end

function UseItem:ClockworkAssembly(collectibleType, RNG)
  -- Spawn a Restock Machine (6.10)
  g.run.clockworkAssembly = true
  g.p:UseCard(Card.CARD_WHEEL_OF_FORTUNE) -- 11
  g.p:AnimateCollectible(Isaac.GetItemIdByName("Clockwork Assembly"), "UseItem", "PlayerPickup")
end

function UseItem:FlockOfSuccubi(collectibleType, RNG)
  -- Local variables
  local effects = g.p:GetEffects()

  -- Spawn 10 temporary Succubi
  -- (for some reason, adding 7 actually adds 28)
  for i = 1, 7 do
    effects:AddCollectibleEffect(CollectibleType.COLLECTIBLE_SUCCUBUS, false)
  end
  g.p:AnimateCollectible(Isaac.GetItemIdByName("Flock of Succubi"), "UseItem", "PlayerPickup")
end

function UseItem:ChargingStation(collectibleType, RNG)
  -- Local variables
  local coins = g.p:GetNumCoins()

  if coins == 0 or
     RacingPlusGlobals == nil or
     RacingPlusSchoolbag == nil or
     g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) == false or
     RacingPlusGlobals.run.schoolbag.item == 0 then

    return
  end

  g.p:AddCoins(-1)
  RacingPlusSchoolbag:AddCharge(true) -- Giving an argument will make it only give 1 charge
  g.p:AnimateCollectible(Isaac.GetItemIdByName("Charging Station"), "UseItem", "PlayerPickup")
  g.s:Play(SoundEffect.SOUND_BEEP, 1, 0, false, 1) -- 171
end

return UseItem
