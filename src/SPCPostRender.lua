local SPCPostRender  = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCTimer   = require("src/spctimer")

-- Variables
SPCPostRender.clockSprite = nil

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

  -- Remove extra costumes while the game is fading in and/or loading
  if gameFrameCount == 0 then
    player:ClearCostumes()
  end

  -- Fix the graphical glitch with some items that apply special costumes
  -- (this won't work in the MC_POST_UPDATE callback)
  if roomFrameCount <= 1 and
     (player:HasCollectible(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON) or -- 122
      player:HasCollectible(CollectibleType.COLLECTIBLE_SCAPULAR) or -- 142
      player:HasCollectible(CollectibleType.COLLECTIBLE_TAURUS) or -- 299
      player:HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID) or -- 399
      player:HasCollectible(CollectibleType.COLLECTIBLE_PURITY) or -- 407
      player:HasCollectible(CollectibleType.COLLECTIBLE_EMPTY_VESSEL)) then -- 409

    SPCPostRender:SetPlayerSprite()
  end

  SPCPostRender:TrackPlayerAnimations()
  SPCPostRender:DrawBabyIntro()
  SPCPostRender:DrawBabyNumber()
  SPCPostRender:DrawVersion()
  SPCPostRender:DrawBabyEffects()
  SPCPostRender:DrawTempIcon()
  SPCTimer:Display()

  -- Draw the black screen, if necessary
  if SPCGlobals.run.blackSprite ~= nil then
    SPCGlobals.run.blackSprite:RenderLayer(0, Vector(0, 0))
  end
end

function SPCPostRender:TrackPlayerAnimations()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local playerSprite = player:GetSprite()

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
      --[[
      local gameFrameCount = game:GetFrameCount()
      Isaac.DebugString("Reverting the sprite. (Triggered by animation " .. animation ..
                        " on frame " .. tostring(gameFrameCount) .. ".)")
      --]]
      SPCPostRender:SetPlayerSprite()
      playerSprite:Play(animation, false)
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
  local effects = player:GetEffects()
  local effectsList = effects:GetEffectsList()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- We don't want any costumes to apply to co-op babies, since they will appear misaligned
  player:ClearCostumes()

  -- Make exceptions for certain costumes
  if player:HasCollectible(CollectibleType.COLLECTIBLE_DADS_RING) then -- 546
    player:AddCostume(SPCGlobals:GetItemConfig(CollectibleType.COLLECTIBLE_DADS_RING), false) -- 546
  end
  -- (for some reason, Empty Vessel makes the sprite flicker when playing certain animations;
  -- there is no known workaround for this)

  -- It is hard to tell that the player can fly with all costumes removed,
  -- so represent that the player has flight with Fate's wings
  if player.CanFly then
    player:AddCostume(SPCGlobals:GetItemConfig(CollectibleType.COLLECTIBLE_FATE), false) -- 179
  end

  -- Doing this will remove a shield, so detect if there is a shield and then add it back if so
  for i = 1, effectsList.Size do
    local effect = effectsList:Get(i - 1)
    if effect.Item.ID == CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS then -- 58
      player:AddCostume(SPCGlobals:GetItemConfig(CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS), false) -- 58
      break
    end
  end

  -- Replace the player sprite with a co-op baby version
  playerSprite:Load("gfx/co-op/" .. tostring(type) .. ".anm2", true)

  --Isaac.DebugString("Set the baby sprite.")
end

-- Show what the current baby does in the intro room (or if the player presses Tab)
function SPCPostRender:DrawBabyIntro()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

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

  local center = SPCPostRender:GetScreenCenterPosition()
  local text, scale, x, y

  -- Render the baby's name
  text = baby.name
  scale = 1.75
  x = center.X - 3 * scale * #text
  y = center.Y - 80
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2)

  -- Render the baby's description
  text = baby.description
  x = center.X - 3 * #text
  y = center.Y - 55
  Isaac.RenderText(text, x, y, 2, 2, 2, 2)

  -- The description might be really long and spill over onto a second line
  if baby.description2 ~= nil then
    text = baby.description2
    x = center.X - 3 * #text
    y = center.Y - 40
    Isaac.RenderText(text, x, y, 2, 2, 2, 2)
  end
end

-- Draw the baby's number next to the heart count
function SPCPostRender:DrawBabyNumber()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  local text = "#" .. type
  local x = 55 + SPCPostRender:GetHeartXOffset()
  local y = 10
  Isaac.RenderText(text, x, y, 2, 2, 2, 2)
end

