//========================================================================
// Code Credit: QuazChick
// License: MIT
// url: https://github.com/QuazChick/pillars-addon/tree/main/BP/scripts/src/components/cutCopperPillarOxidation
// Converted from TS with: https://transform.tools/typescript-to-javascript
//========================================================================
export let OxidationLevel

    ; (function (OxidationLevel) {
        OxidationLevel[ (OxidationLevel[ "None" ] = 0) ] = "None";
        OxidationLevel[ (OxidationLevel[ "Exposed" ] = 1) ] = "Exposed";
        OxidationLevel[ (OxidationLevel[ "Weathered" ] = 2) ] = "Weathered";
        OxidationLevel[ (OxidationLevel[ "Oxidized" ] = 3) ] = "Oxidized";
    })(OxidationLevel || (OxidationLevel = {}));

export let RelativeOxidationLevel

    ; (function (RelativeOxidationLevel) {
        RelativeOxidationLevel[ (RelativeOxidationLevel[ "Higher" ] = 1) ] = "Higher";
        RelativeOxidationLevel[ (RelativeOxidationLevel[ "Equal" ] = 0) ] = "Equal";
        RelativeOxidationLevel[ (RelativeOxidationLevel[ "Lower" ] = -1) ] = "Lower";
    })(RelativeOxidationLevel || (RelativeOxidationLevel = {}));
