local SPCUseItem = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- CollectibleType.COLLECTIBLE_HOW_TO_JUMP (282)
function SPCUseItem:Item282(collectibleType, RNG)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Rabbit Baby" then -- 350
    SPCGlobals.run.babyFrame = gameFrameCount + baby.num
  end
end

function SPCUseItem:ClockworkAssembly(collectibleType, RNG)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Spawn a Restock Machine (6.10)
  SPCGlobals.run.clockworkAssembly = true
  player:UseCard(Card.CARD_WHEEL_OF_FORTUNE) -- 11
  player:AnimateCollectible(Isaac.GetItemIdByName("Clockwork Assembly"), "UseItem", "PlayerPickup")
end

function SPCUseItem:FlockOfSuccubi(collectibleType, RNG)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local effects = player:GetEffects()

  -- Spawn 10 temporary Succubi
  -- (for some reason, adding 7 actually adds 28)
  for i = 1, 7 do
    effects:AddCollectibleEffect(CollectibleType.COLLECTIBLE_SUCCUBUS, false)
  end
  player:AnimateCollectible(Isaac.GetItemIdByName("Flock of Succubi"), "UseItem", "PlayerPickup")
end

return SPCUseItem
