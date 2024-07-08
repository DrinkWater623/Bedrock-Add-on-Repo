export const debug = false;
export const reloadTime = 10;
export const watchFor = {
    validated: false,
    typeId: "minecraft:wither",
    family: "wither",
    display: "Wither",
    dynamicPropertyName: "isWither",
    commandPrefix: ":wither",
    intervalTimer: 400, // = 30 * 20,
    intervalMin: 20,
    intervalMax: (24000 / 4),
    //watchForExplosion: true,
    explosiveProjectiles: [ "minecraft:wither_skull", "minecraft:wither_skull_dangerous" ]
};
//const TicksPerDay = 24000; //in beta still
export const callBacks = {
    entityDie_after: { on: false, ptr: 0, options:  { entityTypes: [ watchFor.typeId ] }  },
    entityRemove_before: { on: false, ptr: 0 }
};