local SPCPreUseItem = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

function SPCPreUseItem:Item56(collectibleType, RNG)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Lemon Baby" then -- 232
    player:UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, PillColor.PILL_NULL) -- 26, 0
    return true -- Cancel the original effect
  end
end

function SPCPreUseItem:Item323(collectibleType, RNG)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Water Baby" then -- 3
    SPCGlobals.run.waterBabyTears = 8
  end
end

return SPCPreUseItem
