"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var handlers_1 = require("@lilybird/handlers");
var lilybird_1 = require("lilybird");
var listeners = await (0, handlers_1.createHandler)({
    dirs: {
        listeners: "".concat(import.meta.dir, "/listeners")
    }
});
await (0, lilybird_1.createClient)(__assign({ token: process.env.TOKEN, intents: [
        1 /* Intents.GUILDS */,
        512 /* Intents.GUILD_MESSAGES */,
        32768 /* Intents.MESSAGE_CONTENT */,
        2 /* Intents.GUILD_MEMBERS */
    ] }, listeners));
