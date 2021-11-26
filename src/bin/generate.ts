import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { compileFromFile } from 'json-schema-to-typescript';

// convert every ./src/**/schemas/*.json to ./src/**/types/*.json
function traverse(dir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, {withFileTypes: true}, async (err, files) => {
      if (err) {
        return reject(err);
      }
      await Promise.all(files.map(async file => {
        if (file.isFile() && path.extname(file.name) === '.json' && path.parse(dir).name === 'schemas') {
          const schemaPath = dir + '/' + file.name;
          const tsFile = await compileFromFile(schemaPath, {});
          const typePath = (dir + '/').replace('/schemas/', '/types/');
          await new Promise<void>((res, rej) => {
            fs.mkdir(typePath, {recursive: true}, (err) => err ? rej(err) : res());
          });
          const tsTransformedFile = ensureReadonly(tsFile);
          await new Promise<void>((res, rej) => {
            fs.writeFile(typePath + file.name.replace('.json', '.d.ts'), tsTransformedFile, (err) => err ? rej(err) : res());
          });
          console.log(`success ${typePath + file.name.replace('.json', '.d.ts')}`);
          return;
        } else if (file.isDirectory()) {
          return traverse(dir + '/' + file.name);
        }
      }));
      resolve();
    });
  })
}

// add readonly keyword for arrays
function ensureReadonly(tsFile: string): string {
  const sourceFile = ts.createSourceFile('main.ts', tsFile, ts.ScriptTarget.ES2015);

  const transformerFactory: ts.TransformerFactory<ts.SourceFile> = (context) => (bundle) => {
    function visitor(node: ts.Node): ts.Node {
      if (ts.isArrayTypeNode(node)) {
        return context.factory.createTypeOperatorNode(ts.SyntaxKind.ReadonlyKeyword, node);
      }
      return ts.visitEachChild(node, visitor, context);
    }
    return ts.visitNode(bundle, visitor);
  };

  const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});

  return printer.printFile(ts.transform(sourceFile, [transformerFactory]).transformed[0]);
}

traverse(path.resolve(process.cwd(), './src'));
