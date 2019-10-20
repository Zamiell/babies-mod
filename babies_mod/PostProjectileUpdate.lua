local PostProjectileUpdate = {}

-- Note: This callback will fire on frame 1 and onwards

-- Includes
local g    = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_POST_PROJECTILE_UPDATE (44)
function PostProjectileUpdate:Main(projectile)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostProjectileUpdate.functions[type]
  if babyFunc ~= nil then
    babyFunc(projectile)
  end
end

-- The collection of functions for each baby
PostProjectileUpdate.functions = {}

-- Zombie Baby
PostProjectileUpdate.functions[61] = function(projectile)
  if projectile.Parent ~= nil and
     projectile.Parent:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then -- 1 << 29

    -- Brings back enemies from the dead
    -- Make projectiles from friendly enemies faded to prevent confusion
    local color = projectile:GetColor()
    local fadeAmount = 0.25
    local newColor = Color(color.R, color.G, color.B, fadeAmount, 0, 0, 0)
    -- (for some reason, in this callback, RO, GO, and BO will be float values,
    -- but the Color constructor only wants integers, so manually use 0 for these 3 values instead of the existing ones)
    projectile:SetColor(newColor, 0, 0, true, true)
  end
end

-- Nosferatu Baby
PostProjectileUpdate.functions[109] = function(projectile)
  -- Enemies have homing projectiles
  if projectile.SpawnerType ~= EntityType.ENTITY_MOMS_HEART and -- 78
     projectile.SpawnerType ~= EntityType.ENTITY_ISAAC then -- 102

    projectile:AddProjectileFlags(ProjectileFlags.SMART) -- 1
  end
end

-- Sorrow Baby
PostProjectileUpdate.functions[153] = function(projectile)
  -- Projectiles are reflected as bombs
  if projectile.Position:Distance(g.p.Position) <= g.babies[153].distance then
    Isaac.Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_NORMAL, 0, -- 4.1
                projectile.Position, projectile.Velocity * -1, nil)
    projectile:Remove()
  end
end

-- Onion Baby
PostProjectileUpdate.functions[224] = function(projectile)
  local data = projectile:GetData()
  if data.spedUp == nil and
     projectile.SpawnerType ~= EntityType.ENTITY_MOMS_HEART and -- 78
     projectile.SpawnerType ~= EntityType.ENTITY_ISAAC then -- 102

    data.spedUp = true
    projectile.Velocity = projectile.Velocity * 2
  end
end

-- Eye Demon Baby
PostProjectileUpdate.functions[280] = function(projectile)
  local data = projectile:GetData()
  if data.modified == nil then
    data.modified = true
    projectile:AddProjectileFlags(ProjectileFlags.CONTINUUM) -- 1 << 30
    projectile.Height = projectile.Height * 2
  end
end

-- Fireball Baby
PostProjectileUpdate.functions[318] = function(projectile)
  -- Prevent fires from shooting
  -- (this cannot be done in the MC_POST_PROJECTILE_INIT callback since "projectile.SpawnerType" is empty)
  if projectile.FrameCount == 1 and
     projectile.SpawnerType == EntityType.ENTITY_FIREPLACE then -- 33

    projectile:Remove()
  end
end

-- 404 Baby
PostProjectileUpdate.functions[463] = function(projectile)
  if projectile.FrameCount == 1 then
    Misc:SetRandomColor(projectile)
  end
end

return PostProjectileUpdate
