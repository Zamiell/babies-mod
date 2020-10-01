local PostRender = {}

-- Includes
local g = require("babies_mod/globals")
local Timer = require("babies_mod/timer")

-- Variables
PostRender.clockSprite = nil

-- ModCallbacks.MC_POST_RENDER (2)
function PostRender:Main()
  -- Update some cached API functions to avoid crashing
  g.l = g.g:GetLevel()
  g.r = g.g:GetRoom()
  g.p = g.g:GetPlayer(0)
  g.seeds = g.g:GetSeeds()
  g.itemPool = g.g:GetItemPool()

  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  PostRender:CheckPlayerSprite()
  PostRender:DrawBabyIntro()
  PostRender:DrawBabyNumber()
  PostRender:DrawVersion()
  PostRender:DrawTempIcon()
  PostRender:DrawBabyEffects()
  Timer:Display()
end

-- This function handles redrawing the player's sprite, if necessary
function PostRender:CheckPlayerSprite()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local roomFrameCount = g.r:GetFrameCount()

  -- Remove extra costumes while the game is fading in and/or loading
  if gameFrameCount == 0 then
    g.p:ClearCostumes()
  end

  -- Fix the bug where fully charging Maw of the Void will occasionally make the player invisible
  if g.p:HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_VOID) then -- 399
    g.p:RemoveCostume(g:GetItemConfig(CollectibleType.COLLECTIBLE_MAW_OF_VOID)) -- 399
  end

  -- Certain costumes are applied one frame after entering a room
  if roomFrameCount == 0 then
    if g.p:HasCollectible(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON) then -- 122
      -- Even though we blanked out the costumes for Whore of Babylon,
      -- we also have to also remove the costume or else the player sprite will be invisible
      -- permanently
      g.p:RemoveCostume(g:GetItemConfig(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON)) -- 122
    end
    if g.p:HasCollectible(CollectibleType.COLLECTIBLE_EMPTY_VESSEL) then -- 409
      -- Even though we blanked out the costumes for Empty Vessel,
      -- we also have to also remove the costume or else the player sprite will be invisible
      -- permanently
      g.p:TryRemoveNullCostume(NullItemID.ID_EMPTY_VESSEL) -- 18
    end
  end

  --[[

  Certain costumes are loaded immediately after triggering a room transition and then they are
  locked in to the slide animation. The only way to fix this is to blank out the entire costume.
  This applies to:
  - Whore of Babylon (122) - costume_073_whoreofbabylon.png
  - Fate (179) - costume_179_fate.png & 6 others for each color
      The costume is not completely blanked out;
      only the body is removed so that we can add only the wings.
      We also need to modify the "179_fate.anm2" file so that we can swap the layer that the wings
      are applied to.
  - Anemic (214) - costume_214_anemic.png
  - Taurus (235) - costume_235_taurus.png & 6 others for each color
      The costume is only applied when entering a room for the first time.
  - Purity (407) - costume_407_purity.png
  - Empty Vessel (409) - emptyvessel body.png & emptyvessel head.png
  - Dad's Ring (546) - costume_546_dadsring.png
      The costume is applied one frame after entering the room, similar to Whore of Babylon.
      If we remove the costume in code, it also removes the ring, which we don't want,
      so we just blank out the costume.

  --]]

  PostRender:TrackPlayerAnimations()
end

function PostRender:TrackPlayerAnimations()
  -- Local variables
  local playerSprite = g.p:GetSprite()

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
  local prefix2 = string.sub(g.run.animation, 0, 10)
  if prefix1 ~= prefix2 then
    g.run.animation = animation

    -- Certain animations will mess up the player's sprite when certain items are in the inventory
    -- (Brimstone, Ipecac, etc.)
    if animation ~= "" then
      --[[
      local gameFrameCount = game:GetFrameCount()
      Isaac.DebugString(
        "Reverting the sprite. (Triggered by animation " .. animation .. " on frame "
        .. tostring(gameFrameCount) .. ".)"
      )
      --]]
      PostRender:SetPlayerSprite()
      playerSprite:Play(animation, false)
    end
  end
end

