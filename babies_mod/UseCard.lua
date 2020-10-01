local UseCard = {}

-- Includes
local PostRender = require("babies_mod/postrender")

-- Card.CARD_EMPRESS (4)
function UseCard:Card4(card)
  -- Using an Empress card will give us the Whore of Babylon costume,
  -- so we have to update the sprite
  PostRender:SetPlayerSprite()
end

-- Card.CARD_HANGED_MAN (13)
function UseCard:Card13(card)
  -- Using a Hanged Man card gives us flight, so we have to update the sprite
  PostRender:SetPlayerSprite()
end

return UseCard
