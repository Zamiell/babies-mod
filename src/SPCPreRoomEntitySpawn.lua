local SPCPreRoomEntitySpawn = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN (71)
function SPCPreRoomEntitySpawn:Main(type, variant, subType, gridIndex, seed)
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomType = room:GetType()
  local roomFrameCount = room:GetFrameCount()
  local roomFirstVisit = room:IsFirstVisit()
  local babyType = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[babyType]
  if baby == nil then
    return
  end

  -- We only care about replacing things when the room is first loading and on the first visit
  if roomFrameCount ~= -1 then
    return
  end

  if baby.name == "Chompers Baby" and -- 143
     roomFirstVisit and
     type >= 1000 and -- We only care about grid entities
     type ~= 4500 and -- Make an exception for Pressure Plates
     type ~= 9000 and -- Make an exception for trapdoors
     type ~= 9100 then -- Make an exception for crawlspaces

    -- Everything is Red Poop
    return {1490, 0, 0}

  elseif baby.name == "Suit Baby" and -- 287
         roomType ~= RoomType.ROOM_DEFAULT and -- 1
         roomType ~= RoomType.ROOM_ERROR and -- 3
         roomType ~= RoomType.ROOM_BOSS and -- 5
         roomType ~= RoomType.ROOM_DEVIL and -- 14
         roomType ~= RoomType.ROOM_ANGEL and -- 15
         roomType ~= RoomType.ROOM_DUNGEON and -- 16
         roomType ~= RoomType.ROOM_BOSSRUSH and -- 17
         roomType ~= RoomType.ROOM_BLACK_MARKET then -- 22

    -- All special rooms are Devil Rooms
    return {999, 0, 0} -- Equal to 1000.0, which is a blank effect, which is essentially nothing

  elseif baby.name == "Red Wrestler Baby" and -- 389
         roomFirstVisit and
         type >= 1000 and -- We only care about grid entities
         type ~= 4500 and -- Make an exception for Pressure Plates
         type ~= 9000 and -- Make an exception for trapdoors
         type ~= 9100 then -- Make an exception for crawlspaces

    -- Everything is TNT
    return {1300, 0, 0}
  end
end

return SPCPreRoomEntitySpawn
