local SPCPostGameStarted  = {}

-- Includes
local SPCGlobals      = require("src/spcglobals")
local SPCPostNewLevel = require("src/spcpostnewlevel")

-- ModCallbacks.MC_POST_GAME_STARTED (15)
function SPCPostGameStarted:Main(saveState)
  -- Don't do anything if this is not a new run
  if saveState then
    return
  end

  Isaac.DebugString("MC_POST_GAME_STARTED")

  -- Reset variables
  SPCGlobals:InitRun()

  -- Call PostNewLevel manually (they get naturally called out of order)
  SPCPostNewLevel:NewLevel()
end

return SPCPostGameStarted
