local PostEffectUpdate = {}

-- Includes
local g = require("src/globals")

-- ModCallbacks.MC_POST_EFFECT_UPDATE (55)
function PostEffectUpdate:Main(effect)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Mustache Baby" and
     effect.Variant == EffectVariant.BOOMERANG then -- 60

    -- Check for NPC collision
    local entities = Isaac.FindInRadius(effect.Position, 30, EntityPartition.ENEMY) -- 1 << 3
    if #entities > 0 then
      entities[1]:TakeDamage(player.Damage, 0, EntityRef(effect), 2)
      effect:Remove()
    end

    -- Check for player collision
    local players = Isaac.FindInRadius(effect.Position, 30, EntityPartition.PLAYER) -- 1 << 5
    if #players > 0 and
       effect.FrameCount > 20 then

      effect:Remove()
    end

    -- Make boomerangs return to the player
    if effect.FrameCount >= 26 then
      -- "effect:FollowParent(player)" does not work
      local initialSpeed = effect.Velocity:LengthSquared()
      effect.Velocity = player.Position - effect.Position
      effect.Velocity = effect.Velocity:Normalized()
      while effect.Velocity:LengthSquared() < initialSpeed do
        effect.Velocity = effect.Velocity * 1.1
      end
    end

  elseif baby.name == "Sloppy Baby" and -- 146
         effect.Variant == EffectVariant.TARGET and -- 30
         effect.FrameCount == 1 and
         -- There is a bug where the target will disappear if you have multiple shots
         player:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) == false and -- 2
         player:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) == false and -- 153
         player:HasCollectible(CollectibleType.COLLECTIBLE_20_20) == false and -- 245
         player:HasCollectible(CollectibleType.COLLECTIBLE_THE_WIZ) == false and -- 358
         player:HasPlayerForm(PlayerForm.PLAYERFORM_BABY) == false and -- 7
         player:HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM) == false then-- 10

    -- Shorten the lag time of the missiles
    -- (this is not possible in the MC_POST_EFFECT_INIT callback since effect.Timeout is -1)
    effect.Timeout = 10 -- 9 doesn't result in a missile coming out

  elseif baby.name == "Fang Demon Baby" and -- 281
         effect.Variant == EffectVariant.TARGET then -- 30

    -- Directed light beams
    if effect.FrameCount == 1 then
      -- By default, the Marked target spawns at the center of the room,
      -- and we want it to be spawned at the player instead
      effect.Position = player.Position
      effect.Visible = true
    elseif gameFrameCount >= g.run.babyFrame then
      -- Check to see if there is a nearby NPC
      local entities = Isaac.FindInRadius(effect.Position, 30, EntityPartition.ENEMY) -- 1 << 3
      if #entities > 0 then
        -- Fire the beam
        g.run.babyFrame = gameFrameCount + baby.cooldown
        game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.CRACK_THE_SKY, -- 1000.19
                   effect.Position, Vector(0, 0), player, 0, 0)
      end
    end

  elseif baby.name == "Cool Orange Baby" then -- 485
    if effect.Variant == Isaac.GetEntityVariantByName("FetusBossTarget") and
       effect.FrameCount == 30 then -- 1 second

      local rocket = game:Spawn(EntityType.ENTITY_EFFECT, Isaac.GetEntityVariantByName("FetusBossRocket"),
                                effect.Position, Vector(0, 0), nil, 0, 0)
      local rocketHeightOffset = Vector(0, -300)
      rocket.SpriteOffset = rocket.SpriteOffset + rocketHeightOffset

    elseif effect.Variant == Isaac.GetEntityVariantByName("FetusBossRocket") then

      local rocketFallSpeed = Vector(0, 30)
      effect.SpriteOffset = effect.SpriteOffset + rocketFallSpeed
      if effect.SpriteOffset.Y >= 0 then
        Isaac.Explode(effect.Position, nil, 50) -- 49 deals 1 half heart of damage
        effect:Remove()
        local entities = Isaac.FindByType(EntityType.ENTITY_EFFECT, Isaac.GetEntityVariantByName("FetusBossTarget"),
                                          -1, false, false) -- 1000
        entities[1]:Remove()
      end
    end
  end
end

return PostEffectUpdate
