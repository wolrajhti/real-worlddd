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
const typescript_1 = __importDefault(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
// convert every ./src/**/schemas/*.json to ./src/**/types/*.json
function traverse(dir) {
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(dir, { withFileTypes: true }, (err, files) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return reject(err);
            }
            yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                if (file.isFile() && path_1.default.extname(file.name) === '.json' && path_1.default.parse(dir).name === 'schemas') {
                    const schemaPath = dir + '/' + file.name;
                    const tsFile = yield json_schema_to_typescript_1.compileFromFile(schemaPath, {});
                    const typePath = (dir + '/').replace('/schemas/', '/types/');
                    yield new Promise((res, rej) => {
                        fs_1.default.mkdir(typePath, { recursive: true }, (err) => err ? rej(err) : res());
                    });
                    const tsTransformedFile = ensureReadonly(tsFile);
                    yield new Promise((res, rej) => {
                        fs_1.default.writeFile(typePath + file.name.replace('.json', '.d.ts'), tsTransformedFile, (err) => err ? rej(err) : res());
                    });
                    console.log(`success ${typePath + file.name.replace('.json', '.d.ts')}`);
                    return;
                }
                else if (file.isDirectory()) {
                    return traverse(dir + '/' + file.name);
                }
            })));
            resolve();
        }));
    });
}
// add readonly keyword for arrays
function ensureReadonly(tsFile) {
    const sourceFile = typescript_1.default.createSourceFile('main.ts', tsFile, typescript_1.default.ScriptTarget.ES2015);
    const transformerFactory = (context) => (bundle) => {
        function visitor(node) {
            if (typescript_1.default.isArrayTypeNode(node)) {
                return context.factory.createTypeOperatorNode(typescript_1.default.SyntaxKind.ReadonlyKeyword, node);
            }
            return typescript_1.default.visitEachChild(node, visitor, context);
        }
        return typescript_1.default.visitNode(bundle, visitor);
    };
    const printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
    return printer.printFile(typescript_1.default.transform(sourceFile, [transformerFactory]).transformed[0]);
}
traverse(path_1.default.resolve(process.cwd(), './src'));
