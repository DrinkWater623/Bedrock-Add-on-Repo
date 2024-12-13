//@ts-check
import {  system,  world } from "@minecraft/server";
import { MinecraftEffectTypes } from "./vanilla-data.js";

world.beforeEvents.worldInitialize.subscribe((event) => {

    event.itemComponentRegistry
        .registerCustomComponent(
            "dw623:effect_rotten_flesh_jerky_strength",
            {
                onConsume: e => {
                    system.runTimeout(() => {
                        e.source.addEffect(MinecraftEffectTypes.Strength, 1200);
                    }, 1);
                }
            }
        );
    event.itemComponentRegistry
        .registerCustomComponent(
            "dw623:effect_baked_spider_eye_night_vision",
            {
                onConsume: e => {
                    system.runTimeout(() => {
                        e.source.addEffect(MinecraftEffectTypes.NightVision, 6000);
                    }, 1);
                }
            }
        );
});