local SPCUsePill = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_USE_PILL (11)
function SPCUsePill:Main(pillEffect)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local babyType = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[babyType]
  if baby == nil then
    return
  end

  if baby.name == "Bubbles Baby" then -- 483
    SPCGlobals.run.bubblesBabyCounters = SPCGlobals.run.bubblesBabyCounters + 1
    player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    player:EvaluateItems()
  end
end

return SPCUsePill
