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

  if baby.name == "Makeup Baby" and -- 99
     (buttonAction == ButtonAction.ACTION_LEFT or -- 0
      buttonAction == ButtonAction.ACTION_RIGHT or -- 1
      buttonAction == ButtonAction.ACTION_UP or -- 2
      buttonAction == ButtonAction.ACTION_DOWN) then -- 3

    -- Backwards movement
    for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
      local value = Input.GetActionValue(buttonAction, i)
      if value ~= 0 then
        return value * -1
      end
    end

  elseif baby.name == "Masked Baby" and -- 115
         inputHook == InputHook.IS_ACTION_PRESSED then -- 0
         -- (the shoot inputs can be on all 3 of the input hooks)

    -- This ability does not interact well with charged items,
    -- so don't do anything if the player has a charged item
    local player = game:GetPlayer(0)
    if player:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) or -- 69
       player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) or -- 114
       player:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) or -- 118
       player:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) or -- 229
       player:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) or -- 316
       player:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) or -- 395
       player:HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID) then -- 399

      return
    end

    -- Can't shoot while moving
    if buttonAction == ButtonAction.ACTION_SHOOTLEFT then -- 4
      for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
        if Input.IsActionPressed(ButtonAction.ACTION_LEFT, i) then -- 0
          return false
        end
      end
    elseif buttonAction == ButtonAction.ACTION_SHOOTRIGHT then -- 5
      for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
        if Input.IsActionPressed(ButtonAction.ACTION_RIGHT, i) then -- 1
          return false
        end
      end
    elseif buttonAction == ButtonAction.ACTION_SHOOTUP then -- 6
      for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
        if Input.IsActionPressed(ButtonAction.ACTION_UP, i) then -- 2
          return false
        end
      end
    elseif buttonAction == ButtonAction.ACTION_SHOOTDOWN then -- 7
      for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
        if Input.IsActionPressed(ButtonAction.ACTION_DOWN, i) then -- 3
          return false
        end
      end
    end

  elseif baby.name == "Piece A Baby" then -- 179
    -- Can only move up + down + left + right
    if buttonAction == ButtonAction.ACTION_LEFT and -- 0
       (SPCInputAction:IsPressed(ButtonAction.ACTION_UP) or -- 2
        SPCInputAction:IsPressed(ButtonAction.ACTION_DOWN)) then -- 3

      return 0

    elseif buttonAction == ButtonAction.ACTION_RIGHT and -- 1
           (SPCInputAction:IsPressed(ButtonAction.ACTION_UP) or -- 2
            SPCInputAction:IsPressed(ButtonAction.ACTION_DOWN)) then -- 3

      return 0

    elseif buttonAction == ButtonAction.ACTION_UP and -- 2
           (SPCInputAction:IsPressed(ButtonAction.ACTION_LEFT) or -- 0
            SPCInputAction:IsPressed(ButtonAction.ACTION_RIGHT)) then -- 1

      return 0

    elseif buttonAction == ButtonAction.ACTION_DOWN and -- 3
           (SPCInputAction:IsPressed(ButtonAction.ACTION_LEFT) or -- 0
            SPCInputAction:IsPressed(ButtonAction.ACTION_RIGHT)) then -- 1

      return 0
    end

  elseif baby.name == "Rabbit Baby" and -- 350
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
  end
end

function SPCInputAction:IsPressed(action)
  for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
    if Input.IsActionPressed(action, i) then
      return true
    end
  end
  return false
end

return SPCInputAction
