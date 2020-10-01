local PostPickupSelection = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_POST_PICKUP_SELECTION (37)
function PostPickupSelection:Main(pickup, variant, subType)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostPickupSelection.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(pickup, variant, subType)
  end
end

-- The collection of functions for each baby
PostPickupSelection.functions = {}

-- Gem Baby
PostPickupSelection.functions[237] = function(pickup, variant, subType)
  if (
    variant == PickupVariant.PICKUP_COIN -- 20
    and subType == CoinSubType.COIN_PENNY -- 1
  ) then
    return { PickupVariant.PICKUP_COIN, CoinSubType.COIN_NICKEL }
  end
end

-- Merman Baby
PostPickupSelection.functions[342] = function(pickup, variant, subType)
  -- Convert all keys to bombs
  if variant == PickupVariant.PICKUP_KEY then -- 30
    return { PickupVariant.PICKUP_BOMB, subType } -- 40
    -- (just use the same SubType, so e.g. a charged key would be converted to a golden bomb)
  end
end

-- Mermaid Baby
PostPickupSelection.functions[395] = function(pickup, variant, subType)
  -- Convert all bombs to keys
  if variant == PickupVariant.PICKUP_BOMB then -- 40
    if subType == 5 then
      -- There is a subType of 5 for bombs but not for keys
      subType = 1
    end

    return { PickupVariant.PICKUP_KEY, subType } -- 30
    -- (just use the same SubType, so e.g. a golden bomb would be converted to a charged key)
  end
end

return PostPickupSelection
