local PreGetCollectible = {}

-- Includes
local g = require("babies_mod/globals")

-- This callback is called when the game needs to get a new random item from an item pool
-- It is undocumented, but you can return an integer from this callback in order to change the returned item pool type
-- It is not called for "set" drops (like Mr. Boom from Wrath) and manually spawned items (like the Checkpoint)

-- ModCallbacks.MC_PRE_GET_COLLECTIBLE (62)
function PreGetCollectible:Main(poolType, decrease, seed)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  -- Below, we will need to call the "itemPool:GetCollectible()" function,
  -- which will cause this callback to be re-entered
  if g.run.babyBool then
    return
  end

  local babyFunc = PreGetCollectible.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc()
  end
end

-- The collection of functions for each baby
PreGetCollectible.functions = {}

-- Folder Baby
PreGetCollectible.functions[430] = function()
  local roomType = g.r:GetType()
  if roomType == RoomType.ROOM_SHOP then -- 2
    return PreGetCollectible:GetRandom(ItemPoolType.POOL_TREASURE) -- 0
  elseif roomType == RoomType.ROOM_TREASURE then -- 4
    return PreGetCollectible:GetRandom(ItemPoolType.POOL_SHOP) -- 1
  elseif roomType == RoomType.ROOM_DEVIL then -- 14
    return PreGetCollectible:GetRandom(ItemPoolType.POOL_ANGEL) -- 4
  elseif roomType == RoomType.ROOM_ANGEL then -- 15
    return PreGetCollectible:GetRandom(ItemPoolType.POOL_DEVIL) -- 3
  end
end

-- Little Gish
PreGetCollectible.functions[525] = function()
  return PreGetCollectible:GetRandom(ItemPoolType.POOL_CURSE) -- 12
end

-- Ghost Baby
PreGetCollectible.functions[528] = function()
  return PreGetCollectible:GetRandom(ItemPoolType.POOL_SHOP) -- 1
end

-- Mongo Baby
PreGetCollectible.functions[535] = function()
  return PreGetCollectible:GetRandom(ItemPoolType.POOL_ANGEL) -- 4
end

-- Incubus
PreGetCollectible.functions[536] = function()
  return PreGetCollectible:GetRandom(ItemPoolType.POOL_DEVIL) -- 3
end

function PreGetCollectible:GetRandom(poolType)
  -- Get a new item from this pool
  g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
  g.run.babyBool = true -- The next line will cause this callback to be re-entered
  local item = g.itemPool:GetCollectible(poolType, true, g.run.roomRNG) -- The second argument is "decrease"
  g.run.babyBool = false
  return item
end

return PreGetCollectible
