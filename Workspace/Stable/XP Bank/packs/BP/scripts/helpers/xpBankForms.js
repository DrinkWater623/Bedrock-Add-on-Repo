// helpers/xpBankForms.js  XP Bank
//@ts-check
/* =====================================================================
License: M.I.T.
========================================================================*/
// Minecraft
import { Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { pack } from "../settings.js";
import { DynamicPropertyLib, clamp } from "../common-stable/tools/index.js";
import { playerIndex } from "./playerIndex.js"; // so settings changes update your runtime cache

const dv = pack.dvNames;

/** 
 * @param {Player} player
 */
export function safeGetTotalXp (player) {
    try {
        return player.getTotalXp(); // can throw :contentReference[oaicite:3]{index=3}
    } catch {
        return undefined;
    }
}
/** 
 * @param {Player} player
 */
export function getBankXp (player) {
    return Math.max(0, Math.floor(DynamicPropertyLib.getNumber(player, dv.xpBalance, 0)));
}

/** 
 * @param {Player} player
 */
function getAutoSettings (player) {
    const isAuto = DynamicPropertyLib.getBoolean(player, dv.isAuto);
    const incMin = Math.max(1, Math.floor(DynamicPropertyLib.getNumber(player, dv.autoSaveInc, 5)));
    const over = Math.max(0, Math.floor(DynamicPropertyLib.getNumber(player, dv.autoSaveOver, 10)));
    return { isAuto, incMin, over };
}

/**
 * Main menu with buttons (ActionForm) → opens settings (ModalForm).
 * @param {Player} player
 */
export async function showXpBankMenu (player) {
    if (!player?.isValid) return;

    const totalXp = safeGetTotalXp(player) || 0;
    const bankXp = getBankXp(player);
    const s = getAutoSettings(player);

    const levelText =
        typeof player.level === "number" ? `Level: ${player.level}\n` : "";

    const body =
        `Player: ${player.name}\n` +
            levelText +
            `Current XP (total): ${totalXp ?? "?"}\n` +
            `XP in Bank: ${bankXp}\n\n` +
            `Auto-Save: ${s.isAuto ? "ON" : "OFF"}\n` +
            s.isAuto ? `Increment: ${s.incMin} min\n` + `Keep Over: ${s.over}\n` : ``;

    const form = new ActionFormData()
        .title("XP Bank")
        .body(body)
        .button("Auto-Save Settings")
        .button("Refresh");

    var isPlayerXpEmpty = totalXp <= 0;
    form.button(`Deposit XP${isPlayerXpEmpty ? " (no XP to deposit)" : ""}`);

    var isBankEmpty = bankXp <= 0;
    form.button(`Withdraw XP${isBankEmpty ? " (bank is empty)" : ""}`);

    form.button("Close");

    //@ts-ignore    
    const res = await form.show(player); // Action form UI 
    if (res.canceled) return;

    switch (res.selection) {
        case 0:
            await showXpBankAutoSaveSettings(player);
            return;
        case 1:
            await showXpBankMenu(player);
            return;
        case 2:
            if (isPlayerXpEmpty)
                await showXpBankMenu(player);
            else
                await depositXp(player);
            return;
        case 3:
            if (isBankEmpty)
                await showXpBankMenu(player);
            else
                await withdrawXp(player);
        default:
            return;
    }
}

/**
 * Modal form for autosave settings (toggle + sliders).
 * @param {Player} player
 */
async function showXpBankAutoSaveSettings (player) {
    if (!player?.isValid) return;

    const bankXp = getBankXp(player);
    const totalXp = safeGetTotalXp(player);
    const s = getAutoSettings(player);

    // Tweak these ranges any time
    const INC_MIN = 1, INC_MAX = 60;
    const OVER_MIN = 0, OVER_MAX = 200;

    const form = new ModalFormData()
        .title("XP Bank - Auto-Save Settings")
        .toggle("Enable Auto-Save", { defaultValue: s.isAuto })
        .slider("Minutes between auto-saves", INC_MIN, INC_MAX, { defaultValue: clamp(s.incMin, INC_MIN, INC_MAX) })
        .slider("Keep Over (bank anything above this)", OVER_MIN, OVER_MAX, { defaultValue: clamp(s.over, OVER_MIN, OVER_MAX) });

    // ModalFormData supports toggle/slider
    //@ts-ignore
    const res = await form.show(player);
    if (!res.canceled) {
        const [ isAuto, incMin, over ] = /** @type {(boolean|number|string|undefined)[]} */ (res.formValues ?? []);
        const enabled = !!isAuto;
        const inc = Math.max(INC_MIN, Math.min(INC_MAX, Math.floor(Number(incMin) || s.incMin)));
        const keepOver = Math.max(OVER_MIN, Math.min(OVER_MAX, Math.floor(Number(over) || s.over)));

        // Persist
        player.setDynamicProperty(dv.isAuto, enabled);
        player.setDynamicProperty(dv.autoSaveInc, inc);
        player.setDynamicProperty(dv.autoSaveOver, keepOver);

        // Update runtime cache immediately so your autosave job "sees it" without waiting for respawn
        playerIndex.upsertFromSpawn(player);

        // Optional: you could message them here with chatLog/alertLog
        // e.g. chatLog.success(`Auto-Save ${enabled ? "ON" : "OFF"} | inc=${inc} | over=${keepOver}`);
    }

    // show menu again so they see updated values
    await showXpBankMenu(player);
}
/**
 * Modal form for autosave settings (toggle + sliders).
 * @param {Player} player
 */
async function depositXp (player) {
    if (!player?.isValid) return;

    const totalXp = safeGetTotalXp(player) || 0;
    
    const form = new ModalFormData()
    .title("XP Bank - Deposit XP")
    .slider("Amount to Deposit", 0, totalXp, { defaultValue: 0 });
    
    //@ts-ignore
    const res = await form.show(player);
    if (!res.canceled) {
        const [ deposit ] = /** @type {(boolean|number|string|undefined)[]} */ (res.formValues ?? []);
        const amount = Math.max(0, Math.min(totalXp, Math.floor(Number(deposit) || 0)));
        
        if (amount > 0) {
            DynamicPropertyLib.addNumber(player, dv.xpBalance, amount);
            player.addExperience(-amount);

            // Optional: message them with chatLog/alertLog
            // e.g. chatLog.success(`Deposited ${amount} XP to bank. New bank balance: ${newBankXp} XP.`); 
        }
    }

    await showXpBankMenu(player);
}
/**
 * Modal form for autosave settings (toggle + sliders).
 * @param {Player} player
 */
async function withdrawXp (player) {
    if (!player?.isValid) return;

    const bankXp = getBankXp(player);    

    const form = new ModalFormData()
        .title("XP Bank -Withdraw XP")
        .slider("Amount to Withdraw", 0, bankXp, { defaultValue: 0 });

    //@ts-ignore
    const res = await form.show(player);
    if (!res.canceled) {

        const [ withdraw ] = /** @type {(boolean|number|string|undefined)[]} */ (res.formValues ?? []);
        const amount = Math.max(0, Math.min(bankXp, Math.floor(Number(withdraw) || 0)));

        if (amount > 0) {
            // Withdraw logic here: remove from bank, add to player XP
            const newBankXp = bankXp - amount;
            player.setDynamicProperty(dv.xpBalance, newBankXp);
            player.addExperience(amount);
        }
    }

    await showXpBankMenu(player);
}