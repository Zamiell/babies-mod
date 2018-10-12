local SPCChangeCharacter = {}

-- Includes
local SPCGlobals    = require("src/spcglobals")
local SPCPostRender = require("src/spcpostrender")

-- Variables
SPCChangeCharacter.lastCharacter = 0
SPCChangeCharacter.changing = false
SPCChangeCharacter.destinationCharacter = 0
SPCChangeCharacter.health = {}

function SPCChangeCharacter:StoreHealth()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local character = player:GetPlayerType()
  local hearts = player:GetHearts()
  local maxHearts = player:GetMaxHearts()
  local soulHearts = player:GetSoulHearts()
  local blackHearts = player:GetBlackHearts()
  local boneHearts = player:GetBoneHearts()

  if character == PlayerType.PLAYER_THEFORGOTTEN then -- 16
    local player2 = player:GetSubPlayer()
    soulHearts = player2:GetSoulHearts()
    blackHearts = player2:GetBlackHearts()
  end

  SPCChangeCharacter.health  = {
    hearts      = hearts,
    maxHearts   = maxHearts,
    soulHearts  = soulHearts,
    blackHearts = blackHearts,
    boneHearts  = boneHearts,
  }
end

function SPCChangeCharacter:Change(destinationCharacter)
  -- Local variables
  local game = Game()
  local seeds = game:GetSeeds()
  local player = game:GetPlayer(0)
  local character = player:GetPlayerType()

  -- Store the existing character so that we can switch back to it later
  SPCChangeCharacter.lastCharacter = character

  -- Make the screen black before we start to spam The Clicker
  -- (otherwise it will look very buggy as we switch the character constantly)
  SPCGlobals.run.babySprite = Sprite()
  SPCGlobals.run.babySprite:Load("gfx/misc/black.anm2", true)
  SPCGlobals.run.babySprite:SetFrame("Default", 0)
  seeds:AddSeedEffect(SeedEffect.SEED_NO_HUD) -- 10

  -- Mark to start using The Clicker
  -- (we can't start using it right now in the MC_POST_NEW_LEVEL callback or else it won't work properly;
  -- we will begin in the MC_POST_UPDATE callback)
  SPCChangeCharacter.changing = true
  SPCChangeCharacter.destinationCharacter = destinationCharacter
end

function SPCChangeCharacter:Return()
  SPCChangeCharacter:Change(SPCChangeCharacter.lastCharacter)
end

function SPCChangeCharacter:PostUpdate()
  -- Local variables
  local game = Game()
  local seeds = game:GetSeeds()
  local player = game:GetPlayer(0)
  local character = player:GetPlayerType()

  if SPCChangeCharacter.changing == false then
    return
  end

  while character ~= SPCChangeCharacter.destinationCharacter do
    -- Add a Sad Onion as a dummy item so that the player's existing items do not get removed
    player:AddCollectible(CollectibleType.COLLECTIBLE_SAD_ONION, 0, false) -- 1
    Isaac.DebugString("Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_SAD_ONION)) -- 1

    -- Use The Clicker to try and switch to the intended character
    -- (doing this in an infinite loop does not work,
    -- so we can only use The Clicker at certain amount of times per frame)
    player:UseActiveItem(CollectibleType.COLLECTIBLE_CLICKER, false, false, false, false) -- 482

    character = player:GetPlayerType()
  end

  -- We have switched to the intended character after using The Clicker a bunch of times
  SPCChangeCharacter.changing = false

  -- Remove the black screen
  SPCGlobals.run.babySprite = nil
  seeds:RemoveSeedEffect(SeedEffect.SEED_NO_HUD) -- 10

  -- Since changing characters will modify our health, sSet the health back to the way it was before
  SPCChangeCharacter:RestoreHealth()

  -- Changing characters may give us the Anemic effect, so remove it
  player:ClearTemporaryEffects()

  -- There might be existing creep on the ground, so destroy it
  -- Player Creep - Red - 1000.46
  local creeps = Isaac.FindByType(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_RED, -1, false, false)
  for i = 1, #creeps do
    creeps[i].Visible = false
    creeps[i]:Remove()
  end

  -- If we are Lilith, then we need to delete the Incubus
  if SPCChangeCharacter.destinationCharacter == PlayerType.PLAYER_LILITH then -- 13
    -- Incubus (3.80)
    local incubus = {
      Index = -1,
    }
    local incubi = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.INCUBUS, -1, false, false)
    for i = 1, #incubi do
      -- The Incubus with the highest index will be the one added by Lilith
      if incubi[i].Index > incubus.Index then
        incubus = incubi[i]
      end
    end
    incubus:Remove()
  end

  -- We also need to reload the character sprite
  SPCPostRender:SetPlayerSprite()
end

function SPCChangeCharacter:RestoreHealth()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local maxHearts = SPCChangeCharacter.health.maxHearts
  local hearts = SPCChangeCharacter.health.hearts
  local soulHearts = SPCChangeCharacter.health.soulHearts
  local blackHearts = SPCChangeCharacter.health.blackHearts
  local boneHearts = SPCChangeCharacter.health.boneHearts

  if SPCChangeCharacter.lastCharacter == PlayerType.PLAYER_THEFORGOTTEN then -- 16
    -- The Forgotten does not have red heart containers
    maxHearts = boneHearts * 2
    boneHearts = 0
  end

  -- Delete all hearts
  player:AddMaxHearts(-24, true)
  player:AddSoulHearts(-24)
  player:AddBoneHearts(-24)

  -- Add the old health
  player:AddMaxHearts(maxHearts, true)
  -- (on The Forgotten, adding 2 max hearts will give 1 bone heart, so we don't need to do any special handling here)
  player:AddHearts(hearts)
  for i = 1, soulHearts do
    local bitPosition = math.floor((i - 1) / 2)
    local bit = (blackHearts & (1 << bitPosition)) >> bitPosition
    if bit == 0 then -- Soul heart
      player:AddSoulHearts(1)
    else -- Black heart
      player:AddBlackHearts(1)
    end
  end
  player:AddBoneHearts(boneHearts)
end

return SPCChangeCharacter
