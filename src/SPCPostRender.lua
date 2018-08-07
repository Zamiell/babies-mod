local SPCPostRender  = {}

--
-- Includes
--

local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_RENDER (2)
function SPCPostRender:Main()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  -- Remove extra costumes while the game is fading in and/or loading
  if gameFrameCount == 0 then
    player:ClearCostumes()
  end

  SPCPostRender:TrackPlayerAnimations()
  SPCPostRender:DrawBabyIntro()
end

function SPCPostRender:TrackPlayerAnimations()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local playerSprite = player:GetSprite()
  local frameCount = Isaac.GetFrameCount()

  -- Get the currently playing animation
  local animations = {
    "Pickup",
    "Hit",
    "Sad",
    "Happy",
    "PickupWalkDown",
    "PickupWalkLeft",
    "PickupWalkUp",
    "PickupWalkRight",
  }
  local animation = ""
  for i = 1, #animations do
    if playerSprite:IsPlaying(animations[i]) then
      animation = animations[i]
      break
    end
  end

  -- Set if the animation has changed
  -- PickupWalkDown should be treated the same as PickupWalkLeft, so get the prefixes
  local prefix1 = string.sub(animation, 0, 10)
  local prefix2 = string.sub(SPCGlobals.run.animation, 0, 10)
  if prefix1 ~= prefix2 then
    SPCGlobals.run.animation = animation

    -- Certain animations will mess up the player's sprite when certain items are in the inventory
    -- (Brimstone, Ipecac, etc.)
    if animation ~= "" then
      SPCPostRender:SetPlayerSprite()
      playerSprite:Play(animation, false)
      --[[
      Isaac.DebugString("Reverted the sprite. (Triggered by animation " .. animation ..
                        " on frame " .. tostring(frameCount) .. ".)")
      --]]
    end
  end
end

-- This is called at the beginning of a level, after each item is applied, after a death,
-- and after an animation is played
function SPCPostRender:SetPlayerSprite()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local playerSprite = player:GetSprite()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- Since this code is called from various places, we might not have a baby initialized yet
  if baby == nil then
    return
  end

  -- Replace the player sprite with a co-op baby version
  playerSprite:Load("gfx/co-op/" .. tostring(type) .. ".anm2", true)

  -- We don't want any costumes to apply to co-op babies, since they will appear misaligned
  player:ClearCostumes()
end

-- Show what the current baby does in the intro room (or if the player presses Tab)
function SPCPostRender:DrawBabyIntro()
  local tabPressed = false
  for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
    if Input.IsActionPressed(ButtonAction.ACTION_MAP, i) then -- 13
      tabPressed = true
      break
    end
  end

  if SPCGlobals.run.drawIntro == false and
     tabPressed == false then

    return
  end

  local type = SPCGlobals.run.babyType
  local center = SPCPostRender:GetScreenCenterPosition()
  local text, scale, x, y

  -- Render the baby's name
  text = SPCGlobals.babies[type].name
  scale = 1.75
  x = center.X - 3 * scale * #text
  y = center.Y - 80
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2)

  -- Render the baby's description
  text = SPCGlobals.babies[type].description
  scale = 1
  x = center.X - 3 * scale * #text
  y = center.Y - 55
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2)
end

-- Taken from Alphabirth: https://steamcommunity.com/sharedfiles/filedetails/?id=848056541
function SPCPostRender:GetScreenCenterPosition()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local centerOffset = (room:GetCenterPos()) - room:GetTopLeftPos()
  local pos = room:GetCenterPos()

  if centerOffset.X > 260 then
    pos.X = pos.X - 260
  end
  if centerOffset.Y > 140 then
    pos.Y = pos.Y - 140
  end

  return Isaac.WorldToRenderPosition(pos, false)
end

return SPCPostRender
