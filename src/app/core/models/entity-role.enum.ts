export enum EntityRole {
  Default = '',
  Celebra = 'CELEBRA',
  Coordina = 'COORDINA',
  Organiza = 'ORGANIZA',
  Juega = 'JUEGA',
  Promueve = 'PROMUEVE',
  Patrocina = 'PATROCINA',
  Proyecta = 'PROYECTA'
}

const ENTITY_ROLES: EntityRole[] = [
  EntityRole.Default,
  EntityRole.Celebra,
  EntityRole.Coordina,
  EntityRole.Juega,
  EntityRole.Organiza,
  EntityRole.Patrocina,
  EntityRole.Proyecta,
  EntityRole.Promueve,
];

export { ENTITY_ROLES };
