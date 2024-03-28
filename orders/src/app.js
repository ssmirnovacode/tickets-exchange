"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = require("body-parser");
const common_1 = require("@ticketsx/common");
const cookie_session_1 = __importDefault(require("cookie-session"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
exports.app = app;
app.set("trust proxy", true); // making express trust proxy traffic from ngnix as secure
app.use((0, body_parser_1.json)());
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // https only connection unless it's jest environment
}));
app.use(common_1.currentUser);
app.use(routes_1.createOrderRouter);
app.use(routes_1.getOrderByIdRouter);
app.use(routes_1.getAllOrdersRouter);
app.use(routes_1.cancelOrderRouter);
app.all("*", () => __awaiter(void 0, void 0, void 0, function* () {
    throw new common_1.NotFoundError();
}));
app.use(common_1.errorHandler);
