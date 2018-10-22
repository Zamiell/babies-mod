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
    player:AddBlueFlies(1, player.Position, nil)

  elseif baby.name == "Gills Baby" and -- 410
         tear.SubType == 1 then

    -- Splash tears
    local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_HOLYWATER, -- 37
                             collider.Position, Vector(0, 0), player, 0, 0)
    creep:ToEffect().Timeout = 120

  elseif baby.name == "Sad Bunny Baby" and -- 459
         tear.SubType == 1 then

    -- Accuracy increases tear rate
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
    player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    player:EvaluateItems()
  end
end

return SPCPreTearCollision
