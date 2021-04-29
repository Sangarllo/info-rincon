export interface IFile {
  name: string;
  imageFile: File;
  size: string;
  type: string;
}

export interface IImage {
  path: string;
  name: string;
}

const AVATARES = [
  {path: 'assets/images/avatar/000-no-picture.png', name: 'No hay foto'},
  {path: 'assets/images/avatar/001-man.png', name: 'Hombre 0'},
  {path: 'assets/images/avatar/002-girl.png', name: 'Chica 0'},
  {path: 'assets/images/avatar/003-boy.png', name: 'Chico 0'},
  {path: 'assets/images/avatar/004-woman.png', name: 'Mujer 0'},
  {path: 'assets/images/avatar/005-man-1.png', name: 'Hombre 1'},
  {path: 'assets/images/avatar/006-woman-1.png', name: 'Mujer 1'},
  {path: 'assets/images/avatar/007-boy-1.png', name: 'Chico 1'},
  {path: 'assets/images/avatar/008-clown.png', name: 'Payaso'},
  {path: 'assets/images/avatar/009-firefighter.png', name: 'Bombero'},
  {path: 'assets/images/avatar/010-girl-1.png', name: 'Chica 1'},
  {path: 'assets/images/avatar/011-man-2.png', name: 'Hombre 2'},
  {path: 'assets/images/avatar/012-woman-2.png', name: 'Mujer 2'},
  {path: 'assets/images/avatar/013-woman-3.png', name: 'Mujer 3'},
  {path: 'assets/images/avatar/014-man-3.png', name: 'Hombre 3'},
  {path: 'assets/images/avatar/015-woman-4.png', name: 'Mujer 4'},
  {path: 'assets/images/avatar/016-boy-2.png', name: 'Chico 2'},
  {path: 'assets/images/avatar/017-girl-2.png', name: 'Chica 2'},
  {path: 'assets/images/avatar/018-boy-3.png', name: 'Chico 3'},
  {path: 'assets/images/avatar/019-woman-5.png', name: 'Mujer 5'},
  {path: 'assets/images/avatar/020-man-4.png', name: 'Hombre 4'},
  {path: 'assets/images/avatar/021-girl-3.png', name: 'Chica 3'},
  {path: 'assets/images/avatar/022-man-5.png', name: 'Hombre 5'},
  {path: 'assets/images/avatar/023-man-6.png', name: 'Hombre 6'},
  {path: 'assets/images/avatar/024-woman-6.png', name: 'Mujer 6'},
  {path: 'assets/images/avatar/025-boy-4.png', name: 'chico 4'},
  {path: 'assets/images/avatar/026-girl-4.png', name: 'Chica 4'},
  {path: 'assets/images/avatar/027-man-7.png', name: 'Hombre 7'},
  {path: 'assets/images/avatar/028-woman-7.png', name: 'Mujer 7'},
  {path: 'assets/images/avatar/029-man-8.png', name: 'Hombre 8'},
  {path: 'assets/images/avatar/030-policewoman.png', name: 'Mujer Policía'},
  {path: 'assets/images/avatar/031-policeman.png', name: 'Mujer Policía'},
  {path: 'assets/images/avatar/032-girl-5.png', name: 'Chica 5'},
  {path: 'assets/images/avatar/033-superhero.png', name: 'Super Héroe'},
  {path: 'assets/images/avatar/034-woman-8.png', name: 'Mujer Policía'},
  {path: 'assets/images/avatar/035-woman-9.png', name: 'Mujer 9'},
  {path: 'assets/images/avatar/036-man-9.png', name: 'Hombre 9'},
  {path: 'assets/images/avatar/037-arab-woman.png', name: 'Musulmana'},
  {path: 'assets/images/avatar/038-man-10.png', name: 'Hombre 10'},
  {path: 'assets/images/avatar/039-woman-10.png', name: 'Mujer 10'},
  {path: 'assets/images/avatar/040-man-11.png', name: 'Hombre 11'},
  {path: 'assets/images/avatar/041-woman-11.png', name: 'Mujer 11'},
  {path: 'assets/images/avatar/042-vampire.png', name: 'Vampiro'},
  {path: 'assets/images/avatar/043-chef.png', name: 'Cocinero'},
  {path: 'assets/images/avatar/044-farmer.png', name: 'Hombre Chino'},
  {path: 'assets/images/avatar/045-man-12.png', name: 'Hombre 12'},
  {path: 'assets/images/avatar/046-woman-12.png', name: 'Mujer 12'},
  {path: 'assets/images/avatar/047-man-13.png', name: 'Hombre 13'},
  {path: 'assets/images/avatar/048-boy-5.png', name: 'Chico 5'},
  {path: 'assets/images/avatar/049-thief.png', name: 'Ladrón'},
  {path: 'assets/images/avatar/050-catwoman.png', name: 'CatWoman'},
  {path: 'assets/images/avatar/051-american-football-player.png', name: 'Jugador Fútbol'},
  {path: 'assets/images/avatar/052-witch.png', name: 'Bruja'},
  {path: 'assets/images/avatar/053-concierge.png', name: 'Botones'},
  {path: 'assets/images/avatar/054-woman-13.png', name: 'Mujer 13'},
  {path: 'assets/images/avatar/055-bodybuilder.png', name: 'Musculado'},
  {path: 'assets/images/avatar/056-girl-6.png', name: 'Chica 6'},
  {path: 'assets/images/avatar/057-woman-14.png', name: 'Mujer 14'},
  {path: 'assets/images/avatar/058-death.png', name: 'Zombi'},
  {path: 'assets/images/avatar/059-doctor.png', name: 'Doctor 0'},
  {path: 'assets/images/avatar/060-doctor-1.png', name: 'Doctor 1'},
  {path: 'assets/images/avatar/061-nun.png', name: 'Monja'},
  {path: 'assets/images/avatar/062-builder.png', name: 'Constructor'},
  {path: 'assets/images/avatar/063-girl-7.png', name: 'Chica 7'},
  {path: 'assets/images/avatar/064-punk.png', name: 'Punk'},
  {path: 'assets/images/avatar/065-pinup.png', name: 'Pineup'},
  {path: 'assets/images/avatar/066-boy-6.png', name: 'Chico 6'},
  {path: 'assets/images/avatar/067-man-14.png', name: 'Hombre 14'},
  {path: 'assets/images/avatar/068-girl-8.png', name: 'Chica 8'},
  {path: 'assets/images/avatar/069-woman-15.png', name: 'Mujer 15'},
  {path: 'assets/images/avatar/070-man-15.png', name: 'Hombre 15'}
];


export class Avatar implements IImage {

  constructor(
    public path: string,
    public name: string
  ) {
  }

  public static getDefault(): Avatar {
    return {path: 'assets/images/avatar/001-man.png', name: 'man-01'};
  }

  public static getAvatares(): Avatar[] {
    return AVATARES;
  }

  public static getRandom(): Avatar {
    const index = Math.floor(Math.random() * AVATARES.length);
    return AVATARES[index];
  }
}
