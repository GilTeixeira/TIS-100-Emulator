# TIS-100 Emulator
TIS-100 is an open-ended programming game in which you rewrite corrupted code segments to repair the TIS-100 and unlock its secrets. It’s the assembly language programming game you never asked for!

---
### [Demo](https://gilteixeira.github.io/feup-asso/)
![](https://github.com/GilTeixeira/feup-asso/blob/master/wiki_patterns/demo.png)

---

### Objective

Develop a [TIS-100](http://www.zachtronics.com/tis-100/) clone, a programming game that has a grid of nodes that communicate using ports and read an assembly like language.

---

### Goals

- Develop using web technologies
- Client-side (running in the browser)
- Faithful recreation of the original language (can use the same manual)
- Faithful recreation of node behaviour
- No limitations on grid size, unlike the fixed 3x4 of the original game
---

### Functionalities
- Support for multiple levels.
- Parse and Error handling of users' input.
- 
---

---
### Architecture

Placeholder:
![](https://i.imgur.com/0y4YZD7.png)

### Design Patterns Used

#### [Command Pattern](https://en.wikipedia.org/wiki/Command_pattern)
An instruction is wrapped under an object as an command and passed to the object Node. The Node object then has all information needed to perform an action, such as the parameters of the command. 

![](https://github.com/GilTeixeira/feup-asso/blob/master/wiki_patterns/commandPattern.png)
```typescript
export class BasicExecutionNode extends Node {

  private commands: Command[] = []
  private index: number = -1

  ...

}

export default interface ICommand {
  node: BasicExecutionNode
  line: number

  executeRead(): void
  executeWrite(): void

  execute(): void

  getLabels(): string[]
  getLine(): number
}

export abstract class AbsCommand implements ICommand  {  ...  }

export class NopCommand extends AbsCommand {  ...  }

export class MovCommand extends AbsCommand {

  ...

  executeRead() {
    if (this.node.getState() === NodeState.WRTE) return

    this.valRead = this.src.readValue()
    if (this.valRead == null) {
      this.node.setState(NodeState.READ)
    }

    super.executeRead()
  }

  executeWrite() {
    if (this.valRead == null) return

    if (this.node.getState() !== NodeState.WRTE) this.dst.writeValue(this.valRead)

    if (this.dst.hasValue()) {
      this.node.setState(NodeState.WRTE)
    } else {
      this.node.setState(NodeState.RUN)
      this.valRead = null
      super.executeWrite()
    }
  }

  ...

}

export class SwpCommand extends AbsCommand {  ...  }

export class SavCommand extends AbsCommand {  ...  }

export class AddCommand extends AbsCommand {  ...  }

export class SubCommand extends AbsCommand {  ...  }

export class NegCommand extends AbsCommand {  ...  }

export class JmpCommand extends AbsCommand {  ...  }

export class JezCommand extends AbsCommand {  ...  }

export class JnzCommand extends AbsCommand {  ...  }

export class JgzCommand extends AbsCommand {  ...  }

export class JlzCommand extends AbsCommand {  ...  }

export class JroCommand extends AbsCommand {  ...  }
```

#### [Null Object Pattern](https://en.wikipedia.org/wiki/Null_object_pattern)
A null object replaces check of NULL object instance. Instead of checking if the buffer if full or empty an NullPort object is called that performs no action.

![](https://github.com/GilTeixeira/feup-asso/blob/master/wiki_patterns/null%20object.svg)
```typescript
class Port {
  private buffer: number[]
  constructor() {
    this.buffer = []
  }

  popValue(): number {
    if (this.buffer.length === 0) return null

    return this.buffer.pop()
  }
  setValue(n: number): void {
    if (this.buffer.length > 0) throw Error('Can\'t write value!')

    this.buffer.push(n)
  }

  ...

}
class NullPort extends Port {
  popValue(): number {
    return null
  }
  setValue(n: number): void {}
}

```
#### [Builder Pattern](https://en.wikipedia.org/wiki/Builder_pattern)
```typescript
class NodeFactory {
  private nodeGrid: BasicExecutionNode[][]
  private sources: Source[]
  private sinks: Sink[]

  constructor(
    private sizeX: number,
    private sizeY: number,
    private sourcesPos: number[],
    private sinksPos: number[]
  ) {
    this.buildNodeGrid()
    this.buildSources()
    this.buildSinks()
    this.initPorts()
  }

}
```
#### [State Pattern](https://en.wikipedia.org/wiki/State_pattern)
The behavior of the node changes based on its state.

```typescript

export enum NodeState {
  IDLE = 'IDLE',
  RUN = 'RUN',
  READ = 'READ',
  WRTE = 'WRTE'
}

export abstract class Node {
  protected state: NodeState = NodeState.IDLE

  ...

  setState(newState: NodeState) {
    this.state = newState
  }

  getState(): NodeState {
    return this.state
  }

  ...

}

```

#### [Builder](https://en.wikipedia.org/wiki/Builder_pattern)
Builder pattern was used to build the TIS-100 nodes using a step by step approach. First the grid of main nodes is created, following by the sources and sinks, finally the ports that connect adjacent are built.

```typescript

export class NodeBuilder {
  private nodeGrid: BasicExecutionNode[][]
  private sources: Source[]
  private sinks: Sink[]

  constructor(
    private sizeX: number,
    private sizeY: number,
    private sourcesPos: number[],
    private sinksPos: number[]
  ) {
    this.buildNodeGrid()
    this.buildSources()
    this.buildSinks()
    this.initPorts()
  }

  private buildNodeGrid(): void {
    this.nodeGrid = []
    for (let i = 0; i < this.sizeY; i++) {
      this.nodeGrid[i] = []
      for (let j = 0; j < this.sizeX; j++) {
        this.nodeGrid[i][j] = new BasicExecutionNode()
      }
    }
  }

  ...

}

```

#### [Iterator](https://en.wikipedia.org/wiki/Iterator_pattern)

This pattern was used to sequentially access the commands of an array of commands, without the implementation being exposed. Moreover, it was also implemented a way to handle the jumps between the instructions.
```
class BasicExecutionNode extends Node {
  private commands: Command[] = []
  private index: number = -1

  setIndex(i: number) {
    this.index = i
  }
  getIndex(): number {
    return this.index
  }
  incIndex() {
    if (++this.index >= this.commands.length) this.index = 0
  }
}
```

### React
The UI for this project was developed using [React](https://reactjs.org/). The library was chosen to simplify rendering such a complex state in the browser. The group was already familiar with react so it was straightforward to imlement. There are several design patterns that are used by the framework which are then used in the final project, we'll talk more about some of them below.

#### [Composite Pattern](https://en.wikipedia.org/wiki/Composite_pattern)

#### [Model-View-Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
---


### Design Review


#### Does the architecture satisfy the requirements?

#### Is effective modularity achieved?

#### Are interfaces defined for modules and external system elements?

#### Is the structure of the data and its organisation consistent with the domain of the requirements?

#### Is the structure of the data consistent with the requirements?

#### Has maintainability been considered?

#### Have quality factors been explicitly assessed?

### Building the project
In the project directory, you can run:
```
yarn install
yarn start
```
Open http://localhost:3000 to view it in the browser.

---

### The Developers

- [Gil Teixeira](https://github.com/GilTeixeira)
- [João Lago](https://github.com/joaolago1337)
- [Paulo Correia](https://github.com/Pipas)


