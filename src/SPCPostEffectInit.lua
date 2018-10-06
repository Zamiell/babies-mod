local SPCPostEffectInit = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_EFFECT_INIT (54)
function SPCPostEffectInit:Main(effect)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "404 Baby" then -- 463
    SPCGlobals:SetRandomColor(effect)
  end
end

return SPCPostEffectInit
