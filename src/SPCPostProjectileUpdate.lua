local SPCPostProjectileUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCMisc    = require("src/spcmisc")

-- ModCallbacks.MC_POST_PROJECTILE_UPDATE (44)
function SPCPostProjectileUpdate:Main(projectile)
  -- Local variables
  local babyType = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[babyType]
  if baby == nil then
    return
  end

  --[[
  Isaac.DebugString("MC_POST_PROJECTILE_UPDATE - " ..
                    tostring(projectile.Type) .. "." .. tostring(projectile.Variant) .. "." ..
                    tostring(projectile.SubType) ..
                    " (spawner: " .. projectile.SpawnerType .. "." .. projectile.SpawnerVariant .. ")")
  --]]

  if baby.name == "Fireball Baby" and -- 318
     projectile.FrameCount <= 1 and
     projectile.SpawnerType == EntityType.ENTITY_FIREPLACE then -- 33

    -- Prevent fires from shooting
    -- (this cannot be done in the MC_POST_PROJECTILE_INIT callback since "projectile.SpawnerType" is empty)
    projectile:Remove()

  elseif baby.name == "404 Baby" and -- 463
         projectile.FrameCount <= 1 then

    -- The first frame for a projectile is 1
    -- (frame 0 will happen with a tear, but not a projectile for some reason)
    SPCMisc:SetRandomColor(projectile)
  end
end

return SPCPostProjectileUpdate
