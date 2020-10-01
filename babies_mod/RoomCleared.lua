local RoomCleared = {}

-- Includes
local g = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

function RoomCleared:Main()
  -- Local variables
  local babyType = g.run.babyType
  local babyFunc = RoomCleared.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc()
  end
end

-- The collection of functions for each baby
RoomCleared.functions = {}

-- Love Baby
RoomCleared.functions[1] = function()
  -- Local variables
  local roomSeed = g.r:GetSpawnSeed()

  -- Random Heart
  g.g:Spawn(
    EntityType.ENTITY_PICKUP, -- 5
    PickupVariant.PICKUP_HEART, -- 10
    g.p.Position,
    g.zeroVector,
    g.p,
    0,
    roomSeed
  )
end

-- Bandaid Baby
RoomCleared.functions[88] = function()
  -- Local variables
  local roomType = g.r:GetType()
  local roomSeed = g.r:GetSpawnSeed()

  if roomType == RoomType.ROOM_BOSS then -- 5
    return
  end

  -- Random collectible
  local position = g.r:FindFreePickupSpawnPosition(g.p.Position, 1, true)
  g.g:Spawn(
    EntityType.ENTITY_PICKUP, -- 5
    PickupVariant.PICKUP_COLLECTIBLE, -- 100
    position,
    g.zeroVector,
    g.p,
    0,
    roomSeed
  )
end

-- Jammies Baby
RoomCleared.functions[192] = function()
  -- Extra charge per room cleared
  Misc:AddCharge()
  if RacingPlusSchoolbag ~= nil then
    RacingPlusSchoolbag:AddCharge()
  end
end

-- Fishman Baby
RoomCleared.functions[384] = function()
  -- Local variables
  local roomSeed = g.r:GetSpawnSeed()

  -- Random Bomb
  g.g:Spawn(
    EntityType.ENTITY_PICKUP, -- 5
    PickupVariant.PICKUP_BOMB, -- 40
    g.p.Position,
    g.zeroVector,
    g.p,
    0,
    roomSeed
  )
end

return RoomCleared
