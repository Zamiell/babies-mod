export const FADED_BLUE = Color(0, 0, 1, 0.7);
export const FADED_RED = Color(1, 0, 0, 0.7);
export const FADED_YELLOW = Color(1, 1, 0, 0.7);

export const MOD_NAME = "The Babies Mod";

export const NUM_SUCCUBI_IN_FLOCK = 10;

export const ROOM_TYPES_TO_NOT_TRANSFORM = new Set([
  RoomType.ROOM_DEFAULT, // 1
  // I AM ERROR rooms should not be converted so that they have a way to escape
  RoomType.ROOM_ERROR, // 3
  RoomType.ROOM_BOSS, // 5
  // Devil Rooms don't need to be converted because they are already Devil Rooms
  RoomType.ROOM_DEVIL, // 14
  // Dungeons cannot be converted because they need to have the ladder
  RoomType.ROOM_DUNGEON, // 16
  // Big rooms should not be converted
  RoomType.ROOM_BOSSRUSH, // 17
  RoomType.ROOM_BLACK_MARKET, // 22
  // The mechanic should not interfere with progressing in Greed Mode
  RoomType.ROOM_GREED_EXIT, // 23
  // The mechanic should not interfere with getting to Repentance floors
  RoomType.ROOM_SECRET_EXIT, // 27
  // The mechanic should not apply to in-between battle rooms
  RoomType.ROOM_BLUE, // 28
]);

// The version is updated automatically by IsaacScript
export const VERSION = "1.4.3";
