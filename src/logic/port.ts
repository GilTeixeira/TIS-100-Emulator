export class Port {
  private buffer: number[];

  constructor() {
    this.buffer = Array<number>();
  }

  popValue(): number {
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

  getValue(): number {
    return this.buffer[0];
  }
}

export class NullPort extends Port {
  popValue(): number {
    return null;
  }

  setValue(n: number): void {}
}
