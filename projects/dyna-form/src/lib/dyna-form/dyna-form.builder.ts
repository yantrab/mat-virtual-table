import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DynaValidator } from './dyna.validator';
import { validate } from 'class-validator';
// @dynamic
@Injectable()
export class DynaFormBuilder {
  constructor(public fb: FormBuilder) { }

  public async buildFormFromClass(classConstructor: new (model) => any): Promise<FormGroup> {
    const classInstance = new classConstructor({});
    const formControls = {};
    const formFieldList: any = [];
    // just to get the properties...
    const errors = await validate(classInstance);
    errors.map(e => e.property).forEach((key) => {
      formControls[key] = new FormControl(null, DynaValidator.validateControl(classConstructor));
      formFieldList.push(key);
    });

    const formInstance = this.fb.group(formControls);
// tslint:disable-next-line: no-string-literal
    formInstance['formFields'] = formFieldList;

    return formInstance;
  }
}

export const validateAllFields = (formGroup: FormGroup) => {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.validateAllFields(control);
    }
  });
};