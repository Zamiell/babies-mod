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
     SPCGlobals.run.factoryBabySpawning then

    SPCGlobals.run.factoryBabySpawning = false
    return {
      type,
      10,
      subType,
      seed,
    }
  end
end

return SPCPreEntitySpawn
