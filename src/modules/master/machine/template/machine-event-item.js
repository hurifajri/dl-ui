export class MachineEventItem {
  activate(context) {
    this.machineEvent = context.data;
    this.error = context.error;
    this.options = context.options;
  } 

  categories = ["maintenance","accident"];

  controlOptions = {
    control: {
      length: 12
    }
  };
}
