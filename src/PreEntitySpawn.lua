local PreEntitySpawn = {}

-- Includes
local g = require("src/globals")

-- ModCallbacks.MC_PRE_ENTITY_SPAWN (24)
function PreEntitySpawn:Main(type, variant, subType, position, velocity, spawner, seed)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  if type == EntityType.ENTITY_SLOT and
     g.run.clockworkAssembly then

    g.run.clockworkAssembly = false
    return { type, 10, subType, seed }
  end

  if baby.name == "Purple Baby" and -- 252
     type == EntityType.ENTITY_FIREPLACE and -- 33
     variant ~= 2 then -- Blue Fire Place

    return { type, 2, subType, seed }
  end
end

return PreEntitySpawn
