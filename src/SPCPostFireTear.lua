local SPCPostFireTear = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_FIRE_TEAR (61)
function SPCPostFireTear:Main(tear)
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

  if baby.name == "Water Baby" and -- 3
     SPCGlobals.run.waterBabyTears > 0 then

    SPCGlobals.run.waterBabyTears = SPCGlobals.run.waterBabyTears - 1

    -- Make it look more impressive
    tear.Scale = 5
    tear.KnockbackMultiplier = 20

    -- We can't modify the damage ("BaseDamage" is a constant)
    -- We can improve the damage in the EntityTakeDmg callback
    -- Mark the tear for later (tears do not usually use SubTypes and we cannot use the "GetData()" function)
    tear.SubType = 1

  elseif baby.name == "Cockeyed Baby" and -- 8
         SPCGlobals.run.cockeyedBabyFiring == false then

    -- Spawn a new tear with a random velocity
    local seed = tear:GetDropRNG():GetSeed()
    math.randomseed(seed)
    local rotation = math.random(1, 359)
    local vel = tear.Velocity:Rotated(rotation)
    SPCGlobals.run.cockeyedBabyFiring = true
    player:FireTear(player.Position, vel, false, true, false)
    SPCGlobals.run.cockeyedBabyFiring = false

  elseif baby.name == "Mag Baby" then -- 18
    tear:ChangeVariant(TearVariant.METALLIC) -- 3
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_CONFUSION -- 1 << 14

  elseif baby.name == "Dead Baby" then -- 22
    tear:ChangeVariant(TearVariant.NEEDLE) -- 31
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_NEEDLE -- 1 << 52

  elseif baby.name == "Long Baby" then -- 34
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_FLAT -- 1 << 27

  elseif baby.name == "Super Greed Baby" then -- 54
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_MIDAS -- 1 << 51

  elseif baby.name == "Mustache Baby" then -- 66
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOMERANG, false, false, false, false) -- 388
    tear:Remove()

  elseif baby.name == "Parasite Baby" then -- 77
    tear:ChangeVariant(TearVariant.BALLOON) -- 35

  elseif baby.name == "Square Eyes Baby" then -- 94
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SQUARE -- 1 << 31

  elseif baby.name == "Aether Baby" then -- 106
    -- Shoot 8 tears at a time
    SPCGlobals.run.aetherBabyRotation = SPCGlobals.run.aetherBabyRotation + 45
    if SPCGlobals.run.aetherBabyRotation < 360 then
      local vel = tear.Velocity:Rotated(SPCGlobals.run.aetherBabyRotation)
      player:FireTear(player.Position, vel, false, true, false)
    else
      SPCGlobals.run.aetherBabyRotation = 0
    end

  elseif baby.name == "Eyemouth Baby" then -- 111
    -- Shoot an extra tear every 3rd shot
    SPCGlobals.run.eyemouthBaby.tear = SPCGlobals.run.eyemouthBaby.tear + 1
    if SPCGlobals.run.eyemouthBaby.tear >= 4 then
      -- Mark to fire a tear 1 frame from now
      SPCGlobals.run.eyemouthBaby.tear = 0
      SPCGlobals.run.eyemouthBaby.frame = gameFrameCount + 1
      SPCGlobals.run.eyemouthBaby.velocity = Vector(tear.Velocity.X, tear.Velocity.Y)
    end

  elseif baby.name == "Strange Mouth Baby" then -- 114
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_WIGGLE -- 1 << 10

  elseif baby.name == "Strange Shape Baby" then -- 130
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_PULSE -- 1 << 25

  elseif baby.name == "Crooked Baby" then -- 133
    tear.Velocity = tear.Velocity:Rotated(-15)

  elseif baby.name == "Lights Baby" then -- 165
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_LIGHT_FROM_HEAVEN -- 1 << 37

  elseif baby.name == "Web Baby" then -- 185
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SLOW -- 1 << 3

  elseif baby.name == "Cold Baby" then -- 194
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_FREEZE -- 1 << 5

  elseif baby.name == "Monocle Baby" then -- 206
    tear.Scale = tear.Scale * 3

  elseif baby.name == "Tilt Baby" then -- 230
    tear.Velocity = tear.Velocity:Rotated(15)

  elseif baby.name == "Butt Baby" then -- 288
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BEAN, false, false, false, false) -- 111

  elseif baby.name == "Speaker Baby" and -- 316
         SPCGlobals.run.speakerBabyShooting == false then

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
    -- so we have to set the custom knockback in the "SPCEntityTakeDmg:Entity()" function

  elseif baby.name == "X Baby" then -- 339
    SPCGlobals.run.xBabyTears = SPCGlobals.run.xBabyTears + 1
    tear.Velocity = tear.Velocity:Rotated(45)
    if SPCGlobals.run.xBabyTears < 4 then
      player:FireTear(player.Position, tear.Velocity:Rotated(45), false, true, false)
    else
      SPCGlobals.run.xBabyTears = 0
    end

  elseif baby.name == "O Baby 2" then -- 340
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_SPIRAL -- 1 << 26

  elseif baby.name == "Locust Baby" then -- 345
    tear:ChangeVariant(TearVariant.BOOGER) -- 26
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_BOOGER -- 1 << 46

  elseif baby.name == "2600 Baby" then -- 347
    tear.Velocity = tear.Velocity:Rotated(180)

  elseif baby.name == "Voxdog Baby" then -- 362
    tear:ChangeVariant(TearVariant.BALLOON_BOMB) -- 38

  elseif baby.name == "Turtle Dragon Baby" then -- 364
    -- If we do "player:ShootRedCandle(tear.Velocity)", the fires have enormous speed and are hard to control
    local angle = tear.Velocity:GetAngleDegrees()
    local normalizedVelocity = Vector.FromAngle(angle)
    player:ShootRedCandle(normalizedVelocity)
    tear:Remove()

  elseif baby.name == "Arcade Baby" then -- 368
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
    tear:ChangeVariant(TearVariant.CHAOS_CARD) -- 9

  elseif baby.name == "Astronaut Baby" then -- 406
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Gills Baby" then -- 410
    tear:SetColor(Color(0.7, 1.5, 2, 0.7, 1, 1, 1), 10000, 10000, false, false) -- Light cyan

  elseif baby.name == "Little Horn Baby" then -- 429
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_HORN -- 1 << 54

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
    local data = tear:GetData()
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
    local data = tear:GetData()
    data.Height = tear.Height
    data.Velocity = tear.Velocity

  elseif baby.name == "Sad Bunny Baby" then -- 459
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Blindcursed Baby" then -- 466
    tear.Visible = false

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
    SPCGlobals.run.mernBaby.tear = SPCGlobals.run.mernBaby.tear + 1
    if SPCGlobals.run.mernBaby.tear >= 2 then
      -- Mark to fire a tear 1 frame from now
      SPCGlobals.run.mernBaby.tear = 0
      SPCGlobals.run.mernBaby.frame = gameFrameCount + 1
      SPCGlobals.run.mernBaby.velocity = Vector(tear.Velocity.X, tear.Velocity.Y)
    end

  elseif baby.name == "Psychic Baby" and -- 504
         roomFrameCount < 1800 then -- Only do it for the first minute of a room to avoid softlocks

    -- Get Abel's position
    local entities = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.ABEL, -1, false, false) -- 5.8
    tear.Position = entities[1].Position

  elseif baby.name == "Master Cook Baby" then -- 517
    tear:ChangeVariant(TearVariant.EGG) -- 27
    tear.TearFlags = tear.TearFlags | TearFlags.TEAR_EGG -- 1 << 47

  elseif baby.name == "Abel" then -- 531
    -- Mark that we shot this tear
    tear.SubType = 1

  elseif baby.name == "Rotten Baby" then -- 533
    tear:Remove()
    player:AddBlueFlies(1, player.Position, nil)

  elseif baby.name == "Lil' Loki" then -- 539
    -- Cross tears
    SPCGlobals.run.lilLokiRot = SPCGlobals.run.lilLokiRot + 90
    if SPCGlobals.run.lilLokiRot < 360 then
      local vel = tear.Velocity:Rotated(SPCGlobals.run.lilLokiRot)
      player:FireTear(player.Position, vel, false, true, false)
    else
      SPCGlobals.run.lilLokiRot = 0
    end
  end
end

return SPCPostFireTear
