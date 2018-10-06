local SPCPostLaserUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_LASER_UPDATE (48)
function SPCPostLaserUpdate:Main(laser)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Cy-Baby" then -- 16
    local data = laser:GetData()
    if data ~= nil and
       data.ring == true then

      -- Keep the ring centered on the player
      laser.Position = player.Position
    end
  end
end

return SPCPostLaserUpdate
