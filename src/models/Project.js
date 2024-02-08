export class Project {
  constructor(project) {
    this.id = project.id || null;
    this.dataSourceId = project.dataSourceId || null;
    this.externalId = project.externalId || null;
    this.name = project.name || null;
    this.description = project.description || null;
    this.metadata = project.metadata || null;
    this.createdOn = project.createdOn || null;
    this.updatedOn = project.updatedOn || null;
  }

}
