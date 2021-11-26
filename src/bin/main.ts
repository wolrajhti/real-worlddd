import 'reflect-metadata';
import { FactoryService } from '../domain/services/factory.service';
import { v4 } from 'uuid';

const factory = new FactoryService();

const visa1 = factory.buildVisa({authorId: v4(), statusId: v4()});
const visa2 = factory.buildVisa({authorId: v4(), statusId: v4()});
const version1 = factory.buildVersion({indice: 45, visas: []});
const version2 = factory.buildVersion({indice: 45, visas: []});

console.log(version1.equals(version2));
console.log(version1.equals(version2, {asValueObject: true}));