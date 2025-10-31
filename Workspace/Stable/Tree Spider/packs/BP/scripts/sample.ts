import {
    CustomCommandRegistry,
    CustomCommand,
    CustomCommandParameter,
    CustomCommandParamType,
    CommandPermissionLevel,
    CustomCommandOrigin,
    CustomCommandResult,
    CustomCommandStatus,
} from "@minecraft/server";

// Example of registering custom commands using CustomCommandRegistry
function registerCustomCommands ( registry: CustomCommandRegistry ) {
    // Register an enum for command parameters
    registry.registerEnum( "teleportTargets", [ "spawn", "home", "end", "nether" ] );

    // Define a simple teleport command
    const teleportCommand: CustomCommand = {
        name: "custom:teleport",
        description: "Teleport to predefined locations",
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: true,
        mandatoryParameters: [
            {
                name: "destination",
                type: CustomCommandParamType.Enum,            
            },
        ],
        optionalParameters: [
            {
                name: "player",
                type: CustomCommandParamType.PlayerSelector,
            },
        ],
    };

    // Register the command with a callback
    registry.registerCommand( teleportCommand, ( origin: CustomCommandOrigin, args: any[] ) => {
        const destination = args[ 0 ] as string;
        const targetPlayer = args[ 1 ]; // Optional player parameter

        console.log( `Teleport command executed by ${origin.sourceType}` );
        console.log( `Destination: ${destination}` );

        if ( origin.sourceEntity ) {
            console.log( `Command source entity: ${origin.sourceEntity.typeId}` );
        }

        // Perform teleportation logic here
        const result: CustomCommandResult = {
            status: CustomCommandStatus.Success,
            message: `Teleported to ${destination}`,
        };

        return result;
    } );

    // Define a more complex command with multiple parameter types
    const giveItemCommand: CustomCommand = {
        name: "custom:giveitem",
        description: "Give items to players with custom parameters",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        cheatsRequired: false,
        mandatoryParameters: [
            {
                name: "item",
                type: CustomCommandParamType.ItemType,
            },
            {
                name: "amount",
                type: CustomCommandParamType.Integer,
            },
        ],
        optionalParameters: [
            {
                name: "target",
                type: CustomCommandParamType.PlayerSelector,
            },
        ],
    };

    registry.registerCommand( giveItemCommand, ( origin: CustomCommandOrigin, args: any[] ) => {
        const itemType = args[ 0 ];
        const amount = args[ 1 ] as number;
        const target = args[ 2 ]; // Optional

        // Command execution logic
        return {
            status: CustomCommandStatus.Success,
            message: `Gave ${amount} ${itemType} to player`,
        };
    } );
}

// Example usage during startup
// This would typically be called in a startup event handler
// registerCustomCommands(startupEvent.customCommandRegistry);