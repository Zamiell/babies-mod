local SPCPostPlayerUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_PLAYER_UPDATE (31)
function SPCPostPlayerUpdate:Main(player)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Piece A Baby" then -- 179
    -- Can only move up + down + left + right
    if math.abs(player.Velocity.X) > math.abs(player.Velocity.Y) then
      player.Velocity = Vector(player.Velocity.X, 0)
    else
      player.Velocity = Vector(0, player.Velocity.Y)
    end
  end
end

return SPCPostPlayerUpdate
