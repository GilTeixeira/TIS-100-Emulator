import { Port, NullPort } from './port'
import { Directions, Status } from './macros'
import Command from './commands'

export class BasicExecutionNode {

    private ACC : number = 0
    private BAK : number = 0
    private dstPorts : Port[]
    private srcPorts : Port[]
    private commands : Command[];
    private index: number = 0;

    public state : Status = Status.IDLE;

    getNumberLines(): number{
        return this.commands.length;
    }
    getACC(): number{
        return this.ACC;
    }
    setACC(vl: number): void{
        this.ACC = vl;
    }
    getBAK(): number{
        return this.BAK;
    }
    setBAK(vl: number){
        this.BAK = vl;
    }
    findIndex(label: string): number {
        for(var i = 0; i < this.commands.length; i++){
            if(this.commands[i].getLabel() == label)
                return i;
        }
        throw new Error("Label not found.");
    }
    setIndex(i: number) {
        this.index = i;
    }
    getIndex(): number {
        return this.index;
    }
    incIndex() {
        this.index++;
    }

    constructor() {
        this.dstPorts = [new NullPort(), new NullPort(), new NullPort(), new NullPort()]
        this.srcPorts = [new NullPort(), new NullPort(), new NullPort(), new NullPort()]
    }

    setState(newState: Status) {
        this.state = newState;
    }

    getState() : Status {
        return this.state;
    }

    setDstPort(direction : Directions, dstPort : Port) {
        this.dstPorts[direction] = dstPort
    }

    setSrcPort(direction : Directions, srcPort : Port) {
        this.srcPorts[direction] = srcPort
    }

    pushNumber(direction : Directions, n : number): void {
        this.dstPorts[direction].setValue(n)
    }

    readNumber(direction : Directions) : number {
        return this.srcPorts[direction].getValue();
    }

    hasValue(direction: Directions) : boolean {
        return this.srcPorts[direction].hasValue();
    }

    step(){
        if (this.state == Status.WRTE) {
            // check where written if buffer empty then index++
        }

        this.commands[this.index].executeRead();
    }
}