-- This is called at the beginning of a level, after each item is applied, after a death,
-- and after an animation is played
function PostRender:SetPlayerSprite()
  -- Local variables
  local playerSprite = g.p:GetSprite()
  local hearts = g.p:GetHearts()
  local effects = g.p:GetEffects()
  local effectsList = effects:GetEffectsList()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  -- We don't want any costumes to apply to co-op babies, since they will appear misaligned
  g.p:ClearCostumes()

  -- Make exceptions for certain costumes
  if g.p:HasCollectible(CollectibleType.COLLECTIBLE_DADS_RING) then -- 546
    g.p:AddCostume(g:GetItemConfig(CollectibleType.COLLECTIBLE_DADS_RING), false) -- 546
  end
  -- (for some reason, Empty Vessel makes the sprite flicker when playing certain animations;
  -- there is no known workaround for this)

  -- It is hard to tell that the player can fly with all costumes removed,
  -- so represent that the player has flight with Fate's wings
  if (
    -- Empty Vessel takes a frame to activate after entering a new room,
    -- so detect the flight status manually
    (
      g.p.CanFly
      or (
        g.p:HasCollectible(CollectibleType.COLLECTIBLE_EMPTY_VESSEL) -- 409
        and hearts == 0
      )
    )
    -- Make an exception for Butterfly Baby 2 because it already has wings
    and baby.name ~= "Butterfly Baby 2" -- 332
  ) then
     g.p:AddCostume(g:GetItemConfig(CollectibleType.COLLECTIBLE_FATE), false) -- 179
  end

  -- Doing this will remove a shield, so detect if there is a shield and then add it back if so
  for i = 1, effectsList.Size do
    local effect = effectsList:Get(i - 1)
    if effect.Item.ID == CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS then -- 58
      g.p:AddCostume(g:GetItemConfig(CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS), false) -- 58
      break
    end
  end

  -- Replace the player sprite with a co-op baby version
  playerSprite:Load("gfx/co-op/" .. tostring(type) .. ".anm2", true)

  Isaac.DebugString("Set the baby sprite.")
end

-- Show what the current baby does in the intro room (or if the player presses Tab)
function PostRender:DrawBabyIntro()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local type = g.run.babyType
  local baby = g.babies[type]

  -- Make the baby description persist for at least 2 seconds after the player presses tab
  for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
    if Input.IsActionPressed(ButtonAction.ACTION_MAP, i) then -- 13
      g.run.showIntroFrame = gameFrameCount + 60
      break
    end
  end

  if gameFrameCount > g.run.showIntroFrame then
    return
  end

  local center = PostRender:GetScreenCenterPosition()
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
function PostRender:DrawBabyNumber()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  local text = "#" .. type
  local x = 55 + g:GetHeartXOffset()
  if (
    baby.name == "Hopeless Baby" -- 125
    or baby.name == "Mohawk Baby" -- 138
  ) then
    -- These babies draw text next to the hearts,
    -- so account for this so that the number text does not overlap
    x = x + 20
  end
  local y = 10
  g.font:DrawString(text, x, y, g.kcolor, 0, true)
end

function PostRender:DrawVersion()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  -- Make the version persist for at least 2 seconds after the player presses "v"
  if Input.IsButtonPressed(Keyboard.KEY_V, 0) then -- 86
    g.run.showVersionFrame = gameFrameCount + 60
  end

  if (
    g.run.showVersionFrame == 0
    or gameFrameCount > g.run.showVersionFrame
  ) then
    return
  end

  local center = PostRender:GetScreenCenterPosition()
  local text, scale, x, y

  -- Render the version of the mod
  text = "The Babies Mod"
  scale = 1
  x = center.X - 3 * scale * #text
  y = center.Y
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2)

  text = g.version
  scale = 1
  x = center.X - 3 * scale * #text
  y = center.Y + 15
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2)
end

