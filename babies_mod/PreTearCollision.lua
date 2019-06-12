local PreTearCollision = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_PRE_TEAR_COLLISION (42)
function PreTearCollision:Main(tear, collider, low)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  -- This callback fires when a tear hits an enemy
  --[[
  Isaac.DebugString("MC_PRE_TEAR_COLLISION - " .. tostring(tear.Type) .. "." .. tostring(tear.Variant) .. "." ..
                    tostring(tear.SubType))
  Isaac.DebugString("  Hit: " .. tostring(collider.Type) .. "." .. tostring(collider.Variant) .. "." ..
                    tostring(collider.SubType))
  --]]

  if baby.name == "Mort Baby" and -- 55
     tear.SubType == 1 then

    -- Guppy tears
    g.p:AddBlueFlies(1, g.p.Position, nil)

  elseif baby.name == "Gills Baby" and -- 410
         tear.SubType == 1 then

    -- Splash tears
    local creep = g.g:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_HOLYWATER, -- 37
                            collider.Position, g.zeroVector, g.p, 0, 0)
    creep:ToEffect().Timeout = 120

  elseif baby.name == "Sad Bunny Baby" and -- 459
         tear.SubType == 1 then

    -- Accuracy increases tear rate
    g.run.babyCounters = g.run.babyCounters + 1
    g.p:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    g.p:EvaluateItems()
  end
end

return PreTearCollision
