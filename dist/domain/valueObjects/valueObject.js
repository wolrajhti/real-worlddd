"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = void 0;
const typescript_memoize_1 = require("typescript-memoize");
const object_hash_1 = __importDefault(require("object-hash"));
const class_transformer_1 = require("class-transformer");
class ValueObject {
    // getters
    get hash() {
        return object_hash_1.default(class_transformer_1.instanceToPlain(this, { excludePrefixes: ['_'] }));
    }
    // methods
    toPlain() {
        return class_transformer_1.instanceToPlain(this);
    }
    equals(other) {
        return this.hash === other.hash;
    }
}
__decorate([
    typescript_memoize_1.Memoize()
], ValueObject.prototype, "hash", null);
__decorate([
    typescript_memoize_1.Memoize()
], ValueObject.prototype, "toPlain", null);
exports.ValueObject = ValueObject;
