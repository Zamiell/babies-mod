local SPCPostBombInit = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_BOMB_INIT (57)
function SPCPostBombInit:Main(laser)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "404 Baby" then -- 463
    SPCGlobals:SetRandomColor(laser)
  end
end

return SPCPostBombInit
