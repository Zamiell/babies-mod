const functionMap = new Map<int, (knife: EntityKnife) => void>();
export default functionMap;

// Brother Bobby
functionMap.set(522, (knife: EntityKnife) => {
  // Make the knife invisible
  knife.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
  knife.Visible = false;
});
