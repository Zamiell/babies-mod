local SPCPostRender  = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCTimer   = require("src/spctimer")

-- ModCallbacks.MC_POST_RENDER (2)
function SPCPostRender:Main()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  player:RenderShadowLayer(Vector(100, 100))

  -- Remove extra costumes while the game is fading in and/or loading
  if gameFrameCount == 0 then
    player:ClearCostumes()
  end

  -- Fix the graphical glitch with some items that apply special costumes
  -- (this won't work in the MC_POST_UPDATE callback)
  if roomFrameCount <= 1 and
     (player:HasCollectible(CollectibleType.COLLECTIBLE_SCAPULAR) or -- 142
      player:HasCollectible(CollectibleType.COLLECTIBLE_PURITY)) then -- 407

    player:ClearCostumes()
  end
  if roomFrameCount == 0 and
     player:HasCollectible(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON) then -- 122

    SPCPostRender:SetPlayerSprite()
  end

  SPCPostRender:TrackPlayerAnimations()
  SPCPostRender:DrawBabyIntro()
  SPCPostRender:DrawBabyEffects()
  SPCTimer:Display()
end

function SPCPostRender:TrackPlayerAnimations()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local playerSprite = player:GetSprite()
  local effects = player:GetEffects()
  local effectsList = effects:GetEffectsList()
  local itemConfig = Isaac.GetItemConfig()

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

      -- Doing this will remove a shield, so detect if there is a shield and then add it back if so
      for i = 1, effectsList.Size do
        local effect = effectsList:Get(i - 1)
        if effect.Item.ID == CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS then -- 58
          --effects:AddCollectibleEffect(CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS, true) -- 58
          local configItem = itemConfig:GetCollectible(CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS) -- 58
          player:AddCostume(configItem, false)
          break
        end
      end
    end
  end
end

-- This is called at the beginning of a level, after each item is applied, after a death,
-- and after an animation is played
function SPCPostRender:SetPlayerSprite()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local activeItem = player:GetActiveItem()
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

  -- Make exceptions for certain costumes
  if baby.name == "Rider Baby" and
     activeItem == CollectibleType.COLLECTIBLE_PONY then -- 130

    player:AddCollectible(CollectibleType.COLLECTIBLE_PONY, 4, false) -- 130
  end
end

-- Show what the current baby does in the intro room (or if the player presses Tab)
function SPCPostRender:DrawBabyIntro()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  local tabPressed = false
  for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
    if Input.IsActionPressed(ButtonAction.ACTION_MAP, i) then -- 13
      tabPressed = true
      break
    end
  end

  if gameFrameCount >= SPCGlobals.run.currentFloorFrame + 60 and
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

function SPCPostRender:DrawBabyEffects()
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  if baby.name == "Elf Baby" then -- 377
    -- The Speak of Destiny effect is not spawned in the POST_NEW_ROOM callback
    -- Thus, we check for it on every frame instead
    -- As an unfortunate side effect, the Spear of Destiny will show as the vanilla graphic during room transitions
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      if entity.Type == EntityType.ENTITY_EFFECT and -- 1000
         entity.Variant == EffectVariant.SPEAR_OF_DESTINY and -- 83
         entity:GetSprite():GetFilename() == "gfx/1000.083_Spear Of Destiny.anm2" then

        local sprite = entity:GetSprite()
        sprite:Load("gfx/1000.083_spear of destiny2.anm2", true)
        sprite:Play("Idle", true)
      end
    end
  end
end

-- Taken from Alphabirth: https://steamcommunity.com/sharedfiles/filedetails/?id=848056541
function SPCPostRender:GetScreenCenterPosition()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local shape = room:GetRoomShape()
  local centerOffset = (room:GetCenterPos()) - room:GetTopLeftPos()
  local pos = room:GetCenterPos()

  if centerOffset.X > 260 then
      pos.X = pos.X - 260
  end
  if shape == RoomShape.ROOMSHAPE_LBL or shape == RoomShape.ROOMSHAPE_LTL then
      pos.X = pos.X - 260
  end
  if centerOffset.Y > 140 then
      pos.Y = pos.Y - 140
  end
  if shape == RoomShape.ROOMSHAPE_LTR or shape == RoomShape.ROOMSHAPE_LTL then
      pos.Y = pos.Y - 140
  end

  return Isaac.WorldToRenderPosition(pos, false)
end

return SPCPostRender
