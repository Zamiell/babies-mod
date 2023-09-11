import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
  hasCollectible,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

// Don't include familiars that need conditions to appear (Dead Bird, Plum Flute, Umbilical Cord).
const SACRIFICIAL_ALTAR_COLLECTIBLE_TYPES = new ReadonlySet([
  CollectibleType.BROTHER_BOBBY, // 8
  CollectibleType.HALO_OF_FLIES, // 10
  CollectibleType.DISTANT_ADMIRATION, // 57
  CollectibleType.SISTER_MAGGY, // 67
  CollectibleType.CUBE_OF_MEAT, // 73
  CollectibleType.LITTLE_CHUBBY, // 88
  CollectibleType.ROBO_BABY, // 95
  CollectibleType.LITTLE_CHAD, // 96
  CollectibleType.LITTLE_GISH, // 99
  CollectibleType.LITTLE_STEVEN, // 100
  CollectibleType.GUARDIAN_ANGEL, // 112
  CollectibleType.DEMON_BABY, // 113
  CollectibleType.FOREVER_ALONE, // 128
  CollectibleType.BUM_FRIEND, // 144
  CollectibleType.PEEPER, // 155
  CollectibleType.GHOST_BABY, // 163
  CollectibleType.HARLEQUIN_BABY, // 167
  CollectibleType.RAINBOW_BABY, // 174
  CollectibleType.ABEL, // 188
  CollectibleType.BALL_OF_BANDAGES, // 207
  CollectibleType.SMART_FLY, // 264
  CollectibleType.DRY_BABY, // 265
  CollectibleType.JUICY_SACK, // 266
  CollectibleType.ROBO_BABY_2, // 267
  CollectibleType.ROTTEN_BABY, // 268
  CollectibleType.HEADLESS_BABY, // 269
  CollectibleType.LEECH, // 270
  CollectibleType.BBF, // 272
  CollectibleType.BOBS_BRAIN, // 273
  CollectibleType.LIL_BRIMSTONE, // 275
  CollectibleType.LIL_HAUNT, // 277
  CollectibleType.DARK_BUM, // 278
  CollectibleType.BIG_FAN, // 279
  CollectibleType.SISSY_LONGLEGS, // 280
  CollectibleType.PUNCHING_BAG, // 281
  CollectibleType.GEMINI, // 318
  CollectibleType.CAINS_OTHER_EYE, // 319
  CollectibleType.BLUE_BABYS_ONLY_FRIEND, // 320
  CollectibleType.MONGO_BABY, // 322
  CollectibleType.INCUBUS, // 360
  CollectibleType.FATES_REWARD, // 361
  CollectibleType.SWORN_PROTECTOR, // 363
  CollectibleType.FRIEND_ZONE, // 364
  CollectibleType.LOST_FLY, // 365
  CollectibleType.CHARGED_BABY, // 372
  CollectibleType.LIL_GURDY, // 384
  CollectibleType.BUMBO, // 385
  CollectibleType.KEY_BUM, // 388
  CollectibleType.SERAPHIM, // 390
  CollectibleType.SPIDER_MOD, // 403
  CollectibleType.FARTING_BABY, // 404
  CollectibleType.SUCCUBUS, // 417
  CollectibleType.OBSESSED_FAN, // 426
  CollectibleType.PAPA_FLY, // 430
  CollectibleType.MULTIDIMENSIONAL_BABY, // 431
  CollectibleType.LIL_LOKI, // 435
  CollectibleType.HUSHY, // 470
  CollectibleType.LIL_MONSTRO, // 471
  CollectibleType.KING_BABY, // 472
  CollectibleType.BIG_CHUBBY, // 473
  CollectibleType.ACID_BABY, // 491
  CollectibleType.YO_LISTEN, // 492
  CollectibleType.BLOODSHOT_EYE, // 509
  CollectibleType.ANGRY_FLY, // 511
  CollectibleType.BUDDY_IN_A_BOX, // 518
  CollectibleType.LIL_DELIRIUM, // 519
  CollectibleType.SEVEN_SEALS, // 526
  CollectibleType.LIL_SPEWER, // 537
  CollectibleType.BLOOD_PUPPY, // 565
  CollectibleType.INTRUDER, // 575
  CollectibleType.PSY_FLY, // 581
  CollectibleType.BOILED_BABY, // 607
  CollectibleType.FREEZER_BABY, // 608
  CollectibleType.LOST_SOUL, // 612
  CollectibleType.LIL_DUMPY, // 615
  CollectibleType.BOT_FLY, // 629
  CollectibleType.STITCHES, // 635
  CollectibleType.TINYTOMA, // 645
  CollectibleType.FRUITY_PLUM, // 649
  CollectibleType.STAR_OF_BETHLEHEM, // 651
  CollectibleType.CUBE_BABY, // 652
  CollectibleType.QUINTS, // 661
  CollectibleType.LIL_ABADDON, // 679
  CollectibleType.LIL_PORTAL, // 681
  CollectibleType.WORM_FRIEND, // 682
  CollectibleType.SWARM, // 693
  CollectibleType.TWISTED_PAIR, // 698
]);

const v = {
  run: {
    numHits: 0,
  },
};

/** Sacrificial Altar effect after 6 hits. */
export class SillyBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return (
      hasCollectible(player, ...SACRIFICIAL_ALTAR_COLLECTIBLE_TYPES) ||
      player.HasTrinket(TrinketType.ISAACS_HEAD) ||
      player.HasTrinket(TrinketType.SOUL) ||
      player.HasTrinket(TrinketType.APOLLYONS_BEST_FRIEND)
    );
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("requireNumHits");

    v.run.numHits++;
    if (v.run.numHits === num) {
      v.run.numHits = 0;
      useActiveItemTemp(player, CollectibleType.SACRIFICIAL_ALTAR);
    }

    return undefined;
  }
}
