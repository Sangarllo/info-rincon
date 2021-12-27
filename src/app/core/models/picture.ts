export interface IPicture {
  id: string;
  active: boolean;
  path: string;
  timestamp: string;
  userId: string;
}

export class Picture implements IPicture {

  public static PATH_URL = 'pictures';
  public static IMAGE_DEFAULT = 'assets/images/events/default.png';

  static THUMB_SIZE = '200x200';
  static MEDIUM_SIZE = '600x600';

  constructor(
    public id: string,
    public active: boolean,

    public path: string,
    public timestamp: string,
    public userId: string,
  ) { }

  static InitDefault(): Picture {
    return new Picture(
      '0',
      true, // Active
      Picture.IMAGE_DEFAULT, // Path
      null, // Timestamp
      null, // UserId
    );
  }

  static InitByPath(path: string): Picture {
    return new Picture(
      path,
      true, // Active
      path,
      null, // Timestamp
      null, // UserId
    );
  }

  static GeneratedByPath(path: string): Picture {
    return new Picture(
      '0',
      true, // Active
      path,
      null, // Timestamp
      null, // UserId
    );
  }

  static resizedName(fileName, dimensions): string {
    const extIndex = fileName.lastIndexOf('.');
    const ext = fileName.substring(extIndex);
    return `${fileName.substring(0, extIndex)}_${dimensions}${ext}`;
  }

  static getImageIdFromPicture(picture: Picture): string {
    if (picture.id === '0') {
      return picture.path;
    } else {
      return picture.id;
    }
  }
}
