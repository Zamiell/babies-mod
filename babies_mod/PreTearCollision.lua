local PreTearCollision = {}

-- Note: This callback fires when a tear hits an enemy

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_PRE_TEAR_COLLISION (42)
function PreTearCollision:Main(tear, collider, low)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PreTearCollision.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(tear, collider)
  end
end

-- The collection of functions for each baby
PreTearCollision.functions = {}

-- Mort Baby
PreTearCollision.functions[55] = function(tear, collider)
  -- Guppy tears
  if tear.SubType == 1 then
    g.p:AddBlueFlies(1, g.p.Position, nil)
  end
end

-- Gills Baby
PreTearCollision.functions[410] = function(tear, collider)
  -- Splash tears
  if tear.SubType == 1 then
    local creep = Isaac.Spawn(
      EntityType.ENTITY_EFFECT, -- 1000
      EffectVariant.PLAYER_CREEP_HOLYWATER, -- 37
      0,
      collider.Position,
      g.zeroVector,
      g.p
    ):ToEffect()
    creep.Timeout = 120
  end
end

-- Sad Bunny Baby
PreTearCollision.functions[459] = function(tear, collider)
  -- Accuracy increases tear rate
  if tear.SubType == 1 then
    g.run.babyCounters = g.run.babyCounters + 1
    g.p:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    g.p:EvaluateItems()
  end
end

return PreTearCollision