function PostRender:DrawTempIcon()
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]

  -- We want to draw a temporary icon next to the baby's active item
  -- to signify that it will go away at the end of the floor
  if (
    baby.item == nil
    or g:GetItemConfig(baby.item).Type ~= ItemType.ITEM_ACTIVE -- 3
  ) then
    return
  end

  -- Initialize the sprite, if it is not already initialized`
  if PostRender.clockSprite == nil then
    PostRender.clockSprite = Sprite()
    PostRender.clockSprite:Load("gfx/clock.anm2", true)
    PostRender.clockSprite:SetFrame("Default", 0)
  end

  local clockX = 30
  local clockY = 30
  if g.p:HasCollectible(baby.item) then
    -- The player has the item in their main active slot
    -- Draw the icon in the bottom-right hand corner
    PostRender.clockSprite:RenderLayer(0, Vector(clockX, clockY))
  elseif (
    RacingPlusGlobals ~= nil
    and g.p:HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG_CUSTOM)
    and RacingPlusGlobals.run.schoolbag.item == baby.item
  ) then
    -- The player has the item in the Schoolbag
    -- Draw the icon in the bottom-right hand corner
    PostRender.clockSprite:RenderLayer(0, Vector(clockX + 27, clockY + 32))
  end
end

-- Taken from Alphabirth: https://steamcommunity.com/sharedfiles/filedetails/?id=848056541
function PostRender:GetScreenCenterPosition()
  -- Local variables
  local shape = g.r:GetRoomShape()
  local centerOffset = (g.r:GetCenterPos()) - g.r:GetTopLeftPos()
  local pos = g.r:GetCenterPos()

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

function PostRender:DrawBabyEffects()
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  local babyFunc = PostRender.functions[type]
  if babyFunc ~= nil then
    return babyFunc()
  end
end

-- The collection of functions for each baby
PostRender.functions = {}

-- Dark Baby
PostRender.functions[48] = function()
  -- Temporary blindness
  -- Set the current fade
  -- (which is based on the game's frame count and set in the MC_POST_UPDATE callback)
  if g.run.babySprites ~= nil then
    local opacity = g.run.babyCounters / 90
    if opacity > 1 then
      opacity = 1
    end
    g.run.babySprites.Color = Color(1, 1, 1, opacity, 0, 0, 0)
    g.run.babySprites:RenderLayer(0, g.zeroVector)
  end
end

-- Hopeless Baby
PostRender.functions[125] = function()
  local roomType = g.r:GetType()
  local roomDesc = g.l:GetCurrentRoomDesc()
  local roomVariant = roomDesc.Data.Variant
  if (
    roomType ~= RoomType.ROOM_DEVIL -- 14
    and roomType ~= RoomType.ROOM_BLACK_MARKET -- 22
    and roomVariant ~= 2300 -- Krampus
    and roomVariant ~= 2301 -- Krampus
    and roomVariant ~= 2302 -- Krampus
    and roomVariant ~= 2303 -- Krampus
    and roomVariant ~= 2304 -- Krampus
    and roomVariant ~= 2305 -- Krampus
    and roomVariant ~= 2306 -- Krampus
  ) then
    -- Draw the key count next to the hearts
    local x = 65
    g.run.babySprites:RenderLayer(0, Vector(x, 12))
    local text = "x" .. tostring(g.p:GetNumKeys())
    Isaac.RenderText(text, x + 5, 12, 2, 2, 2, 2)
    -- (this looks better without a Droid font)
  end
end

-- Mohawk Baby
PostRender.functions[138] = function()
  local roomType = g.r:GetType()
  local roomDesc = g.l:GetCurrentRoomDesc()
  local roomVariant = roomDesc.Data.Variant
  if (
    roomType ~= RoomType.ROOM_DEVIL -- 14
    and roomType ~= RoomType.ROOM_BLACK_MARKET -- 22
    and roomVariant ~= 2300 -- Krampus
    and roomVariant ~= 2301 -- Krampus
    and roomVariant ~= 2302 -- Krampus
    and roomVariant ~= 2303 -- Krampus
    and roomVariant ~= 2304 -- Krampus
    and roomVariant ~= 2305 -- Krampus
    and roomVariant ~= 2306 -- Krampus
  ) then
    -- Draw the bomb count next to the hearts
    local x = 65
    g.run.babySprites:RenderLayer(0, Vector(x, 12))
    Isaac.RenderText("x" .. tostring(g.p:GetNumBombs()), x + 5, 12, 2, 2, 2, 2)
    -- (this looks better without a Droid font)
  end
end

-- Elf Baby
PostRender.functions[377] = function()
  -- The Speak of Destiny effect is not spawned in the POST_NEW_ROOM callback
  -- Thus, we check for it on every frame instead
  -- As an unfortunate side effect,
  -- the Spear of Destiny will show as the vanilla graphic during room transitions
  local spears = Isaac.FindByType(
    EntityType.ENTITY_EFFECT, -- 1000
    EffectVariant.SPEAR_OF_DESTINY, -- 83
    -1,
    false,
    false
  )
  for _, spear in ipairs(spears) do
    if spear:GetSprite():GetFilename() == "gfx/1000.083_Spear Of Destiny.anm2" then
      local sprite = spear:GetSprite()
      sprite:Load("gfx/1000.083_spear of destiny2.anm2", true)
      sprite:Play("Idle", true)
    end
  end
end

return PostRender
