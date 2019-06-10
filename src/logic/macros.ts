export enum Directions {
  UP,
  RIGHT,
  DOWN,
  LEFT,
  ANY,
  LAST
}

// export enum Directions {
//   UP = "UP",
//   RIGHT = "RIGHT",
//   DOWN = "DOWN",
//   LEFT = "LEFT",
//   ANY = "ANY",
//   LAST = "LAST"
// }

export enum Status {
  IDLE = "IDLE",
  RUN = "RUN",
  READ = "READ",
  WRTE = "WRITE"
}

export enum Instructions {
  NOP = "NOP",
  SWP = "SWP",
  SAV = "SAV",
  NEG = "NEG",
  SUB = "SUB",
  ADD = "ADD",
  MOV = "MOV",
  JMP = "JMP",
  JEZ = "JEZ",
  JNZ = "JNZ",
  JGZ = "JGZ",
  JLZ = "JLZ",
  JRO = "JRO"
}
