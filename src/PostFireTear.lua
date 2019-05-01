local PostFireTear = {}

-- Includes
local g = require("src/globals")

-- ModCallbacks.MC_POST_FIRE_TEAR (61)
function PostFireTear:Main(tear)
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local roomFrameCount = g.r:GetFrameCount()
  local roomShape = g.r:GetRoomShape()
  local data = tear:GetData()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  --Isaac.DebugString("MC_POST_FIRE_TEAR")

  if baby.name == "Bloat Baby" then -- 2
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == baby.num then
      g.run.babyCounters = 0
      tear:ChangeVariant(TearVariant.NEEDLE) -- 31
      tear.TearFlags = tear.TearFlags | TearFlags.TEAR_NEEDLE -- 1 << 52
    end

  elseif baby.name == "Water Baby" and -- 3
     g.run.babyCounters > 0 then

    g.run.babyCounters = g.run.babyCounters - 1

    -- Make it look more impressive
    tear.Scale = 5
    tear.KnockbackMultiplier = 20

    -- We can't modify the damage ("BaseDamage" is a constant)
    -- We can improve the damage in the EntityTakeDmg callback
    -- Mark the tear for later (tears do not usually use SubTypes and we cannot use the "GetData()" function)
    tear.SubType = 1

  elseif baby.name == "Cockeyed Baby" and -- 8
         g.run.babyBool == false then

    -- Spawn a new tear with a random velocity
    local seed = tear:GetDropRNG():GetSeed()
    math.randomseed(seed)
    local rotation = math.random(1, 359)
    local vel = tear.Velocity:Rotated(rotation)
    g.run.babyBool = true
    g.p:FireTear(g.p.Position, vel, false, true, false)
    g.run.babyBool = false

  elseif baby.name == "Mag Baby" then -- 18
    tear:ChangeVariant(TearVariant.METALLIC) -- 3
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_CONFUSION -- 1 << 14

  elseif baby.name == "Blue Baby" then -- 30
    -- Sprinkler tears need to originate at the player
    tear.Position = g.p.Position

  elseif baby.name == "Long Baby" then -- 34
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_FLAT -- 1 << 27

  elseif baby.name == "Green Baby" then -- 35
    tear:ChangeVariant(TearVariant.BOOGER) -- 26
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_BOOGER -- 1 << 46

  elseif baby.name == "Super Greed Baby" then -- 54
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_MIDAS -- 1 << 51

  elseif baby.name == "Mort Baby" then -- 55
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Big Eyes Baby" then -- 59
    -- Tears cause self-knockback
    g.p.Velocity = g.p.Velocity + (tear.Velocity * -0.75)

  elseif baby.name == "Mustache Baby" then -- 66
    -- Boomerang tears
    -- We can't just use The Boomerang item because there is no way to avoid a long cooldown
    -- So we spawn an effect instead
    g.g:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.BOOMERANG, -- 1000.60
              tear.Position, tear.Velocity, tear.SpawnerEntity, 0, tear.InitSeed)
    tear:Remove()

  elseif baby.name == "Parasite Baby" then -- 77
    tear:ChangeVariant(TearVariant.BALLOON) -- 35

  elseif baby.name == "Scream Baby" then -- 81
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP, false, false, false, false) -- 49
    tear:Remove()

  elseif baby.name == "Square Eyes Baby" then -- 94
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SQUARE -- 1 << 31

  elseif baby.name == "Ed Baby" then -- 100
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Aether Baby" then -- 106
    -- Shoot 8 tears at a time
    -- (we store the rotation angle inside the "babyCounters" variable)
    g.run.babyCounters = g.run.babyCounters + 45
    if g.run.babyCounters < 360 then
      local vel = tear.Velocity:Rotated(g.run.babyCounters)
      g.p:FireTear(g.p.Position, vel, false, true, false)
    else
      g.run.babyCounters = 0
    end

  elseif baby.name == "Eyemouth Baby" then -- 111
    -- Shoot an extra tear every 3rd shot
    g.run.babyTears.tear = g.run.babyTears.tear + 1
    if g.run.babyTears.tear >= 4 then
      -- Mark to fire a tear 1 frame from now
      g.run.babyTears.tear = 0
      g.run.babyTears.frame = gameFrameCount + 1
      g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y)
    end

  elseif baby.name == "V Baby" then -- 113
    g.p:FireTechXLaser(tear.Position, tear.Velocity, 5)
    tear:Remove()

  elseif baby.name == "Strange Mouth Baby" then -- 114
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_WIGGLE -- 1 << 10

  elseif baby.name == "Strange Shape Baby" then -- 130
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_PULSE -- 1 << 25

  elseif baby.name == "Crooked Baby" then -- 133
    tear.Velocity = tear.Velocity:Rotated(-15)

  elseif baby.name == "Cape Baby" then -- 152
    local angleModifier = math.random(0, 90) - 45
    tear.Velocity = tear.Velocity:Rotated(angleModifier)
    tear:SetColor(Color(2, 2, 0, 0.7, 1, 1, 1), 10000, 10000, false, false) -- Yellow

  elseif baby.name == "Lights Baby" then -- 165
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == baby.num then
      g.run.babyCounters = 0
      tear.TearFlags = tear.TearFlags | TearFlags.TEAR_LIGHT_FROM_HEAVEN -- 1 << 37
    end

  elseif baby.name == "Web Baby" then -- 185
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SLOW -- 1 << 3

  elseif baby.name == "Sick Baby" then -- 187
    g.g:Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BLUE_FLY, -- 3.43.1
              tear.Position, tear.Velocity, tear.SpawnerEntity, BlueFlyVariant.BLUEFLY_RED, tear.InitSeed)
    tear:Remove()

  elseif baby.name == "Cold Baby" then -- 194
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_FREEZE -- 1 << 5
    tear:SetColor(Color(0, 0, 2, 0.7, 1, 1, 1), 10000, 10000, false, false) -- Blue

  elseif baby.name == "Nice Baby" then -- 197
    g.p:FireBrimstone(tear.Velocity)
    tear:Remove()

  elseif baby.name == "Blindfold Baby" then -- 202
    -- Starts with Incubus + blindfolded
    -- (we need to manually blindfold the player so that the Incubus works properly)
    tear:Remove()

  elseif baby.name == "Monocle Baby" then -- 206
    tear.Scale = tear.Scale * 3

  elseif baby.name == "Skinny Baby" then -- 213
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Tilt Baby" then -- 230
    tear.Velocity = tear.Velocity:Rotated(15)

  elseif baby.name == "Bawl Baby" and -- 231
         g.run.babyBool then

    -- Don't delete these tears, as they are coming from Isaac's Tears
    -- Non-Isaac's Tears tears will be removed below
    return

  elseif baby.name == "8 Ball Baby" then -- 251
    -- Mark that we shot this tear
    tear.SubType = 1

    -- We need to have spectral for this ability to work properly
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SPECTRAL -- 1

    -- Start with the tears directly above the player and moving towards the right
    tear.Position = Vector(0, baby.distance * -1)
    tear.Velocity = Vector(baby.distance / 4, 0)
    tear.FallingSpeed = 0

  elseif baby.name == "Orange Demon Baby" then -- 279
    -- Explosivo tears
    -- Only do every other tear to avoid softlocks
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == 2 then
      g.run.babyCounters = 0
      tear:ChangeVariant(TearVariant.EXPLOSIVO) -- 19
      tear.TearFlags = tear.TearFlags | TearFlags.TEAR_STICKY -- 1 << 35
    end

  elseif baby.name == "Butt Baby" then -- 288
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BEAN, false, false, false, false) -- 111

  elseif baby.name == "Speaker Baby" and -- 316
         g.run.babyBool == false then

    -- We mark it so that we can split it later
    tear.SubType = 1

  elseif baby.name == "Slicer Baby" then -- 331
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Boxers Baby" then -- 337
    -- Turn all tears into boxing glove / punch tears similar to Antibirth's Knockout Drops
    -- Find out the size of the tear, which will determine the corresponding frame/animation for the new sprite
    local sprite = tear:GetSprite()
    local tearSize = "RegularTear6" -- Use the 6th one by default
    for i = 1, 13 do
      local animationName = "RegularTear" .. tostring(i)
      if sprite:IsPlaying(animationName) then
        tearSize = animationName
        break
      end
    end

    -- Change the sprite
    sprite:Load("gfx/fist_tears.anm2", true)
    sprite:Play(tearSize, false)

    -- By default, the sprite is facing to the right
    local tearAngle = tear.Velocity:GetAngleDegrees()
    if (tearAngle > 90 and tearAngle <= 180) or
       (tearAngle >= -180 and tearAngle < -90) then

      -- If the tear is shooting to the left, then we need to rotate it and flip the sprite
      sprite.FlipY = true
      sprite.Rotation = tearAngle * -1
    else
      -- If the tear is shooting to the right, then just rotate it
      sprite.Rotation = tearAngle
    end

    -- Mark it as a special tear so that we can play a sound effect later
    tear.SubType = 1

    -- Apparently, the "tear:SetKnockbackMultiplier()" function does not work,
    -- so we have to set the custom knockback in the "EntityTakeDmg:Entity()" function

  elseif baby.name == "X Baby" then -- 339
    g.run.babyCounters = g.run.babyCounters + 1
    tear.Velocity = tear.Velocity:Rotated(45)
    if g.run.babyCounters < 4 then
      g.p:FireTear(g.p.Position, tear.Velocity:Rotated(45), false, true, false)
    else
      g.run.babyCounters = 0
    end

  elseif baby.name == "O Baby 2" then -- 340
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SPIRAL -- 1 << 26

  elseif baby.name == "Locust Baby" then -- 345
    tear:ChangeVariant(TearVariant.BOOGER) -- 26
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_BOOGER -- 1 << 46

  elseif baby.name == "2600 Baby" then -- 347
    tear.Velocity = tear.Velocity:Rotated(180)

  elseif baby.name == "Mushroom Girl Baby" then -- 361
    -- Extra bomb shots
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == baby.num then
      g.run.babyCounters = 0
      g.g:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_NORMAL, -- 4.1
                tear.Position, tear.Velocity, tear.SpawnerEntity, 0, tear.InitSeed)
      tear:Remove()
    end

  elseif baby.name == "Turtle Dragon Baby" then -- 364
    -- If we do "player:ShootRedCandle(tear.Velocity)", the fires have enormous speed and are hard to control
    local angle = tear.Velocity:GetAngleDegrees()
    local normalizedVelocity = Vector.FromAngle(angle)
    g.p:ShootRedCandle(normalizedVelocity)
    tear:Remove()

  elseif baby.name == "Arcade Baby" then -- 368
    g.run.babyCounters = 0
    tear:ChangeVariant(TearVariant.RAZOR) -- 28

    -- Mark it so that we can increase the damage later
    tear.SubType = 1

  elseif baby.name == "Pink Ghost Baby" then -- 372
    tear:SetColor(Color(2, 0.05, 1, 0.7, 1, 1, 1), 10000, 10000, false, false) -- Hot pink
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_CHARM -- 1 << 13

  elseif baby.name == "Octopus Baby" then -- 380
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Dark Space Soldier Baby" then -- 398
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == baby.num then
      g.run.babyCounters = 0
      tear:ChangeVariant(TearVariant.CHAOS_CARD) -- 9
    end

  elseif baby.name == "Astronaut Baby" then -- 406
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Gills Baby" then -- 410
    tear:SetColor(Color(0.7, 1.5, 2, 0.7, 1, 1, 1), 10000, 10000, false, false) -- Light cyan

    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Little Horn Baby" then -- 429
    -- Void tears
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == baby.num then
      g.run.babyCounters = 0
      tear.TearFlags = tear.TearFlags | TearFlags.TEAR_HORN -- 1 << 54
    end

  elseif baby.name == "Tooth Head Baby" then -- 442
    tear:ChangeVariant(TearVariant.TOOTH) -- 2

    -- Mark it so that we can increase the damage later
    tear.SubType = 1

  elseif baby.name == "Green Koopa Baby" then -- 455
    -- Turn all tears into green shell tears
    local sprite = tear:GetSprite()
    sprite:Load("gfx/shell_green_tears.anm2", true)
    sprite:Play("RegularTear1", false)

    -- Make it bouncy
    tear.TearFlags = TearFlags.TEAR_BOUNCE | -- 1 << 19
                     TearFlags.TEAR_POP -- 1 << 56

    -- Make it lower to the ground
    tear.Height = -5

    -- Mark it as a special tear so that we can keep it updated
    tear.SubType = 1

    -- Store the initial height and velocity
    data.Height = tear.Height
    data.Velocity = tear.Velocity

  elseif baby.name == "Red Koopa Baby" then -- 458
    -- Turn all tears into green shell tears
    local sprite = tear:GetSprite()
    sprite:Load("gfx/shell_red_tears.anm2", true)
    sprite:Play("RegularTear1", false)

    -- Make it bouncy
    tear.TearFlags = TearFlags.TEAR_HOMING | -- 1 << 2
                     TearFlags.TEAR_BOUNCE | -- 1 << 19
                     TearFlags.TEAR_POP -- 1 << 56

    -- Make it lower to the ground
    tear.Height = -5

    -- Mark it as a special tear so that we can keep it updated
    tear.SubType = 1

    -- Store the initial height and velocity
    data.Height = tear.Height
    data.Velocity = tear.Velocity

  elseif baby.name == "Sad Bunny Baby" then -- 459
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Voxdog Baby" then -- 462
    -- Shockwave tears
    g.run.babyTears[#g.run.babyTears + 1] = {
      frame = gameFrameCount,
      position = tear.Position,
      velocity = tear.Velocity:Normalized() * 30,
    }
    tear:Remove()

  elseif baby.name == "Blindcursed Baby" then -- 466
    tear.Visible = false

  elseif baby.name == "Fly Baby" then -- 469
    tear:ChangeVariant(TearVariant.GODS_FLESH) -- 16
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_PIERCING -- 1 << 1
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SPLIT -- 1 << 6
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_WIGGLE -- 1 << 10
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_PULSE -- 1 << 25
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_BONE -- 1 << 49

  elseif baby.name == "Headphone Baby" then -- 470
    -- Soundwave tears
    tear:ChangeVariant(TearVariant.PUPULA)
    -- Giving a tear flag of TEAR_FLAT makes it look worse
    tear.Scale = tear.Scale * 10

  elseif baby.name == "Imp Baby 2" then -- 480
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_ACID -- 1 << 48

  elseif baby.name == "Cursed Pillow Baby" then -- 487
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Pompadour Baby" then -- 494
    tear:ChangeVariant(TearVariant.GODS_FLESH) -- 16
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_GODS_FLESH -- 1 << 41

  elseif baby.name == "Ill Baby" then -- 498
    tear:ChangeVariant(TearVariant.BOBS_HEAD) -- 4

  elseif baby.name == "Mern Baby" then -- 500
    g.run.babyTears.tear = g.run.babyTears.tear + 1
    if g.run.babyTears.tear >= 2 then
      -- Mark to fire a tear 1 frame from now
      g.run.babyTears.tear = 0
      g.run.babyTears.frame = gameFrameCount + 1
      g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y)
    end

  elseif baby.name == "Psychic Baby" and -- 504
         roomFrameCount < 900 and -- Only do it for the first 30 seconds of a room to avoid softlocks
         roomShape < RoomShape.ROOMSHAPE_2x2 then -- 8 (the L room shapes are 9, 10, 11, and 12)

    -- Starts with Abel; tears come from Abel
    -- Get Abel's position
    local entities = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.ABEL, -1, false, false) -- 5.8
    if #entities > 0 then
      tear.Position = entities[1].Position
    else
      Isaac.DebugString("Error: Abel was not found.")
    end

  elseif baby.name == "Master Cook Baby" then -- 517
    tear:ChangeVariant(TearVariant.EGG) -- 27
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_EGG -- 1 << 47

  elseif baby.name == "Spider Baby" then -- 521
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == 2 then
      g.run.babyCounters = 0

      -- Every second tear spawns a spider
      g.p:ThrowBlueSpider(g.p.Position, g.p.Position)
      tear:Remove()
    end

  elseif baby.name == "Abel" then -- 531
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Rotten Baby" then -- 533
    tear:Remove()
    g.p:AddBlueFlies(1, g.p.Position, nil)

  elseif baby.name == "Lil' Loki" then -- 539
    -- Cross tears
    -- (we store the rotation angle in the "babyCounters" variable)
    g.run.babyCounters = g.run.babyCounters + 90
    if g.run.babyCounters < 360 then
      local vel = tear.Velocity:Rotated(g.run.babyCounters)
      g.p:FireTear(g.p.Position, vel, false, true, false)
    else
      g.run.babyCounters = 0
    end
  end
end

return PostFireTear
