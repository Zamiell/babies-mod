local SPCPostBombInit = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCMisc    = require("src/spcmisc")

-- ModCallbacks.MC_POST_BOMB_INIT (57)
function SPCPostBombInit:Main(bomb)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Bloodsucker Baby" then -- 87
    -- Everything is tiny
    bomb.SpriteScale = Vector(0.5, 0.5)

  elseif baby.name == "New Jammies Baby" then -- 193
    -- Everything is giant
    bomb.SpriteScale = Vector(2, 2)

  elseif baby.name == "404 Baby" then -- 463
    SPCMisc:SetRandomColor(bomb)
  end
end

return SPCPostBombInit
