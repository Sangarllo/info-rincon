import { IBase, BaseType } from '@models/base';
import { Category } from '@models/category.enum';
import { Place } from '@models/place';
import { EntityRole, ENTITY_ROLES } from '@models/entity-role.enum';
import { ScheduleType, SCHEDULE_TYPES, SCHEDULE_TYPE_DEFAULT } from '@models/shedule-type.enum';

export interface IEntity {
  id: string;
  active: boolean;
  name: string;
  image: string;
  baseType: BaseType;
  categories?: Category[];
  description?: string;
  place?: Place;
  roleDefault?: EntityRole;
  scheduleTypeDefault?: ScheduleType;
}

export class Entity implements IEntity, IBase {

  public static IMAGE_DEFAULT = 'assets/images/entities/default.png';
  public static NAME_DEFAULT = 'SIN ESPECIFICAR';
  public static PATH_URL = 'entidades';
  public static ROLES: EntityRole[] = ENTITY_ROLES;
  public static SCHEDULE_TYPES: ScheduleType[] = SCHEDULE_TYPES;

  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public image: string,
    public baseType: BaseType,
    public categories?: Category[],
    public description?: string,
    public place?: Place,
    public roleDefault?: EntityRole,
    public scheduleTypeDefault?: ScheduleType,
     ) {
  }

  static InitDefault(): Entity {
    return new Entity(
      '0', true, Entity.NAME_DEFAULT, Entity.IMAGE_DEFAULT, BaseType.ENTITY, // Base
      [],
      null,
      null,
      null,
      SCHEDULE_TYPE_DEFAULT
    );
  }
}
