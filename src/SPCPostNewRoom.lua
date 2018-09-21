local SPCPostNewRoom = {}

-- Includes
local SPCGlobals    = require("src/spcglobals")
local SPCPostRender = require("src/spcpostrender")

-- ModCallbacks.MC_POST_NEW_ROOM (19)
function SPCPostNewRoom:Main()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local level = game:GetLevel()
  local stage = level:GetStage()
  local stageType = level:GetStageType()

  Isaac.DebugString("MC_POST_NEW_ROOM (SPC)")

  -- Make sure the callbacks run in the right order
  -- (naturally, PostNewRoom gets called before the PostNewLevel and PostGameStarted callbacks)
  if gameFrameCount == 0 or
     (SPCGlobals.run.currentFloor ~= stage or
      SPCGlobals.run.currentFloorType ~= stageType) then

    return
  end

  SPCPostNewRoom:NewRoom()
end

function SPCPostNewRoom:NewRoom()
  -- Local variabbles
  local game = Game()
  local room = game:GetRoom()
  local roomClear = room:IsClear()

  Isaac.DebugString("MC_POST_NEW_ROOM2 (SPC)")

  -- Reset room variables
  SPCGlobals.run.roomClear = roomClear

  -- Do nothing if we are not a baby
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- Reset the player's sprite, just in case it got messed up
  SPCPostRender:SetPlayerSprite()

  -- Stop drawing the baby intro text once the player goes into a new room
  if SPCGlobals.run.drawIntro then
    SPCGlobals.run.drawIntro = false
  end

  SPCPostNewRoom:ApplyTemporaryEffects()
end

function SPCPostNewRoom:ApplyTemporaryEffects()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local effects = player:GetEffects()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- Apply baby-specific temporary effects
  if baby.name == "Belial Baby" then
    effects:AddCollectibleEffect(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL, false) -- 34

  elseif baby.name == "Butterfly Baby 2" then -- 332
    player.GridCollisionClass = 0
  end
end

return SPCPostNewRoom
