local SPCPostProjectileUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCMisc    = require("src/spcmisc")

-- ModCallbacks.MC_POST_PROJECTILE_UPDATE (44)
function SPCPostProjectileUpdate:Main(projectile)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local data = projectile:GetData()
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

  -- The first frame for a projectile is 1
  -- (frame 0 will happen with a tear, but not a projectile for some reason)

  if baby.name == "Nosferatu Baby" and -- 109
     projectile.SpawnerType ~= EntityType.ENTITY_MOMS_HEART and -- 78
     projectile.SpawnerType ~= EntityType.ENTITY_ISAAC then -- 102

    -- Enemies have homing projectiles
    projectile:AddProjectileFlags(ProjectileFlags.SMART) -- 1

  elseif baby.name == "Sorrow Baby" and -- 153
         SPCGlobals:InsideSquare(projectile.Position, player.Position, baby.distance) then

    -- Projectiles are reflected as bombs
    game:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_NORMAL, -- 4.1
               projectile.Position, projectile.Velocity * -1, nil, 0, 0)
    projectile:Remove()

  elseif baby.name == "Onion Baby" and -- 224
         data.spedUp == nil and
         projectile.SpawnerType ~= EntityType.ENTITY_MOMS_HEART and -- 78
         projectile.SpawnerType ~= EntityType.ENTITY_ISAAC then -- 102

    data.spedUp = true
    projectile.Velocity = projectile.Velocity * 2

  elseif baby.name == "Eye Demon Baby" then -- 280
    projectile:AddProjectileFlags(ProjectileFlags.CONTINUUM) -- 1 << 30
    projectile.Height = projectile.Height * 2

  elseif baby.name == "Fireball Baby" and -- 318
     projectile.FrameCount == 1 and
     projectile.SpawnerType == EntityType.ENTITY_FIREPLACE then -- 33

    -- Prevent fires from shooting
    -- (this cannot be done in the MC_POST_PROJECTILE_INIT callback since "projectile.SpawnerType" is empty)
    projectile:Remove()

  elseif baby.name == "404 Baby" and -- 463
         projectile.FrameCount == 1 then

    SPCMisc:SetRandomColor(projectile)
  end
end

return SPCPostProjectileUpdate
