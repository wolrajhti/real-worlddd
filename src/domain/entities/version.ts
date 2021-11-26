import { Expose, Type } from "class-transformer";
import { IVersion } from "./types/iVersion";
import { Visa } from "../valueObjects/visa";
import { Entity } from "./entity";

export class Version extends Entity implements IVersion {
  // properties
  @Expose() readonly indice = 0;
  @Type(() => Visa)
  @Expose() readonly visas: readonly Visa[] = [];
  @Type(() => Visa)
  @Expose() readonly topVisa?: Visa;
  // methods
  test(): void {
    console.log('test from version !');
  }
}