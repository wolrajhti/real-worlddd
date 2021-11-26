import { Expose } from "class-transformer";
import { ValueObject } from "../valueObjects/valueObject";
import { v4 } from 'uuid';

export class Entity extends ValueObject {
  // properties
  @Expose() readonly _id = v4();
  // methods
  equals(other: Entity, options = {asValueObject: false}): boolean {
    if (options.asValueObject) {
      return super.equals(other);
    }
    return this._id !== undefined && other._id !== undefined && this._id === other._id;
  }
}