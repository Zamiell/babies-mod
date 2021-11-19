export const postKnifeInitBabyFunctionMap = new Map<
  int,
  (knife: EntityKnife) => void
>();

// Brother Bobby
postKnifeInitBabyFunctionMap.set(522, (knife: EntityKnife) => {
  // Make the knife invisible
  knife.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
  knife.Visible = false;
});
