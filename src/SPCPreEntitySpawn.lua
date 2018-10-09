local SPCPreEntitySpawn = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_PRE_ENTITY_SPAWN (24)
function SPCPreEntitySpawn:Main(type, variant, subType, position, velocity, spawner, seed)
  -- Local variables
  local babyType = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[babyType]
  if baby == nil then
    return
  end

  if type == EntityType.ENTITY_SLOT and
     SPCGlobals.run.clockworkAssembly then

    SPCGlobals.run.clockworkAssembly = false
    return { type, 10, subType, seed }
  end

  if baby.name == "Purple Baby" and -- 252
     type == EntityType.ENTITY_FIREPLACE and -- 33
     variant ~= 2 then -- Blue Fire Place

    return { type, 2, subType, seed }
  end
end

return SPCPreEntitySpawn
