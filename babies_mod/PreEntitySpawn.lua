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

  if (
    entityType == EntityType.ENTITY_SLOT -- 6
    and g.run.clockworkAssembly
  ) then
    g.run.clockworkAssembly = false
    return { entityType, 10, subType, seed }
  end

  if (
    baby.name == "Purple Baby" -- 252
    and entityType == EntityType.ENTITY_FIREPLACE -- 33
    and variant ~= 2 -- Blue Fire Place
  ) then
    return { entityType, 2, subType, seed }
  end
end

return PreEntitySpawn
