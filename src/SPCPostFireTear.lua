local SPCPostFireTear = {}

--
-- Includes
--

local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_FIRE_TEAR (61)
function SPCPostFireTear:Main(tear)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Water Baby" and -- 3
     SPCGlobals.run.waterBabyTears > 0 then

    SPCGlobals.run.waterBabyTears = SPCGlobals.run.waterBabyTears - 1

    -- Make it look more impressive
    tear.Scale = 5
    tear.KnockbackMultiplier = 20

    -- We can't modify the damage ("BaseDamage" is a constant)
    -- We can improve the damage in the EntityTakeDmg callback
    -- Mark the tear for later (tears do not usually use SubTypes and we cannot use the "GetData()" function)
    tear.SubType = 1
  end
end

return SPCPostFireTear