-- Copied from the Racing+ mod
function SPCPostRender:GetHeartXOffset()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local maxHearts = player:GetMaxHearts()
  local soulHearts = player:GetSoulHearts()
  local boneHearts = player:GetBoneHearts()
  local extraLives = player:GetExtraLives()

  local heartLength = 12 -- This is how long each heart is on the UI in the upper left hand corner
  -- (this is not in pixels, but in draw coordinates; you can see that it is 13 pixels wide in the "ui_hearts.png" file)
  local combinedHearts = maxHearts + soulHearts + (boneHearts * 2) -- There are no half bone hearts
  if combinedHearts > 12 then
    combinedHearts = 12 -- After 6 hearts, it wraps to a second row
  end

  local offset = (combinedHearts / 2) * heartLength
  if extraLives > 9 then
    offset = offset + 20
    if player:HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR) then -- 212
      offset = offset + 6
    end
  elseif extraLives > 0 then
    offset = offset + 16
    if player:HasCollectible(CollectibleType.COLLECTIBLE_GUPPYS_COLLAR) then -- 212
      offset = offset + 4
    end
  end

  return offset
end

function SPCPostRender:DrawVersion()
  if Input.IsButtonPressed(Keyboard.KEY_V, 0) == false then -- 86
    return
  end

  local center = SPCPostRender:GetScreenCenterPosition()
  local text, scale, x, y

  -- Render the version of the mod
  text = "The Babies Mod"
  scale = 1
  x = center.X - 3 * scale * #text
  y = center.Y
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2)

  text = SPCGlobals.version
  scale = 1
  x = center.X - 3 * scale * #text
  y = center.Y + 15
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2)
end

function SPCPostRender:DrawBabyEffects()
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local roomDesc = level:GetCurrentRoomDesc()
  local roomVariant = roomDesc.Data.Variant
  local room = game:GetRoom()
  local roomType = room:GetType()
  local player = game:GetPlayer(0)
  local bombs = player:GetNumBombs()
  local keys = player:GetNumKeys()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  if baby.name == "Hopeless Baby" and -- 125
     roomType ~= RoomType.ROOM_DEVIL and -- 14
     roomType ~= RoomType.ROOM_BLACK_MARKET and -- 22
     roomVariant ~= 2300 and -- Krampus
     roomVariant ~= 2301 and -- Krampus
     roomVariant ~= 2302 and -- Krampus
     roomVariant ~= 2303 and -- Krampus
     roomVariant ~= 2304 and -- Krampus
     roomVariant ~= 2305 and -- Krampus
     roomVariant ~= 2306 then -- Krampus

    SPCGlobals.run.babySprites:RenderLayer(0, Vector(65, 12))
    Isaac.RenderText("x" .. tostring(keys), 70, 12, 2, 2, 2, 2)

  elseif baby.name == "Mohawk Baby" and -- 138
         roomType ~= RoomType.ROOM_DEVIL and -- 14
         roomType ~= RoomType.ROOM_BLACK_MARKET and -- 22
         roomVariant ~= 2300 and -- Krampus
         roomVariant ~= 2301 and -- Krampus
         roomVariant ~= 2302 and -- Krampus
         roomVariant ~= 2303 and -- Krampus
         roomVariant ~= 2304 and -- Krampus
         roomVariant ~= 2305 and -- Krampus
         roomVariant ~= 2306 then -- Krampus

    SPCGlobals.run.babySprites:RenderLayer(0, Vector(65, 12))
    Isaac.RenderText("x" .. tostring(bombs), 70, 12, 2, 2, 2, 2)

  elseif baby.name == "Elf Baby" then -- 377
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

function SPCPostRender:DrawTempIcon()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- We want to draw a temporary icon next to the baby's active item
  -- to signify that it will go away at the end of the floor
  if baby.item == nil or
     SPCGlobals:GetItemConfig(baby.item).Type ~= ItemType.ITEM_ACTIVE then

    return
  end

  -- Initialize the sprite, if it is not already initialized`
  if SPCPostRender.clockSprite == nil then
    SPCPostRender.clockSprite = Sprite()
    SPCPostRender.clockSprite:Load("gfx/clock.anm2", true)
    SPCPostRender.clockSprite:SetFrame("Default", 0)
  end

  local clockX = 30
  local clockY = 30
  if player:HasCollectible(baby.item) then
    -- The player has the item in their main active slot
    -- Draw the icon in the bottom-right hand corner
    SPCPostRender.clockSprite:RenderLayer(0, Vector(clockX, clockY))

  elseif RacingPlusGlobals ~= nil and
         player:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM) and
         RacingPlusGlobals.run.schoolbag.item == baby.item then

    -- The player has the item in the Schoolbag
    -- Draw the icon in the bottom-right hand corner
    SPCPostRender.clockSprite:RenderLayer(0, Vector(clockX + 27, clockY + 32))
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
