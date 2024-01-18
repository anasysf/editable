export interface Options {
  readonly id?: HTMLInputElement['id'];
  readonly name?: HTMLInputElement['name'];
  readonly className?: HTMLInputElement['className'];
  readonly required?: HTMLInputElement['required'];
  readonly readonly?: HTMLInputElement['readOnly'];
  readonly disabled?: HTMLInputElement['disabled'];
  readonly minLength?: HTMLInputElement['minLength'];
  readonly maxLength?: HTMLInputElement['maxLength'];
  readonly pattern?: HTMLInputElement['pattern'];
}
