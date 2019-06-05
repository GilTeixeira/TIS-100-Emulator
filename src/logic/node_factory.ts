import { BasicExecutionNode } from './node'
import { Port } from './port'
import { Directions } from './macros'

export class NodeFactory {

    private nodeGrid : BasicExecutionNode[][]

    constructor(private x : number, private y : number) {
        this.nodeGrid = []

        for (let i = 0; i < y; i++) {
            this.nodeGrid[i] = []
            for (let j = 0; j < x; j++) {
                this.nodeGrid[i][j] = new BasicExecutionNode()
            }
        }

        for (let i = 0; i < y; i++) {
            for (let j = 0; j < x; j++) {
                this.initDstPorts(j, i);
            }
        }
    }

    private initDstPorts(posX : number, posY : number) {
        if(posY - 1 >= 0) {
            let upPort = new Port()
            this.nodeGrid[posY][posX].setDstPort(Directions.UP, upPort)
            this.nodeGrid[posY - 1][posX].setSrcPort(Directions.DOWN, upPort)
        }
        if(posY + 1 < this.y) {
            let downPort = new Port()
            this.nodeGrid[posY][posX].setDstPort(Directions.DOWN, downPort)
            this.nodeGrid[posY + 1][posX].setSrcPort(Directions.UP, downPort)
        }
        if(posX - 1 >= 0) {
            let leftPort = new Port()
            this.nodeGrid[posY][posX].setDstPort(Directions.LEFT, leftPort)
            this.nodeGrid[posY][posX - 1].setSrcPort(Directions.RIGHT, leftPort)
        }
        if(posX + 1 < this.x) {
            let rightPort = new Port()
            this.nodeGrid[posY][posX].setDstPort(Directions.RIGHT, rightPort)
            this.nodeGrid[posY][posX + 1].setSrcPort(Directions.LEFT, rightPort)
        }
    }

    getGrid() : BasicExecutionNode[][] {
        return this.nodeGrid
    }

}