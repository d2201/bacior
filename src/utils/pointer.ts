export class Pointer<T> {
  constructor(private entity: T) {}

  set(newEntity: T) {
    this.entity = newEntity
  }

  resolve(): T {
    return this.entity
  }
}
