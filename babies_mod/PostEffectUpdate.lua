local PostEffectUpdate = {}

-- Note: Distance, SpawnerType, and SpawnerVariant are not initialized yet in this callback

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_POST_EFFECT_UPDATE (55)
function PostEffectUpdate:Main(effect)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostEffectUpdate.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(effect)
  end
end

-- The collection of functions for each baby
PostEffectUpdate.functions = {}

-- Mustache Baby
PostEffectUpdate.functions[66] = function(effect)
  if effect.Variant == EffectVariant.BOOMERANG then -- 60
    -- Check for NPC collision
    local entities = Isaac.FindInRadius(effect.Position, 30, EntityPartition.ENEMY) -- 1 << 3
    if #entities > 0 then
      entities[1]:TakeDamage(g.p.Damage, 0, EntityRef(effect), 2)
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
      effect.Velocity = g.p.Position - effect.Position
      effect.Velocity = effect.Velocity:Normalized()
      while effect.Velocity:LengthSquared() < initialSpeed do
        effect.Velocity = effect.Velocity * 1.1
      end
    end
  end
end

-- Sloppy Baby
PostEffectUpdate.functions[146] = function(effect)
  -- Shorten the lag time of the missiles
  -- (this is not possible in the MC_POST_EFFECT_INIT callback since effect.Timeout is -1)
  if effect.Variant == EffectVariant.TARGET and -- 30
     effect.FrameCount == 1 and
     -- There is a bug where the target will disappear if you have multiple shots
     not g.p:HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) and -- 2
     not g.p:HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) and -- 153
     not g.p:HasCollectible(CollectibleType.COLLECTIBLE_20_20) and -- 245
     not g.p:HasCollectible(CollectibleType.COLLECTIBLE_THE_WIZ) and -- 358
     not g.p:HasPlayerForm(PlayerForm.PLAYERFORM_BABY) and -- 7
     not g.p:HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM) then-- 10

    effect.Timeout = 10 -- 9 doesn't result in a missile coming out
  end
end

-- Fang Demon Baby
PostEffectUpdate.functions[281] = function(effect)
  -- Directed light beams
  if effect.Variant ~= EffectVariant.TARGET then -- 30
    return
  end

  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  local gameFrameCount = g.g:GetFrameCount()

  if effect.FrameCount == 1 then
    -- By default, the Marked target spawns at the center of the room,
    -- and we want it to be spawned at the player instead
    effect.Position = g.p.Position
    effect.Visible = true
  elseif gameFrameCount >= g.run.babyFrame then
    -- Check to see if there is a nearby NPC
    local entities = Isaac.FindInRadius(effect.Position, 30, EntityPartition.ENEMY) -- 1 << 3
    if #entities > 0 then
      -- Fire the beam
      g.run.babyFrame = gameFrameCount + baby.cooldown
      Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.CRACK_THE_SKY, 0, -- 1000.19
                  effect.Position, g.zeroVector, g.p)
    end
  end
end

-- Cool Orange Baby
PostEffectUpdate.functions[485] = function(effect)
  if effect.Variant == EffectVariant.FETUS_BOSS_TARGET and
     effect.FrameCount == 30 then -- 1 second

    local rocket = Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.FETUS_BOSS_ROCKET, 0, -- 1000
                               effect.Position, g.zeroVector, nil)
    local rocketHeightOffset = Vector(0, -300)
    rocket.SpriteOffset = rocket.SpriteOffset + rocketHeightOffset

  elseif effect.Variant == EffectVariant.FETUS_BOSS_ROCKET then
    local rocketFallSpeed = Vector(0, 30)
    effect.SpriteOffset = effect.SpriteOffset + rocketFallSpeed
    if effect.SpriteOffset.Y >= 0 then
      Isaac.Explode(effect.Position, nil, 50) -- 49 deals 1 half heart of damage
      effect:Remove()
      local targets = Isaac.FindByType(EntityType.ENTITY_EFFECT, EffectVariant.FETUS_BOSS_TARGET, -- 1000
                                       -1, false, false) -- 1000
      targets[1]:Remove()
    end
  end
end

return PostEffectUpdate
