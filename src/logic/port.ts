export class Port {
  private buffer: Array<number>;

  constructor() {
    this.buffer = Array<number>();
  }

  getValue(): number {
    if (this.buffer.length === 0) return null;

    return this.buffer.pop();
  }

  setValue(n: number): void {
    if (this.buffer.length > 0) throw Error("Can't write value!");

    this.buffer.push(n);
  }

  hasValue(): boolean {
    return this.buffer.length > 0;
  }
}

export class NullPort extends Port {
  getValue(): number {
    return null;
  }

  setValue(n: number): void {}
}
