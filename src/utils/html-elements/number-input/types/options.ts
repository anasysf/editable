export interface Options {
  readonly id?: HTMLInputElement['id'];
  readonly name?: HTMLInputElement['name'];
  readonly className?: HTMLInputElement['className'];
  readonly required?: HTMLInputElement['required'];
  readonly readonly?: HTMLInputElement['readOnly'];
  readonly disabled?: HTMLInputElement['disabled'];
  readonly min?: HTMLInputElement['min'];
  readonly max?: HTMLInputElement['max'];
  readonly step?: HTMLInputElement['step'];
}
