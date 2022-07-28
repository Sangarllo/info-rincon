export interface IEventRef {
  id: string;
  name: string;
  imageId: string;
  imagePath: string;
  dateStr: string;
  timeStr: string;
  eventId?: string;
  description?: string;
}

export class EventRef implements IEventRef {

    constructor(
      public id: string,
      public name: string,
      public imageId: string,
      public imagePath: string,
      public dateStr: string,
      public timeStr: string,
      public eventId?: string,
      public description?: string,
    ) { }

    static arrayMove(array: IEventRef[], oldIndex: number, newIndex: number): IEventRef[] {
      if (newIndex >= array.length) {
          let k = newIndex - array.length + 1;
          while (k--) {
            array.push(undefined);
          }
      }
      array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
      return array; // for testing
  };

}
