export class Sprint {
    constructor(sprint) {
        this.id = sprint.id || null;
        this.dataSourceId = sprint.data_source_id || null;
        this.externalId = sprint.external_id || null;
        this.name = sprint.name || null;
        this.startDate = sprint.start_date || null;
        this.endDate = sprint.end_date || null;
        this.description = sprint.description || null;
    }
}