local SPCPostNewRoom = {}

--
-- Includes
--

local SPCGlobals    = require("src/spcglobals")
local SPCPostRender = require("src/spcpostrender")

-- ModCallbacks.MC_POST_GAME_STARTED (15)
function SPCPostNewRoom:Main()
  Isaac.DebugString("MC_POST_NEW_ROOM")

  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomClear = room:IsClear()

  -- Reset room variables
  SPCGlobals.run.roomClear = roomClear

  -- Reset the player's sprite, just in case it got messed up
  SPCPostRender:SetPlayerSprite()

  -- Stop drawing the baby intro text once the player goes into a new room
  if SPCGlobals.run.drawIntro then
    SPCGlobals.run.drawIntro = false
  end
end

return SPCPostNewRoom
