local SPCPreGameExit = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_PRE_GAME_EXIT (17)
function SPCPreGameExit:Main()
  SPCPreGameExit:SaveStats()
end

function SPCPreGameExit:SaveStats()
  Isaac.SaveModData(SPCGlobals.SPC, stats.GenerateSave())
end

return SPCPreGameExit
