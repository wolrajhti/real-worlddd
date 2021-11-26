"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryService = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const class_transformer_1 = require("class-transformer");
const version_1 = require("../entities/version");
const visa_1 = require("../valueObjects/visa");
const iVisa_json_1 = __importDefault(require("../valueObjects/schemas/iVisa.json"));
const iVersion_json_1 = __importDefault(require("../entities/schemas/iVersion.json"));
// const schemaFromFilePath = (relativePath: string): object => JSON.parse(fs.readFileSync(path.resolve(process.cwd(), relativePath)).toString());
class FactoryService {
    constructor() {
        this.ajv = new ajv_1.default();
        ajv_formats_1.default(this.ajv);
        this.ajv.addSchema([ /* add dependencies here. They're will be compiled on the fly when referenced by an other schema */]);
        // this.IVisaFn = this.ajv.compile(schemaFromFilePath('./src/domain/valueObjects/schemas/iVisa.json'));
        // this.IVersionFn = this.ajv.compile(schemaFromFilePath('./src/domain/entities/schemas/iVersion.json'));
        this.IVisaFn = this.ajv.compile(iVisa_json_1.default);
        this.IVersionFn = this.ajv.compile(iVersion_json_1.default);
    }
    factory(validateFunction, Ctor, data) {
        if (!validateFunction(data)) {
            throw validateFunction.errors;
        }
        return class_transformer_1.plainToInstance(Ctor, Object.assign(Object.assign({}, new Ctor().toPlain()), data));
    }
    buildVisa(visa) {
        return this.factory(this.IVisaFn, visa_1.Visa, visa);
    }
    buildVersion(version) {
        return this.factory(this.IVersionFn, version_1.Version, version);
    }
}
exports.FactoryService = FactoryService;
