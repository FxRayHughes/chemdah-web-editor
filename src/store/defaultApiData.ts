import { ApiDefinition } from "./useApiStore";

export const DEFAULT_API_DATA: ApiDefinition = {
    "minecraft": {
        "block break": {
            "condition": [
                {
                    "name": "drops",
                    "pattern": "ItemStack"
                },
                {
                    "name": "no-silk-touch",
                    "pattern": "Boolean"
                },
                {
                    "name": "material",
                    "pattern": "Block"
                },
                {
                    "name": "unique",
                    "pattern": "Boolean"
                },
                {
                    "name": "position",
                    "pattern": "Location"
                },
                {
                    "name": "exp",
                    "pattern": "Number"
                }
            ],
            "condition-vars": [
                "exp"
            ],
            "goal": [
                {
                    "name": "amount",
                    "pattern": "Number"
                }
            ],
            "goal-vars": [
                "amount"
            ]
        },
    }
}