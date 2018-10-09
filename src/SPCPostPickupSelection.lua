local SPCPostPickupSelection = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_PICKUP_SELECTION (37)
function SPCPostPickupSelection:Main(pickup, variant, subType)
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomType = room:GetType()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- We don't want to mess with the Checkpoint at all
  if variant == PickupVariant.PICKUP_COLLECTIBLE and -- 100
     subType == Isaac.GetItemIdByName("Checkpoint") then

    return
  end

  if baby.name == "Gem Baby" and -- 237
     variant == PickupVariant.PICKUP_COIN and -- 20
     subType == 1 then -- Penny

    -- 5.20.2 - Nickel
    return { PickupVariant.PICKUP_COIN, 2 }

  elseif baby.name == "Merman Baby" and -- 342
         variant == PickupVariant.PICKUP_KEY then -- 30

    -- Convert all keys to bombs
    return { PickupVariant.PICKUP_BOMB, subType } -- 40

  elseif baby.name == "Mermaid Baby" and -- 395
         variant == PickupVariant.PICKUP_BOMB then -- 40

    -- There is a subType of 5 for bombs but not for keys
    if subType == 5 then
      subType = 1
    end

    -- Convert all bombs to keys
    return { PickupVariant.PICKUP_KEY, subType } -- 30

  elseif baby.name == "Folder Baby" and -- 430
         variant == PickupVariant.PICKUP_COLLECTIBLE then -- 100

    if roomType == RoomType.ROOM_SHOP then -- 2
      return SPCPostPickupSelection:ReplacePedestal(pickup, subType, ItemPoolType.POOL_TREASURE) -- 0
    elseif roomType == RoomType.ROOM_TREASURE then -- 4
      return SPCPostPickupSelection:ReplacePedestal(pickup, subType, ItemPoolType.POOL_SHOP) -- 1
    elseif roomType == RoomType.ROOM_DEVIL then -- 14
      return SPCPostPickupSelection:ReplacePedestal(pickup, subType, ItemPoolType.POOL_ANGEL) -- 4
    elseif roomType == RoomType.ROOM_ANGEL then -- 15
      return SPCPostPickupSelection:ReplacePedestal(pickup, subType, ItemPoolType.POOL_DEVIL) -- 3
    end

  elseif baby.name == "Little Gish" and -- 525
         variant == PickupVariant.PICKUP_COLLECTIBLE then -- 100

    return SPCPostPickupSelection:ReplacePedestal(pickup, subType, ItemPoolType.POOL_CURSE) -- 12

  elseif baby.name == "Ghost Baby" and -- 528
         variant == PickupVariant.PICKUP_COLLECTIBLE then -- 100

    return SPCPostPickupSelection:ReplacePedestal(pickup, subType, ItemPoolType.POOL_SHOP) -- 1

  elseif baby.name == "Mongo Baby" and -- 535
         variant == PickupVariant.PICKUP_COLLECTIBLE then -- 100

    return SPCPostPickupSelection:ReplacePedestal(pickup, subType, ItemPoolType.POOL_ANGEL) -- 4

  elseif baby.name == "Inucbus" and -- 536
         variant == PickupVariant.PICKUP_COLLECTIBLE then -- 100

    return SPCPostPickupSelection:ReplacePedestal(pickup, subType, ItemPoolType.POOL_DEVIL) -- 3
  end
end

function SPCPostPickupSelection:ReplacePedestal(pickup, subType, pool)
  -- Local variables
  local game = Game()
  local itemPool = game:GetItemPool()
  local level = game:GetLevel()
  local roomIndex = level:GetCurrentRoomDesc().SafeGridIndex
  if roomIndex < 0 then -- SafeGridIndex is always -1 for rooms outside the grid
    roomIndex = level:GetCurrentRoomIndex()
  end

  if SPCPostPickupSelection:IsAlreadyReplaced(pickup, subType) then
    return
  end

  -- Get a new item
  SPCGlobals.run.roomRNG = SPCGlobals:IncrementRNG(SPCGlobals.run.roomRNG)
  local newSubType = itemPool:GetCollectible(pool, true, SPCGlobals.run.roomRNG) -- The second argument is "decrease"

  -- Store that we have replaced this pedestal
  -- (we can't use X and Y coordinates to make this more accurate because
  -- they will always be set to 0 if we get here during room initialization)
  SPCGlobals.run.replacedPedestals[#SPCGlobals.run.replacedPedestals + 1] = {
    room    = roomIndex,
    subType = newSubType,
  }

  --[[
  Isaac.DebugString("Added item " .. tostring(newSubType) .. " to replacedPedestals. " ..
                    "(" .. tostring(#SPCGlobals.run.replacedPedestals) .. " total items.)")
  --]]

  return { PickupVariant.PICKUP_COLLECTIBLE, newSubType } -- 100
end

function SPCPostPickupSelection:IsAlreadyReplaced(pickup, subType)
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local roomIndex = level:GetCurrentRoomDesc().SafeGridIndex
  if roomIndex < 0 then -- SafeGridIndex is always -1 for rooms outside the grid
    roomIndex = level:GetCurrentRoomIndex()
  end

  -- Check to see if this item is already in the "replacedPedestals" table
  for i = 1, #SPCGlobals.run.replacedPedestals do
    local pedestal = SPCGlobals.run.replacedPedestals[i]
    if pedestal.room == roomIndex and
       pedestal.subType == subType then

      return true
    end
  end

  return false
end

return SPCPostPickupSelection
