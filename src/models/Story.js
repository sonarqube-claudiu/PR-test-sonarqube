import { Issue } from './Issue';

export class Story {
  static belongsToProject(story, project) {
    return +story?.project_id === +project?.id;
  }

  static hasWorkingIssues(story) {
    return Object.values(story?.issues || [])?.some(
      issue => !Issue.isNew(issue)
    );
  }
}
