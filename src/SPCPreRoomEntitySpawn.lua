local SPCPreRoomEntitySpawn = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN (71)
function SPCPreRoomEntitySpawn:Main(type, variant, subType, gridIndex, seed)
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local babyType = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[babyType]
  if baby == nil then
    return
  end

  -- We only care about replacing things when the room is first loading
  if roomFrameCount ~= -1 then
    return
  end

  -- We only care about grid entities
  if type < 1000 then
    return
  end

  if baby.name == "Chompers Baby" then -- 143
    return {1490, 0, 0}
  end
end

return SPCPreRoomEntitySpawn
