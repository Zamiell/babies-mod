local SPCPostPickupSelection = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_PICKUP_SELECTION (37)
function SPCPostPickupSelection:Main(pickup, variant, subType)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Gem Baby" and -- 237
     variant == PickupVariant.PICKUP_COIN and -- 20
     subType == 1 then -- Penny

    return {
      PickupVariant.PICKUP_COIN, -- 20
      2, -- Nickle
    }
  end
end

return SPCPostPickupSelection
