"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExpiredRentals = exports.paymentWebhook = exports.createOrder = void 0;
require("./config/firebase"); // Ensure Firebase is initialized first
var orderController_1 = require("./controllers/orderController");
Object.defineProperty(exports, "createOrder", { enumerable: true, get: function () { return orderController_1.createOrder; } });
var webhookController_1 = require("./controllers/webhookController");
Object.defineProperty(exports, "paymentWebhook", { enumerable: true, get: function () { return webhookController_1.paymentWebhook; } });
var expiryCron_1 = require("./cron/expiryCron");
Object.defineProperty(exports, "checkExpiredRentals", { enumerable: true, get: function () { return expiryCron_1.checkExpiredRentals; } });
//# sourceMappingURL=index.js.map