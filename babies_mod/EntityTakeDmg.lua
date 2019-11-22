local EntityTakeDmg = {}

-- Includes
local g                   = require("babies_mod/globals")
local EntityTakeDmgPlayer = require("babies_mod/entitytakedmgplayer")

-- ModCallbacks.MC_ENTITY_TAKE_DMG (11)
-- (this must return nil or false)
function EntityTakeDmg:Main(tookDamage, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  --[[
  Isaac.DebugString("MC_ENTITY_TAKE_DMG - " ..
                    tostring(damageSource.Type) .. "." .. tostring(damageSource.Variant) .. "." ..
                    tostring(damageSource.SubType) .. " --> " ..
                    tostring(tookDamage.Type) .. "." .. tostring(tookDamage.Variant) .. "." ..
                    tostring(tookDamage.SubType))
  --]]

  local player = tookDamage:ToPlayer()
  if player ~= nil then
    return EntityTakeDmgPlayer:Main(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  end
  return EntityTakeDmg:Entity(tookDamage, damageAmount, damageFlag, damageSource, damageCountdownFrames)
end

function EntityTakeDmg:Entity(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  if g.run.dealingExtraDamage then
    return
  end

  local babyFunc = EntityTakeDmg.functions[g.run.babyType]
  if babyFunc ~= nil then
    return babyFunc(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  end
end

-- The collection of functions for each baby
EntityTakeDmg.functions = {}

-- Lost Baby
EntityTakeDmg.functions[10] = function(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  if damageSource.Type == EntityType.ENTITY_EFFECT and -- 1000
     damageSource.Variant == EffectVariant.PLAYER_CREEP_RED then -- 46

    -- By default, player creep only deals 2 damage per tick, so increase the damage
    local damage = g.p.Damage * 2
    entity:TakeDamage(damage, 0, EntityRef(g.p), damageCountdownFrames)
  end
end

-- Fang Demon Baby
EntityTakeDmg.functions[281] = function(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Make the light beam damage be based on the player's damage
  -- (normally, light beams do 2 damage on every tick and are not based on the player's damage)
  if damageSource.Type == EntityType.ENTITY_EFFECT and -- 1000
     damageSource.Variant == EffectVariant.CRACK_THE_SKY then -- 19

    local damage = g.p.Damage
    g.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(g.p), damageCountdownFrames)
    g.run.dealingExtraDamage = false
    return false
  end
end

-- Rider Baby
EntityTakeDmg.functions[295] = function(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Make the Pony do extra damage
  if damageSource.Type == EntityType.ENTITY_PLAYER and -- 1
     damageSource.Variant == 0 then

    local damage = g.p.Damage * 4
    g.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(g.p), damageCountdownFrames)
    g.run.dealingExtraDamage = false
    return false
  end
end

-- Boxers Baby
EntityTakeDmg.functions[337] = function(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  if damageSource.Type == EntityType.ENTITY_TEAR and -- 2
     damageSource.Entity.SubType == 1 then

    -- Play a random punching-related sound effect
    g.sfx:Play(Isaac.GetSoundIdByName("Fist"), 1, 0, false, 1) -- 37

    -- Give the tear extra knockback
    -- ("damageSource.Velocity" doesn't exist, so we have to find it manually)
    entity.Velocity = entity.Velocity + damageSource.Entity.Velocity * 5
  end
end

-- Elf Baby
EntityTakeDmg.functions[377] = function(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Make the Spear of Destiny do extra damage
  -- (this does not work if we set effect.CollisionDamage in the PostEffectInit callback;
  -- the damage appears to be hard-coded)
  if damageSource.Type == EntityType.ENTITY_EFFECT and -- 1000
     damageSource.Variant == EffectVariant.SPEAR_OF_DESTINY then -- 83

    local damage = g.p.Damage * 4
    g.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(g.p), damageCountdownFrames)
    g.run.dealingExtraDamage = false
    return false
  end
end

-- Astronaut Baby
EntityTakeDmg.functions[406] = function(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  if damageSource.Type == EntityType.ENTITY_TEAR and -- 2
     damageSource.Entity.SubType == 1 then

    -- 5% chance for a black hole to spawn
    math.randomseed(damageSource.Entity.InitSeed)
    local chance = math.random(1, 100)
    if chance <= 5 then
      Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.BLACK_HOLE, 0, -- 107
                  damageSource.Position, damageSource.Entity.Velocity, nil)
    end
  end
end

-- Road Kill Baby
EntityTakeDmg.functions[507] = function(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Give the Pointy Rib extra damage
  if damageSource.Type == EntityType.ENTITY_FAMILIAR and -- 3
     damageSource.Variant == FamiliarVariant.POINTY_RIB then -- 127

    local damage = g.p.Damage * 3
    g.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(g.p), damageCountdownFrames)
    g.run.dealingExtraDamage = false
    return false
  end
end

return EntityTakeDmg
