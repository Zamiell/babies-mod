local PostProjectileUpdate = {}

-- Includes
local g    = require("src/globals")
local Misc = require("src/misc")

-- ModCallbacks.MC_POST_PROJECTILE_UPDATE (44)
function PostProjectileUpdate:Main(projectile)
  -- Local variables
  local data = projectile:GetData()
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
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

  if baby.name == "Zombie Baby" and -- 61
     projectile.Parent ~= nil and
     projectile.Parent:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then -- 1 << 29

    -- Brings back enemies from the dead
    -- Make projectiles from friendly enemies faded to prevent confusion
    local color = projectile:GetColor()
    local fadeAmount = 0.25
    local newColor = Color(color.R, color.G, color.B, fadeAmount, 0, 0, 0)
    -- (for some reason, in this callback, RO, GO, and BO will be float values,
    -- but the Color constructor only wants integers, so manually use 0 for these 3 values instead of the existing ones)
    projectile:SetColor(newColor, 0, 0, true, true)

  elseif baby.name == "Nosferatu Baby" and -- 109
         projectile.SpawnerType ~= EntityType.ENTITY_MOMS_HEART and -- 78
         projectile.SpawnerType ~= EntityType.ENTITY_ISAAC then -- 102

    -- Enemies have homing projectiles
    projectile:AddProjectileFlags(ProjectileFlags.SMART) -- 1

  elseif baby.name == "Sorrow Baby" and -- 153
         g:InsideSquare(projectile.Position, g.p.Position, baby.distance) then

    -- Projectiles are reflected as bombs
    g.g:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_NORMAL, -- 4.1
              projectile.Position, projectile.Velocity * -1, nil, 0, 0)
    projectile:Remove()

  elseif baby.name == "Onion Baby" and -- 224
         data.spedUp == nil and
         projectile.SpawnerType ~= EntityType.ENTITY_MOMS_HEART and -- 78
         projectile.SpawnerType ~= EntityType.ENTITY_ISAAC then -- 102

    data.spedUp = true
    projectile.Velocity = projectile.Velocity * 2

  elseif baby.name == "Eye Demon Baby" and -- 280
         data.modified == nil then

    data.modified = true
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

    Misc:SetRandomColor(projectile)
  end
end

return PostProjectileUpdate
