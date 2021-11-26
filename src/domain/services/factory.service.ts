import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { plainToInstance } from 'class-transformer';
// import * as fs from 'fs';
// import * as path from 'path';
import { IVersion } from '../entities/types/iVersion';
import { Version } from '../entities/version';
import { IVisa } from '../valueObjects/types/iVisa';
import { ValueObject } from '../valueObjects/valueObject';
import { Visa } from '../valueObjects/visa';
import visaSchema from '../valueObjects/schemas/iVisa.json';
import versionSchema from '../entities/schemas/iVersion.json';

// const schemaFromFilePath = (relativePath: string): object => JSON.parse(fs.readFileSync(path.resolve(process.cwd(), relativePath)).toString());

export class FactoryService {
  private readonly ajv: Ajv;
  private readonly IVisaFn: ValidateFunction;
  private readonly IVersionFn: ValidateFunction;

  constructor() {
    this.ajv = new Ajv();
    addFormats(this.ajv);
    this.ajv.addSchema([/* add dependencies here. They're will be compiled on the fly when referenced by an other schema */]);
    // this.IVisaFn = this.ajv.compile(schemaFromFilePath('./src/domain/valueObjects/schemas/iVisa.json'));
    // this.IVersionFn = this.ajv.compile(schemaFromFilePath('./src/domain/entities/schemas/iVersion.json'));
    this.IVisaFn = this.ajv.compile(visaSchema);
    this.IVersionFn = this.ajv.compile(versionSchema);
  }
  private factory<I, T extends ValueObject & I>(validateFunction: ValidateFunction, Ctor: {new(): T}, data: I): T {
    if (!validateFunction(data)) {
      throw validateFunction.errors;
    }
    return plainToInstance(Ctor, {...new Ctor().toPlain(), ...data});
  }
  buildVisa(visa: IVisa): Visa {
    return this.factory(this.IVisaFn, Visa, visa);
  }
  buildVersion(version: IVersion): Version {
    return this.factory(this.IVersionFn, Version, version);
  }
}