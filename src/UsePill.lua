local UsePill = {}

-- Includes
local g = require("src/globals")

-- ModCallbacks.MC_USE_PILL (11)
function UsePill:Main(pillEffect)
  -- Local variables
  local player = g.g:GetPlayer(0)
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  if baby.name == "Bubbles Baby" then -- 483
    g.run.babyCounters = g.run.babyCounters + 1
    player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    player:EvaluateItems()
  end
end

return UsePill
