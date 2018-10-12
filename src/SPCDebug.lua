local SPCDebug = {}

-- Includes
local SPCPostRender = require("src/spcpostrender")

-- ModCallbacks.MC_USE_ITEM (3)
function SPCDebug:Main()
  SPCPostRender:SetPlayerSprite()
  Isaac.DebugString("Finished SPC debug.")
end

return SPCDebug
