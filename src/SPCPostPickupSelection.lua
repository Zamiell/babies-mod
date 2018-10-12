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

  --Isaac.DebugString("MC_POST_PICKUP_SELECTION - " .. tostring(variant) .. "." .. tostring(subType))

  if baby.name == "Gem Baby" and -- 237
     variant == PickupVariant.PICKUP_COIN and -- 20
     subType == 1 then -- Penny

    -- 5.20.2 - Nickel
    return { PickupVariant.PICKUP_COIN, 2 }

  elseif baby.name == "Merman Baby" and -- 342
         variant == PickupVariant.PICKUP_KEY then -- 30

    -- Convert all keys to bombs
    return { PickupVariant.PICKUP_BOMB, subType } -- 40

  elseif baby.name == "Mermaid Baby" and -- 395
         variant == PickupVariant.PICKUP_BOMB then -- 40

    -- There is a subType of 5 for bombs but not for keys
    if subType == 5 then
      subType = 1
    end

    -- Convert all bombs to keys
    return { PickupVariant.PICKUP_KEY, subType } -- 30
  end
end

return SPCPostPickupSelection
