"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quote = void 0;
const typeorm_1 = require("typeorm");
const service_entity_1 = require("./service.entity");
const EQuote_1 = require("./enums/EQuote");
let Quote = class Quote {
};
exports.Quote = Quote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Quote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quote.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quote.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Quote.prototype, "phonenumber", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => service_entity_1.Service),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Quote.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quote.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Quote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Quote.prototype, "read", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: EQuote_1.EQuote,
        default: EQuote_1.EQuote.PENDING
    }),
    __metadata("design:type", String)
], Quote.prototype, "status", void 0);
exports.Quote = Quote = __decorate([
    (0, typeorm_1.Entity)()
], Quote);
