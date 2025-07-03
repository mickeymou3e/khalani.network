import { Sdk } from '../sdk';
import { Approval } from './common/approval';
import { Approvable } from '../sdk/Approvable';

export class E2eToolset {

  constructor(private sdk: Sdk) {
  }

  approval(approvable: Approvable) {
    return new Approval(this.sdk, approvable);
  }

}