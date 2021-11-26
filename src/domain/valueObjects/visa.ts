import { Expose } from "class-transformer";
import { IVisa } from "./types/iVisa";
import { ValueObject } from "./valueObject";

export class Visa extends ValueObject implements IVisa {
  // properties
  @Expose() readonly authorId = '';
  @Expose() readonly comment?: string;
  @Expose() readonly statusId = '';
  // methods
  test(): void {
    console.log('test from visa !');
  }
}