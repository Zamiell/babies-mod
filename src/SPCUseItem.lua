local SPCUseItem = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_USE_ITEM (3)
function SPCUseItem:ClockworkAssembly(collectibleType, RNG)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Spawn a Restock Machine (6.10)
  SPCGlobals.run.factoryBabySpawning = true
  player:UseCard(Card.CARD_WHEEL_OF_FORTUNE) -- 11
end

return SPCUseItem
