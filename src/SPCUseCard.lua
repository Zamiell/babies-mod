local SPCUseCard = {}

-- Includes
local SPCPostRender = require("src/spcpostrender")

-- ModCallbacks.MC_USE_CARD (5)
-- Card.CARD_EMPRESS (4)
function SPCUseCard:Card4(card)
  SPCPostRender:SetPlayerSprite()
end

return SPCUseCard
