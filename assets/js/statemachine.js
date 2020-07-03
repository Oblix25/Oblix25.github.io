export class StateMachine {
  constructor(initialState, possibleStates, stateArgs=[]) {
    this.initialState = initialState;
    this.possibleStates = possibleStates;
    this.stateArgs = stateArgs;
    this.stateStack = [];
    this.stateStack.unshift(initialState);
    this.state = null;

    // State instances get access to the state machine via this.stateMachine.
    for (const state of Object.values(this.possibleStates)) {
      state.stateMachine = this;
    }
  }

  step(...stepArgs) {
    // On the first step, the state is null and we need to initialize the first state.
    if (this.state === null) {
      this.state = this.initialState;
      this.possibleStates[this.state].enter(...this.stateArgs);
    }

    // Run the current state's execute
    this.possibleStates[this.state].execute(...this.stateArgs, ...stepArgs);
  }

  transition(newState, ...enterArgs) {

    this.possibleStates[this.state].exit(...this.stateArgs);
    this.stateStack.unshift(newState);
    this.state = this.stateStack[0];
    this.stateStack.splice(3);
    this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs);
  }

  // return to previous state
  rewind() {

      if(this.stateStack[1]){           //check if there's even a state to switch to

        this.possibleStates[this.state].exit(...this.stateArgs);
        this.stateStack.unshift(this.stateStack[1]);         //if so, pop out the current state and switch to the new one
        this.state = this.stateStack[0];
        this.possibleStates[this.state].enter(...this.stateArgs);
      }
    }
}

export class State {
  enter() {

  }

  execute() {

  }

  exit() {

  }
}
