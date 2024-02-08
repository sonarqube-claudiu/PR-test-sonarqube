export class FocusPeriod {
    constructor(focusPeriod) {
        this.id = focusPeriod.id || null;
        this.dataSourceId = focusPeriod.data_source_id || null;
        this.externalId = focusPeriod.external_id || null;
        this.startDate = focusPeriod.start_date || null;
        this.endDate = focusPeriod.end_date || null;
        this.description = focusPeriod.description || null;
    }
}