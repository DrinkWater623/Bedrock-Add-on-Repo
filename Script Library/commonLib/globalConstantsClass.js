import { TicksPerSecond } from "@minecraft/server";

//@ts-check
export class globalConstantsLib {
    static TicksPerMinute = TicksPerSecond * 60;
    static TicksPerHour = this.TicksPerMinute * 60;
    static TicksPerDay = this.TicksPerHour * 24;
    static mcNameSpace = 'minecraft:';
    static mcAir = this.mcNameSpace+'air';
}