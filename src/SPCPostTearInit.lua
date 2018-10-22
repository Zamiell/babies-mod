local SPCPostTearInit = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_TEAR_INIT (39)
function SPCPostTearInit:Main(tear)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Bloodsucker Baby" then -- 87
    -- Everything is tiny
    tear.SpriteScale = Vector(0.5, 0.5)

  elseif baby.name == "New Jammies Baby" then -- 193
    -- Everything is giant
    tear.SpriteScale = Vector(2, 2)
  end
end

return SPCPostTearInit
