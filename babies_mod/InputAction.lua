local InputAction = {}

-- Different actions occur on different inputHooks and this is not documented
-- Thus, each action's particular inputHook must be determined through trial and error
-- Also note that we can't use cached API functions in this callback or else the game will crash

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_INPUT_ACTION (13)
function InputAction:Main(entity, inputHook, buttonAction)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = InputAction.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(inputHook, buttonAction)
  end
end

-- The collection of functions for each baby
InputAction.functions = {}

-- Masked Baby
InputAction.functions[115] = function(inputHook, buttonAction)
  if (
    -- The shoot inputs can be on all 3 of the input hooks
    inputHook == InputHook.IS_ACTION_PRESSED -- 0
    and (
      buttonAction == ButtonAction.ACTION_SHOOTLEFT -- 4
      or buttonAction == ButtonAction.ACTION_SHOOTRIGHT -- 5
      or buttonAction == ButtonAction.ACTION_SHOOTUP -- 6
      or buttonAction == ButtonAction.ACTION_SHOOTDOWN -- 7
    )
  ) then
    -- Can't shoot while moving
    -- This ability does not interact well with charged items,
    -- so don't do anything if the player has a charged item
    local player = Game():GetPlayer(0)
    if (
      player:HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) -- 69
      or player:HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) -- 114
      or player:HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) -- 118
      or player:HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) -- 229
      or player:HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) -- 316
      or player:HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) -- 395
      or player:HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID) -- 399
    ) then
      return
    end

    -- Find out if we are moving
    local threshold = 0.75
    if (
      player.Velocity.X > threshold
      or player.Velocity.X < threshold * -1
      or player.Velocity.Y > threshold
      or player.Velocity.Y < threshold * -1
    ) then
      return false
    end
  end
end

-- Piece A Baby
InputAction.functions[179] = function(inputHook, buttonAction)
  -- Can only move up + down + left + right
  if (
    buttonAction == ButtonAction.ACTION_LEFT -- 0
    and (
      InputAction:IsPressed(ButtonAction.ACTION_UP) -- 2
      or InputAction:IsPressed(ButtonAction.ACTION_DOWN) -- 3
    )
  ) then
    return 0
  elseif (
    buttonAction == ButtonAction.ACTION_RIGHT -- 1
    and (
      InputAction:IsPressed(ButtonAction.ACTION_UP) -- 2
      or InputAction:IsPressed(ButtonAction.ACTION_DOWN) -- 3
    )
  ) then
    return 0
  elseif (
    buttonAction == ButtonAction.ACTION_UP -- 2
    and (
      InputAction:IsPressed(ButtonAction.ACTION_LEFT) -- 0
      or InputAction:IsPressed(ButtonAction.ACTION_RIGHT) -- 1
    )
  ) then
    return 0
  elseif (
    buttonAction == ButtonAction.ACTION_DOWN -- 3
    and (
      InputAction:IsPressed(ButtonAction.ACTION_LEFT) -- 0
      or InputAction:IsPressed(ButtonAction.ACTION_RIGHT) -- 1
    )
  ) then
    return 0
  end
end

-- Imp Baby
InputAction.functions[386] = function(inputHook, buttonAction)
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

function InputAction:IsPressed(action)
  for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
    if Input.IsActionPressed(action, i) then
      return true
    end
  end
  return false
end

return InputAction
