local PostPlayerInit = {}

-- Includes
local g = require("babies_mod/globals")

function PostPlayerInit:Main(player)
  Isaac.DebugString("MC_POST_PLAYER_INIT (BM)")

  -- We don't care if this is a co-op baby
  if player.Variant ~= 0 then
    return
  end

  -- Cache the player object so that we don't have to repeatedly call Game():GetPlayer(0)
  g.p = player
end

return PostPlayerInit
