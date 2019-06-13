local PreRoomEntitySpawn = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN (71)
function PreRoomEntitySpawn:Main(type, variant, subType, gridIndex, seed)
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

  local babyFunc = PreRoomEntitySpawn.functions[type]
  if babyFunc ~= nil then
    return babyFunc()
  end
end

-- The collection of functions for each baby
PreRoomEntitySpawn.functions = {}

-- Chompers Baby
PreRoomEntitySpawn.functions[143] = function()
  if g.r:IsFirstVisit() and
     type >= 1000 and -- We only care about grid entities
     type ~= 4500 and -- Make an exception for Pressure Plates
     type ~= 9000 and -- Make an exception for trapdoors
     type ~= 9100 then -- Make an exception for crawlspaces

    -- Everything is Red Poop
    return {1490, 0, 0}
  end
end

-- Suit Baby
PreRoomEntitySpawn.functions[287] = function()
  -- All special rooms are Devil Rooms
  -- Ignore some select special rooms
  local roomType = g.r:GetType()
  if roomType ~= RoomType.ROOM_DEFAULT and -- 1
     roomType ~= RoomType.ROOM_ERROR and -- 3
     roomType ~= RoomType.ROOM_BOSS and -- 5
     roomType ~= RoomType.ROOM_DEVIL and -- 14
     roomType ~= RoomType.ROOM_ANGEL and -- 15
     roomType ~= RoomType.ROOM_DUNGEON and -- 16
     roomType ~= RoomType.ROOM_BOSSRUSH and -- 17
     roomType ~= RoomType.ROOM_BLACK_MARKET then -- 22

    return {999, 0, 0} -- Equal to 1000.0, which is a blank effect, which is essentially nothing
  end
end

-- Red Wrestler Baby
PreRoomEntitySpawn.functions[389] = function()
  if g.r:IsFirstVisit() and
     type >= 1000 and -- We only care about grid entities
     type ~= 4500 and -- Make an exception for Pressure Plates
     type ~= 9000 and -- Make an exception for trapdoors
     type ~= 9100 then -- Make an exception for crawlspaces

    -- Everything is TNT
    return {1300, 0, 0}
  end
end

return PreRoomEntitySpawn
