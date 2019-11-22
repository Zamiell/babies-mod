local PreEntitySpawn = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_PRE_ENTITY_SPAWN (24)
function PreEntitySpawn:Main(entityType, variant, subType, position, velocity, spawner, seed)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  if entityType == EntityType.ENTITY_SLOT and
     g.run.clockworkAssembly then

    g.run.clockworkAssembly = false
    return { entityType, 10, subType, seed }
  end

  if baby.name == "Purple Baby" and -- 252
     entityType == EntityType.ENTITY_FIREPLACE and -- 33
     variant ~= 2 then -- Blue Fire Place

    return { entityType, 2, subType, seed }
  end
end

return PreEntitySpawn
