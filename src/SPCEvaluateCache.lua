local SPCEvaluateCache = {}

--
-- Includes
--

local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_EVALUATE_CACHE (8)
function SPCEvaluateCache:Main(player, cacheFlag)
  --Isaac.DebugString("MC_EVALUATE_CACHE - " .. tostring(cacheFlag))

  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if cacheFlag == CacheFlag.CACHE_FIREDELAY and -- 2
     baby.blindfolded then

    player.FireDelay = 100000
    Isaac.DebugString("Set blindfolded.")
  end
end

return SPCEvaluateCache
