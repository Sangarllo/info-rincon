export enum Status {
  Deleted = 'DELETED',
  Visible = 'VISIBLE',
  Blocked = 'BLOCKED',
  Editing = 'EDITING'
}

const STATUS_MODES: Status[] = [
  Status.Deleted,
  Status.Visible,
  Status.Blocked,
  Status.Editing,
];

export { STATUS_MODES };
