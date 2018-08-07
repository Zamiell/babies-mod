local SPCPreUseItem = {}

--
-- Includes
--

local SPCGlobals = require("src/spcglobals")

function SPCPreUseItem:Item323(collectibleType, RNG)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Water Baby" then -- 3
    SPCGlobals.run.waterBabyTears = 8
  end
end

return SPCPreUseItem
