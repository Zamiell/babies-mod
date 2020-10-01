local PreRoomEntitySpawn = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN (71)
function PreRoomEntitySpawn:Main(entityType, variant, subType, gridIndex, seed)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  -- We only care about replacing things when the room is first loading and on the first visit
  if g.r:GetFrameCount() ~= -1 then
    return
  end

  local babyFunc = PreRoomEntitySpawn.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(entityType)
  end
end

-- The collection of functions for each baby
PreRoomEntitySpawn.functions = {}

-- Chompers Baby
PreRoomEntitySpawn.functions[143] = function(entityType)
  if (
    g.r:IsFirstVisit()
    and entityType >= 1000 -- We only care about grid entities
    and entityType ~= 4500 -- Make an exception for Pressure Plates
    and entityType ~= 9000 -- Make an exception for trapdoors
    and entityType ~= 9100 -- Make an exception for crawlspaces
  ) then
    -- Everything is Red Poop
    return {1490, 0, 0}
  end
end

-- Suit Baby
PreRoomEntitySpawn.functions[287] = function(entityType)
  -- All special rooms are Devil Rooms
  -- Ignore some select special rooms
  local roomType = g.r:GetType()
  if (
    roomType ~= RoomType.ROOM_DEFAULT -- 1
    and roomType ~= RoomType.ROOM_ERROR -- 3
    and roomType ~= RoomType.ROOM_BOSS -- 5
    and roomType ~= RoomType.ROOM_DEVIL -- 14
    and roomType ~= RoomType.ROOM_ANGEL -- 15
    and roomType ~= RoomType.ROOM_DUNGEON -- 16
    and roomType ~= RoomType.ROOM_BOSSRUSH -- 17
    and roomType ~= RoomType.ROOM_BLACK_MARKET -- 22
  ) then
    return {999, 0, 0} -- Equal to 1000.0, which is a blank effect, which is essentially nothing
  end
end

-- Red Wrestler Baby
PreRoomEntitySpawn.functions[389] = function(entityType)
  if (
    g.r:IsFirstVisit()
    and entityType >= 1000 -- We only care about grid entities
    and entityType ~= 4500 -- Make an exception for Pressure Plates
    and entityType ~= 9000 -- Make an exception for trapdoors
    and entityType ~= 9100 -- Make an exception for crawlspaces
  ) then
    -- Everything is TNT
    return {1300, 0, 0}
  end
end

return PreRoomEntitySpawn
