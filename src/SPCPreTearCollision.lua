local SPCPreTearCollision = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_PRE_TEAR_COLLISION (42)
function SPCPreTearCollision:Main(tear, collider, low)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Gills Baby" then -- 410
    -- Splash tears
    local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_HOLYWATER, -- 37
                             collider.Position, Vector(0, 0), player, 0, 0)
    creep:ToEffect().Timeout = 120

  elseif baby.name == "Sad Bunny Baby" then -- 459
    SPCGlobals.run.sadBunnyCounters = SPCGlobals.run.sadBunnyCounters + 1
    player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    player:EvaluateItems()
  end
end

return SPCPreTearCollision
