local SPCInputAction = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_INPUT_ACTION (13)
function SPCInputAction:Main(entity, inputHook, buttonAction)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Rabbit Baby" and -- 350
     gameFrameCount >= SPCGlobals.run.babyFrame and
     (buttonAction == ButtonAction.ACTION_LEFT or -- 0
      buttonAction == ButtonAction.ACTION_RIGHT or -- 1
      buttonAction == ButtonAction.ACTION_UP or -- 2
      buttonAction == ButtonAction.ACTION_DOWN) then -- 3

    -- Starts with How to Jump; must jump often
    -- These actions are part of InputHook.GET_ACTION_VALUE (2)
    return 0

  elseif baby.name == "Imp Baby" then -- 386
    -- ButtonAction.ACTION_SHOOTLEFT (4)
    -- ButtonAction.ACTION_SHOOTRIGHT (5)
    -- ButtonAction.ACTION_SHOOTUP (6)
    -- ButtonAction.ACTION_SHOOTDOWN (7)
    local direction = SPCGlobals.run.babyCounters

    -- We need to swap right and up
    if direction == 5 then
      direction = 6
    elseif direction == 6 then
      direction = 5
    end

    -- Make the player face in this direction
    if buttonAction == direction then
      return 1
    end

  elseif baby.name == "Red Wrestler Baby" and -- 389
     SPCGlobals.run.babyBool and
     inputHook == InputHook.IS_ACTION_TRIGGERED and -- 1
     buttonAction == ButtonAction.ACTION_PILLCARD then -- 10

    -- Automatically use pills
    SPCGlobals.run.babyBool = false
    return true
  end
end

return SPCInputAction
