local PreGetCollectible = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_PRE_GET_COLLECTIBLE (62)
function PreGetCollectible:Main(poolType, decrease, seed)
  -- Local variables
  local roomType = g.r:GetType()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  -- This callback is called when the game needs to get a new random item from an item pool
  -- It is undocumented, but you can return an integer from this callback in order to change the returned item pool type
  -- It is not called for set drops (like Mr. Boom from Wrath) and manually spawned items (like the Checkpoint)

  --[[
  Isaac.DebugString("MC_PRE_GET_COLLECTIBLE - " .. tostring(poolType) .. ", " .. tostring(decrease) .. ", " ..
                    tostring(seed))
  --]]

  -- Below, we will need to call the "itemPool:GetCollectible()" function,
  -- which will cause this callback to be re-entered
  if g.run.babyBool then
    return
  end

  if baby.name == "Folder Baby" then -- 430
    if roomType == RoomType.ROOM_SHOP then -- 2
      return PreGetCollectible:GetRandom(ItemPoolType.POOL_TREASURE) -- 0
    elseif roomType == RoomType.ROOM_TREASURE then -- 4
      return PreGetCollectible:GetRandom(ItemPoolType.POOL_SHOP) -- 1
    elseif roomType == RoomType.ROOM_DEVIL then -- 14
      return PreGetCollectible:GetRandom(ItemPoolType.POOL_ANGEL) -- 4
    elseif roomType == RoomType.ROOM_ANGEL then -- 15
      return PreGetCollectible:GetRandom(ItemPoolType.POOL_DEVIL) -- 3
    end

  elseif baby.name == "Little Gish" then -- 525
    return PreGetCollectible:GetRandom(ItemPoolType.POOL_CURSE) -- 12

  elseif baby.name == "Ghost Baby" then -- 528
    return PreGetCollectible:GetRandom(ItemPoolType.POOL_SHOP) -- 1

  elseif baby.name == "Mongo Baby" then -- 535
    return PreGetCollectible:GetRandom(ItemPoolType.POOL_ANGEL) -- 4

  elseif baby.name == "Incubus" then -- 536
    return PreGetCollectible:GetRandom(ItemPoolType.POOL_DEVIL) -- 3
  end
end

function PreGetCollectible:GetRandom(poolType)
  -- Local variables
  local itemPool = g.g:GetItemPool()

  -- Get a new item from this pool
  g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
  g.run.babyBool = true -- The next line will cause this callback to be re-entered
  local item = itemPool:GetCollectible(poolType, true, g.run.roomRNG) -- The second argument is "decrease"
  g.run.babyBool = false
  return item
end

return PreGetCollectible
