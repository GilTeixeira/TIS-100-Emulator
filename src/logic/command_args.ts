import { BasicExecutionNode } from './node'
import { Directions } from './macros'

export abstract class AbsArgument {
  isNumber: boolean = false
  isDirection: boolean = false
  isACC: boolean = false

  readValue(): number {
    throw Error("Can't read value!")
  }

  writeValue(val: number): void {
    throw Error("Can't write value!")
  }

  hasValue(): boolean {
    throw Error("Can' check buffer!")
  }
}

export class ArgumentValue extends AbsArgument {
  constructor(readonly value: number) {
    super()
    this.isNumber = true
  }

  readValue(): number {
    return this.value
  }
}

export class ArgumentACC extends AbsArgument {
  constructor(readonly node: BasicExecutionNode) {
    super()
    this.isACC = true
  }

  readValue(): number {
    return this.node.getACC()
  }

  writeValue(val: number): void {
    this.node.setACC(val)
  }

  hasValue(): boolean {
    return false
  }
}

export class ArgumentDir extends AbsArgument {
  constructor(
    readonly node: BasicExecutionNode,
    readonly direction: Directions
  ) {
    super()
    this.isDirection = true
  }

  readValue(): number {
    return this.node.readNumber(this.direction)
  }

  writeValue(val: number): void {
    this.node.pushNumber(this.direction, val)
  }

  hasValue(): boolean {
    return this.node.hasValue(this.direction)
  }
}
