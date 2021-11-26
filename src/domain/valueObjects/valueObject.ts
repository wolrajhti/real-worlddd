import { Memoize } from "typescript-memoize";
import hash from 'object-hash';
import { instanceToPlain } from "class-transformer";

export class ValueObject {
  // getters
  @Memoize() get hash(): string {
    return hash(instanceToPlain(this, {excludePrefixes: ['_']}));
  }
  // methods
  @Memoize() toPlain() {
    return instanceToPlain(this);
  }
  equals(other: ValueObject): boolean {
    return this.hash === other.hash;
  }
}