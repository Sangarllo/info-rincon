export interface IPicture {
  id: string;
  active: boolean;
  path: string;
  timestamp: string;
  userId: string;
}

export class Picture implements IPicture {

  public static PATH_URL = 'pictures';
  // eslint-disable-next-line max-len
  public static IMAGE_DEFAULT = 'https://firebasestorage.googleapis.com/v0/b/info-rincon.appspot.com/o/thumbnails%2Fdefault.png?alt=media&token=8a8dfc31-8c43-43ff-8c7e-a965b377fe41';

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
