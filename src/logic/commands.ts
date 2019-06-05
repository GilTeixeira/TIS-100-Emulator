import { BasicExecutionNode } from "./node";
import { Status } from "./macros";
import { AbsArgument } from "./command_args";

export default interface ICommand {
  node: BasicExecutionNode;

  executeRead(): void;
  executeWrite(): void;

  execute(): void;

  getLabel(): string;
}

export abstract class AbsCommand implements ICommand {
  constructor(readonly node: BasicExecutionNode, readonly label: string) {}

  executeRead() {}

  executeWrite() {
    this.node.incIndex();
  }

  execute(): void {
    this.executeRead();
    this.executeWrite();
  }

  getLabel(): string {
    return this.label;
  }
}

export class NopCommand extends AbsCommand {
  executeRead() {
    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}

export class MovCommand extends AbsCommand {
  constructor(
    node: BasicExecutionNode,
    label: string,
    readonly src: AbsArgument,
    private dst: AbsArgument
  ) {
    super(node, label);
  }

  private valRead: number = null;
  private state: Status;

  executeRead() {
    if (this.node.getState() === Status.WRTE) return;

    this.valRead = this.src.readValue();
    if (this.valRead == null) {
      this.node.setState(Status.READ);
    }

    super.executeRead();
  }

  executeWrite() {
    if (this.valRead == null) return;

    if (this.node.getState() !== Status.WRTE) this.dst.writeValue(this.valRead);

    if (this.dst.hasValue()) {
      this.node.setState(Status.WRTE);
    } else {
      this.node.setState(Status.RUN);
      this.valRead = null;
      super.executeWrite();
    }
  }
}

export class SwpCommand extends AbsCommand {
  executeRead() {
    this.node.setBAK(this.node.getBAK() + this.node.getACC());
    this.node.setACC(this.node.getBAK() - this.node.getACC());
    this.node.setBAK(this.node.getBAK() - this.node.getACC());

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}

export class SavCommand extends AbsCommand {
  executeRead() {
    this.node.setBAK(this.node.getACC());

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}

export class AddCommand extends AbsCommand {
  constructor(
    node: BasicExecutionNode,
    label: string,
    readonly src: AbsArgument
  ) {
    super(node, label);
  }

  executeRead() {
    let readValue: number = this.src.readValue();
    if (readValue == null) {
      this.node.setState(Status.READ);
      return;
    }

    this.node.setACC(this.node.getACC() + readValue);

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}

export class SubCommand extends AbsCommand {
  constructor(
    node: BasicExecutionNode,
    label: string,
    readonly src: AbsArgument
  ) {
    super(node, label);
  }

  executeRead() {
    let readValue: number = this.src.readValue();
    if (readValue == null) {
      this.node.setState(Status.READ);
      return;
    }

    this.node.setACC(this.node.getACC() - readValue);

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}

export class NegCommand extends AbsCommand {
  executeRead() {
    this.node.setACC(-1 * this.node.getACC());

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}

export class JmpCommand extends AbsCommand {
  constructor(node: BasicExecutionNode, label: string, readonly src: string) {
    super(node, label);
  }

  executeRead() {
    this.node.setIndex(this.node.findIndex(this.src) - 1);

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}

export class JezCommand extends AbsCommand {
  constructor(node: BasicExecutionNode, label: string, readonly src: string) {
    super(node, label);
  }

  executeRead() {
    if (this.node.getACC() === 0)
      this.node.setIndex(this.node.findIndex(this.src) - 1);

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}

export class JnzCommand extends AbsCommand {
  constructor(node: BasicExecutionNode, label: string, readonly src: string) {
    super(node, label);
  }

  executeRead() {
    if (this.node.getACC() !== 0)
      this.node.setIndex(this.node.findIndex(this.src) - 1);

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}

export class JgzCommand extends AbsCommand {
  constructor(node: BasicExecutionNode, label: string, readonly src: string) {
    super(node, label);
  }

  executeRead() {
    if (this.node.getACC() > 0)
      this.node.setIndex(this.node.findIndex(this.src) - 1);

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}
export class JlzCommand extends AbsCommand {
  constructor(node: BasicExecutionNode, label: string, readonly src: string) {
    super(node, label);
  }

  executeRead() {
    if (this.node.getACC() < 0)
      this.node.setIndex(this.node.findIndex(this.src) - 1);

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}
export class JroCommand extends AbsCommand {
  constructor(node: BasicExecutionNode, label: string, readonly src: number) {
    super(node, label);
  }

  executeRead() {
    if (this.node.getACC() < 0)
      this.node.setIndex(this.node.getIndex() + this.src - 1);

    super.executeRead();
  }

  executeWrite() {
    super.executeWrite();
  }
}
