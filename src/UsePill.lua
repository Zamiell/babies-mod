local UsePill = {}

-- Includes
local g = require("src/globals")

-- ModCallbacks.MC_USE_PILL (11)
function UsePill:Main(pillEffect)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  if baby.name == "Bubbles Baby" then -- 483
    g.run.babyCounters = g.run.babyCounters + 1
    g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    g.p:EvaluateItems()
  end
end

return UsePill
