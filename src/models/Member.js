class MemberClass {
  constructor(id = null, userId = null, projectId = null) {
    this._id = id;
    this._userId = userId;
    this._projectId = projectId;
  }

  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value;
  }

  get userId() {
    return this._userId;
  }
  set userId(value) {
    this._userId = value;
  }

  get projectId() {
    return this._projectId;
  }
  set projectId(value) {
    this._projectId = value;
  }
}
