local SPCUseCard = {}

-- Includes
local SPCPostRender = require("src/spcpostrender")

-- Card.CARD_EMPRESS (4)
function SPCUseCard:Card4(card)
  -- Using an Empress card will give us the Whore of Babylon costume, so we have to update the sprite
  SPCPostRender:SetPlayerSprite()
end

-- Card.CARD_HANGED_MAN (13)
function SPCUseCard:Card13(card)
  -- Using a Hanged Man card gives us flight, so we have to update the sprite
  SPCPostRender:SetPlayerSprite()
end

return SPCUseCard
