local Misc = {}

-- Includes
local g = require("babies_mod/globals")

function Misc:SpawnRandomPickup(position, velocity, noItems)
  -- Give no velocity by default
  if velocity == nil then
    velocity = g.zeroVector
  end

  -- Spawn a random pickup
  g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
  math.randomseed(g.run.randomSeed)
  local pickupVariant
  if noItems ~= nil then
    -- Exclude trinkets and collectibles
    pickupVariant = math.random(1, 9)
  else
    pickupVariant = math.random(1, 11)
  end
  g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)

  if pickupVariant == 1 then -- Heart
    -- Random Heart - 5.10.0
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, position, velocity,
              nil, 0, g.run.randomSeed)

  elseif pickupVariant == 2 then -- Coin
    -- Random Coin - 5.20.0
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COIN, position, velocity,
              nil, 0, g.run.randomSeed)

  elseif pickupVariant == 3 then -- Key
    -- Random Key - 5.30.0
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_KEY, position, velocity,
              nil, 0, g.run.randomSeed)

  elseif pickupVariant == 4 then -- Bomb
    -- Random Bomb - 5.40.0
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BOMB, position, velocity,
              nil, 0, g.run.randomSeed)

  elseif pickupVariant == 5 then -- Chest
    -- Random Chest - 5.50
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_CHEST, position, velocity,
              nil, 0, g.run.randomSeed)

  elseif pickupVariant == 6 then -- Sack
    -- Random Chest - 5.69
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_GRAB_BAG, position, velocity,
              nil, 0, g.run.randomSeed)

  elseif pickupVariant == 7 then -- Lil' Battery
    -- Lil' Battery - 5.90
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_LIL_BATTERY, position, velocity,
              nil, 0, g.run.randomSeed)

  elseif pickupVariant == 8 then -- Pill
    -- Random Pill - 5.70.0
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, position, velocity,
              nil, 0, g.run.randomSeed)

  elseif pickupVariant == 9 then -- Card / Rune
    -- Random Card / Rune - 5.300.0
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, position, velocity,
              nil, 0, g.run.randomSeed)

  elseif pickupVariant == 10 then -- Trinket
    -- Random Card / Rune - 5.350.0
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TRINKET, position, velocity,
              nil, 0, g.run.randomSeed)

  elseif pickupVariant == 11 then -- Collectible
    -- Random Collectible - 5.100.0
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, velocity,
              nil, 0, g.run.randomSeed)
  end
end

function Misc:SetRandomColor(entity)
  -- Set the entity to a random color
  -- (used for 404 Baby)
  local colorValues = {}
  local seed = entity.InitSeed
  for i = 1, 3 do
    seed = g:IncrementRNG(seed)
    math.randomseed(seed)
    local colorValue = math.random(0, 200)
    colorValue = colorValue / 100
    colorValues[#colorValues + 1] = colorValue
  end
  local color = Color(colorValues[1], colorValues[2], colorValues[3], 1, 1, 1, 1)
  entity:SetColor(color, 10000, 10000, false, false)
end

function Misc:GetOffsetPosition(position, offsetSize, seed)
  math.randomseed(seed)
  local offsetDirection = math.random(1, 4)
  local offsetX, offsetY
  if offsetDirection == 1 then
    -- Bottom right
    offsetX = offsetSize
    offsetY = offsetSize
  elseif offsetDirection == 2 then
    -- Top right
    offsetX = offsetSize
    offsetY = offsetSize * -1
  elseif offsetDirection == 3 then
    -- Bottom left
    offsetX = offsetSize * -1
    offsetY = offsetSize
  elseif offsetDirection == 4 then
    -- Top left
    offsetX = offsetSize * -1
    offsetY = offsetSize * -1
  end
  return Vector(position.X + offsetX, position.Y + offsetY)
end

function Misc:GetItemHeartPrice(itemID)
  -- Local variables
  local maxHearts = g.p:GetMaxHearts()

  -- Find out how this item should be priced
  if itemID == 0 then
    return 0
  elseif maxHearts == 0 then
    return -3
  end

  -- The "DevilPrice" attribute will be 1 by default (for items like Sad Onion, etc.)
  return g:GetItemConfig(itemID).DevilPrice * -1
end

function Misc:AddCharge(singleCharge)
  -- Local variables
  local roomShape = g.r:GetRoomShape()
  local activeItem = g.p:GetActiveItem()
  local activeCharge = g.p:GetActiveCharge()
  local batteryCharge = g.p:GetBatteryCharge()

  -- Copied from the Racing+ mod (RPFastClear.lua)
  if not g.p:NeedsCharge() then
    return
  end

  -- Find out if we are in a 2x2 or L room
  local chargesToAdd = 1
  if roomShape >= 8 then
    -- L rooms and 2x2 rooms should grant 2 charges
    chargesToAdd = 2

  elseif g.p:HasTrinket(TrinketType.TRINKET_AAA_BATTERY) and -- 3
         activeCharge == g:GetItemMaxCharges(activeItem) - 2 then

    -- The AAA Battery grants an extra charge when the active item is one away from being fully charged
    chargesToAdd = 2

  elseif g.p:HasTrinket(TrinketType.TRINKET_AAA_BATTERY) and -- 3
         activeCharge == g:GetItemMaxCharges(activeItem) and
         g.p:HasCollectible(CollectibleType.COLLECTIBLE_BATTERY) and -- 63
         batteryCharge == g:GetItemMaxCharges(activeItem) - 2 then

    -- The AAA Battery should grant an extra charge when the active item is one away from being fully charged
    -- with The Battery (this is bugged in vanilla for The Battery)
    chargesToAdd = 2
  end
  if singleCharge ~= nil then
    -- We might only want to add a single charge to the active item in certain situations
    chargesToAdd = 1
  end

  -- Add the correct amount of charges
  local currentCharge = g.p:GetActiveCharge()
  g.p:SetActiveCharge(currentCharge + chargesToAdd)
end

return Misc
