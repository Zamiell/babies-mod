local SPCEntityTakeDmg = {}

-- Includes
local SPCGlobals             = require("src/spcglobals")
local SPCEntityTakeDmgBabies = require("src/spcentitytakedmgbabies")

-- ModCallbacks.MC_ENTITY_TAKE_DMG (11)
-- (this must return nil or false)
function SPCEntityTakeDmg:Main(tookDamage, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
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
    return SPCEntityTakeDmgBabies:Player(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  end
  return SPCEntityTakeDmg:Entity(tookDamage, damageAmount, damageFlag, damageSource, damageCountdownFrames)
end

function SPCEntityTakeDmg:Entity(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables (2)
  local game = Game()
  local level = game:GetLevel()
  local stage = level:GetStage()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  if baby.name == "Water Baby" and -- 3
     damageSource.Type == EntityType.ENTITY_TEAR and -- 2
     damageSource.Entity.SubType == 1 then

    -- Make the tears from Isaac's Tears do a lot of damage,
    -- like a Polyphemus tear (that scales with the floor)
    local damage = damageAmount * 10 * (1 + stage * 0.1)
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)

  elseif baby.name == "Lost Baby" and -- 10
         damageSource.Type == EntityType.ENTITY_EFFECT and -- 1000
         damageSource.Variant == EffectVariant.PLAYER_CREEP_RED then -- 46

    -- By default, player creep only deals 2 damage per tick, so increase the damage
    local damage = player.Damage * 2
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)

  elseif baby.name == "Mustache Baby" and -- 66
         SPCGlobals.run.dealingExtraDamage == false then

    -- By default, the boomerang only does 2x damage, so make it deal extra
    local damage = player.Damage * 4
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Pipe Baby" and -- 203
         SPCGlobals.run.dealingExtraDamage == false then

    -- Make Black Powder do extra damage
    local damage = player.Damage * 10
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Fang Demon Baby" and -- 281
         SPCGlobals.run.dealingExtraDamage == false then

    -- Make the light beams do extra damage
    -- (light beams do 2 damage on every tick and are not based on the player's damage)
    local damage = player.Damage
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Rider Baby" and -- 295
         SPCGlobals.run.dealingExtraDamage == false then

    -- Make the Pony do extra damage
    local damage = player.Damage * 4
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Slicer Baby" and -- 331
         damageSource.Type == EntityType.ENTITY_TEAR and -- 2
         damageSource.Entity.SubType == 1 then

    -- Make the Soy Milk tears do extra damage
    local damage = player.Damage * 3
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Boxers Baby" and -- 337
         damageSource.Type == EntityType.ENTITY_TEAR and -- 2
         damageSource.Entity.SubType == 1 then

    -- Play a random punching-related sound effect
    sfx:Play(Isaac.GetSoundIdByName("Fist"), 1, 0, false, 1) -- 37

    -- Give the tear extra knockback
    -- ("damageSource.Velocity" doesn't exist, so we have to find it manually)
    entity.Velocity = entity.Velocity + damageSource.Entity.Velocity * 5

  elseif baby.name == "Arcade Baby" and -- 368
         SPCGlobals.run.dealingExtraDamage == false then

    local damage = player.Damage * 3
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Elf Baby" and -- 377
         SPCGlobals.run.dealingExtraDamage == false then

    -- Make the Spear of Destiny do extra damage
    local damage = player.Damage * 4
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Astronaut Baby" and -- 406
         damageSource.Type == EntityType.ENTITY_TEAR and -- 2
         damageSource.Entity.SubType == 1 then

    -- 5% chance for a black hole to spawn
    math.randomseed(damageSource.Entity.InitSeed)
    local chance = math.random(1, 100)
    if chance <= 5 then
      game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.BLACK_HOLE, -- 107
                 damageSource.Position, damageSource.Entity.Velocity, nil, 0, 0)
    end

  elseif baby.name == "Tooth Head Baby" and -- 442
         damageSource.Type == EntityType.ENTITY_TEAR and -- 2
         damageSource.Entity.SubType == 1 and
         SPCGlobals.run.dealingExtraDamage == false then

    local damage = player.Damage * 3.2
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Road Kill Baby" and -- 507
         SPCGlobals.run.dealingExtraDamage == false then

    -- Give the Pointy Rib extra damage
    local damage = player.Damage * 3
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false
  end
end

return SPCEntityTakeDmg
