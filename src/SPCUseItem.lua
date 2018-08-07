local SPCUseItem = {}

--
-- Includes
--

--local SPCGlobals = require("src/spcglobals")

--[[
function SPCUseItem:Item323(collectibleType, RNG)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Water Baby" then
    SPCGlobals.run.waterBabyTears = 8
    Isaac.DebugString("Getting here 1")
  end
end
--]]

return SPCUseItem
