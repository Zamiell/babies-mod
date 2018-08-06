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
  --local baby = SPCGlobals.babies[type]

  --[[
  if cacheFlag == CacheFlag.CACHE_LUCK and -- 1024
     type == 277 then -- Spiky Demon Baby

    player.Luck = player.Luck + 13
  end
  --]]
end

return SPCEvaluateCache
