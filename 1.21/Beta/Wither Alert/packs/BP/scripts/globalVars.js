export const debug = false;
export const beta = true;
export const reloadTime = 10;
export const watchFor = {
    validated: false,
    typeId: "minecraft:wither",
    family: "wither",
    display: "Wither",
    dynamicPropertyName: "isWither",
    commandPrefix: ":wither",
    intervalTimer: 400, // = 30 * 20,
    intervalMin: 100,
    intervalMax: (24000 / 4),
    //watchForExplosion: true,
    explosiveProjectiles: [ "minecraft:wither_skull", "minecraft:wither_skull_dangerous" ],
    boostsAllowed: false,
    boostTicks: 7200,
    boostTicksMin: 1200,
    boostTicksMax: 1200 * 20
};
//const TicksPerDay = 24000; //in beta still
