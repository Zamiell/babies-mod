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
         inputHook == InputHook.IS_ACTION_PRESSED and -- 0
         -- (the shoot inputs can be on all 3 of the input hooks)
         (buttonAction == ButtonAction.ACTION_SHOOTLEFT or -- 4
          buttonAction == ButtonAction.ACTION_SHOOTRIGHT or -- 5
          buttonAction == ButtonAction.ACTION_SHOOTUP or -- 6
          buttonAction == ButtonAction.ACTION_SHOOTDOWN) then

    -- Can't shoot while moving
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

    -- Find out if we are moving
    local threshold = 0.75
    if player.Velocity.X > threshold or
       player.Velocity.X < threshold * -1 or
       player.Velocity.Y > threshold or
       player.Velocity.Y < threshold * -1 then

      return false
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
