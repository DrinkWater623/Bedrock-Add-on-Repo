import { TicksPerSecond } from "@minecraft/server";

//@ts-check
export class globalConstantsLib {
    static TicksPerMinute = TicksPerSecond * 60;
    static TicksPerHour = globalConstantsLib.TicksPerMinute * 60;
    static TicksPerDay = globalConstantsLib.TicksPerHour * 24;
}