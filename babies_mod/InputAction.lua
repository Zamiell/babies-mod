local InputAction = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_INPUT_ACTION (13)
function InputAction:Main(entity, inputHook, buttonAction)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Masked Baby" and -- 115
     inputHook == InputHook.IS_ACTION_PRESSED and -- 0
     -- (the shoot inputs can be on all 3 of the input hooks)
     (buttonAction == ButtonAction.ACTION_SHOOTLEFT or -- 4
      buttonAction == ButtonAction.ACTION_SHOOTRIGHT or -- 5
      buttonAction == ButtonAction.ACTION_SHOOTUP or -- 6
      buttonAction == ButtonAction.ACTION_SHOOTDOWN) then

    -- Can't shoot while moving
    -- This ability does not interact well with charged items,
    -- so don't do anything if the player has a charged item
    if g.p:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) or -- 69
       g.p:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) or -- 114
       g.p:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) or -- 118
       g.p:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) or -- 229
       g.p:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) or -- 316
       g.p:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) or -- 395
       g.p:HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID) then -- 399

      return
    end

    -- Find out if we are moving
    local threshold = 0.75
    if g.p.Velocity.X > threshold or
       g.p.Velocity.X < threshold * -1 or
       g.p.Velocity.Y > threshold or
       g.p.Velocity.Y < threshold * -1 then

      return false
    end

  elseif baby.name == "Piece A Baby" then -- 179
    -- Can only move up + down + left + right
    if buttonAction == ButtonAction.ACTION_LEFT and -- 0
       (InputAction:IsPressed(ButtonAction.ACTION_UP) or -- 2
        InputAction:IsPressed(ButtonAction.ACTION_DOWN)) then -- 3

      return 0

    elseif buttonAction == ButtonAction.ACTION_RIGHT and -- 1
           (InputAction:IsPressed(ButtonAction.ACTION_UP) or -- 2
            InputAction:IsPressed(ButtonAction.ACTION_DOWN)) then -- 3

      return 0

    elseif buttonAction == ButtonAction.ACTION_UP and -- 2
           (InputAction:IsPressed(ButtonAction.ACTION_LEFT) or -- 0
            InputAction:IsPressed(ButtonAction.ACTION_RIGHT)) then -- 1

      return 0

    elseif buttonAction == ButtonAction.ACTION_DOWN and -- 3
           (InputAction:IsPressed(ButtonAction.ACTION_LEFT) or -- 0
            InputAction:IsPressed(ButtonAction.ACTION_RIGHT)) then -- 1

      return 0
    end

  elseif baby.name == "Imp Baby" then -- 386
    -- Blender + flight + explosion immunity + blindfolded
    -- ButtonAction.ACTION_SHOOTLEFT (4)
    -- ButtonAction.ACTION_SHOOTRIGHT (5)
    -- ButtonAction.ACTION_SHOOTUP (6)
    -- ButtonAction.ACTION_SHOOTDOWN (7)
    local direction = g.run.babyCounters

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

function InputAction:IsPressed(action)
  for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
    if Input.IsActionPressed(action, i) then
      return true
    end
  end
  return false
end

return InputAction
