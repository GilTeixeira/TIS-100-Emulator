# TIS-100 Emulator

### [Demo](https://gilteixeira.github.io/feup-asso/)
[<img src="https://github.com/GilTeixeira/feup-asso/blob/master/wiki_patterns/demo.png">](https://gilteixeira.github.io/feup-asso/)

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
- Step over instructions
---

### Architecture

![](https://github.com/GilTeixeira/feup-asso/blob/master/wiki_patterns/arch_diagram.png)

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

#### [State Pattern](https://en.wikipedia.org/wiki/State_pattern)
The behavior of the node changes based on its state. The states `WRTE` and `READ` block the execution of the node until the respective port is either read from or wrote on.

![](https://github.com/GilTeixeira/feup-asso/blob/master/wiki_patterns/State.png)
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

#### [Builder Pattern](https://en.wikipedia.org/wiki/Builder_pattern)
Builder pattern was used to build the TIS-100 nodes using a step by step approach. First the grid of main nodes is created, following by the sources and sinks, finally the ports that connect adjacent are built.

![](https://github.com/GilTeixeira/feup-asso/blob/master/wiki_patterns/builder.png)
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

#### [Iterator Pattern](https://en.wikipedia.org/wiki/Iterator_pattern)

This pattern was used to sequentially access the commands of an array of commands, without the implementation being exposed. Moreover, it was also implemented a way to handle the jumps between the instructions.

![](https://github.com/GilTeixeira/feup-asso/blob/master/wiki_patterns/Iterator.png)
```typescript
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


export abstract class AbsCommand implements ICommand {
  constructor(
    readonly node: BasicExecutionNode,
    readonly labels: string[],
    readonly line: number
  ) {}

  executeRead() {}

  executeWrite() {
    this.node.incIndex()
  }
  
  /** (...) **/
}
```

### React
The UI for this project was developed using [React](https://reactjs.org/). The library was chosen to simplify rendering such a complex state in the browser. The group was already familiar with react so it was straightforward to implement. There are several design patterns that are used by the framework which are present in the project, we'll talk more about some of them below.

#### [Composite Pattern](https://en.wikipedia.org/wiki/Composite_pattern)

One of the central features of react is the components, these components are classes that implement a render method that renders the component straight to the DOM. A component can render other components in it's render method, that in turn will call said component render and so forth.

```js
class Node extends React.Component<NodeProps, NodeState> {
  private nodeInputs: NodeInputs

  constructor(props) {
    super(props)
    this.state = {
      error: null
    }
  }

  render() {
    const ports = this.props.node.getSrcPorts().reduce((ports, port, i) => {
      if (!(port instanceof NullPort))
        ports.push(
          <Port
            key={`port${i}`}
            direction={Directions[i]}
            value={port.getValue()}
          />
        )

      return ports
    }, [])

    return (
      <div className='node' key={this.props.node.getID()}>
        {this.state.error && (
          <div className='errorMessage'>
            <p>{`INVALID TOKEN "${this.state.error.token.toUpperCase()}"`}</p>
          </div>
        )}
        <NodeInputs
          node={this.props.node}
          instructions={this.props.node.getInstructions()}
          locked={this.props.locked}
          updateInstructions={this.updateInstructions.bind(this)}
          ref={ref => (this.nodeInputs = ref)}
        />
        <div className='info'>
          <NodeDisplay tooltip='ACC' value={this.props.node.getACC()} />
          <NodeDisplay tooltip='BAK' value={`<${this.props.node.getBAK()}>`} />
          <NodeDisplay tooltip='LAST' value='N/A' />
          <NodeDisplay tooltip='MODE' value={this.props.node.getState()} />
        </div>
        {ports}
      </div>
    )
  }

  ...
  
}

```

#### [Model-View-Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)

React mostly follows the MVC pattern in it's functionality, a View, in this case called a component, displays a Model's data to the user, in this case the TIS-100 logic. The Controller that manipulates the model is also implemented in the components, such as EventListeners for buttons and inputs. When the user changes anything the tis-100 object is updated internally in the React state, causing the framework to re-render the views with the new state.

An example of the interaction described above can be seen below
```typescript
stop() {
    if (this.state.state === State.ERROR) return

    if (this.state.state !== State.IDLE) {
      this.setState(state => ({ ...state, state: State.IDLE }))
      clearInterval(this.interval)
    }

    this.state.tis_100.stop()
    this.refreshRender()
  }
```
When `stop()` is called by the user pressing the stop button, the internal componnent state is updated which in turn updates the component in the browser.

#### [State Pattern](https://en.wikipedia.org/wiki/State_pattern)

Each react component has it's own state, changes to the component state force the component and its children to be re-rendered with the updated state.

```typescript
class App extends React.Component<AppProps, AppState> {

  constructor(props) {
    super(props)

    this.state = {
      tis_100: new Tis100(levels[0]),
      state: State.IDLE,
      currentLevel: 0
    }
  }

  ...
  
}
```

---


### Design Review

#### Does the architecture satisfy the requirements?
The finished architecture models everything that was proposed in the beginning. Implementing non-functional requirements is specified in the system architecture, since these requirements are architecturally significant, the architecture was specially planed with the requirements in mind thus allowing for modular, extensible and efficient code. 

#### Is effective modularity achieved?
The TIS-100 machine logic is completely isolated from the UI components, if a new machine is created and updated in the App controller state, this new machine would be rendered without requiring anything else to be changed in the view layer. The software components are loosely-coupled while maintaining a high cohesion within each module.

#### Has maintainability been considered?
New functionalities and tests should be straightforward to implement since all of the TIS-100 functionality is properly divided assuring a high level of cohesion in the code. Many patterns implemented provide a clearer way for code to be presented and developed, thus allowing for better maintainability. Plus the low coupling and high cohesion support also better readability and maintainability.

#### Have quality factors been explicitly assessed?
There are tests to assert that some logic functionalities work properly, more test should be implemented for a more thorough coverage of the logic codebase. No tests were implemented for the UI layer built with React.
All of the code was linted to assure a certain code quality and best practices.

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

Original TIS-100 game by [Zacktronics](http://www.zachtronics.com/tis-100/)


