local SPCMisc = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

function SPCMisc:SpawnRandomPickup(position)
  -- Local variables
  local game = Game()

  -- Spawn a random pickup
  SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
  math.randomseed(SPCGlobals.run.randomSeed)
  local pickupVariant = math.random(1, 11)
  SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)

  if pickupVariant == 1 then -- Heart
    -- Random Heart - 5.10.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)

  elseif pickupVariant == 2 then -- Coin
    -- Random Coin - 5.20.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COIN, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)

  elseif pickupVariant == 3 then -- Key
    -- Random Key - 5.30.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_KEY, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)

  elseif pickupVariant == 4 then -- Bomb
    -- Random Bomb - 5.40.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BOMB, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)

  elseif pickupVariant == 5 then -- Chest
    -- Random Chest - 5.50
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_CHEST, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)

  elseif pickupVariant == 6 then -- Sack
    -- Random Chest - 5.69
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_GRAB_BAG, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)

  elseif pickupVariant == 7 then -- Lil' Battery
    -- Lil' Battery - 5.90
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_LIL_BATTERY, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)

  elseif pickupVariant == 8 then -- Pill
    -- Random Pill - 5.70.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_PILL, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)

  elseif pickupVariant == 9 then -- Card / Rune
    -- Random Card / Rune - 5.300.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)

  elseif pickupVariant == 10 then -- Trinket
    -- Random Card / Rune - 5.350.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TRINKET, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)

  elseif pickupVariant == 11 then -- Collectible
    -- Random Collectible - 5.100.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, position, Vector(0, 0),
               nil, 0, SPCGlobals.run.randomSeed)
  end
end

function SPCMisc:SetRandomColor(entity)
  -- Set the entity to a random color
  -- (used for 404 Baby)
  local colorValues = {}
  local seed = entity.InitSeed
  for i = 1, 3 do
    seed = SPCGlobals:IncrementRNG(seed)
    math.randomseed(seed)
    local colorValue = math.random(0, 200)
    colorValue = colorValue / 100
    colorValues[#colorValues + 1] = colorValue
  end
  local color = Color(colorValues[1], colorValues[2], colorValues[3], 1, 1, 1, 1)
  entity:SetColor(color, 10000, 10000, false, false)
end

function SPCMisc:GetOffsetPosition(position, offsetSize, seed)
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

return SPCMisc
