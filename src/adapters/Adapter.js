// src/adapters/AbstractAdapter.js

const FocusPeriod = require("../models/FocusPeriod");
const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");
const Issue = require("../models/Issue");
const IssueAssignment = require("../models/IssueAssignment");
const Journal = require("../models/Journal");
const JournalActivity = require("../models/JournalActivity");
const JournalDetail = require("../models/JournalDetail");
const Member = require("../models/Member");
const Project = require("../models/Project");
const Sprint = require("../models/Sprint");
const TimeEntry = require("../models/TimeEntry");
const User = require("../models/User");
const {
  SERVER_EVENT_TYPES,
  ISSUE_STATUS,
  ISSUE_TRACKERS,
  HttpStatusCodes,
  POSITION_GAP_SIZE,
  JOURNAL_TYPE,
  JORUNAL_ACTIVITY_TYPES,
  ERRORS,
} = require("../utils/utils");
const RealTimeUpdater = require("./RealTimeUpdater");
const { Op, Sequelize } = require("sequelize");

class Adapter {
  constructor() {
    if (new.target === Adapter) {
      throw new TypeError("Cannot construct Adapter instances directly");
    }
  }

  async syncProjects() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} syncProjects`);
  }

  async syncIssues() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} syncIssues`);
  }

  async syncUsers() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} syncUsers`);
  }

  async syncStatuses() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} syncStatuses`);
  }

  async syncRoles() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} syncRoles`);
  }

  async syncIssueTypes() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} syncIssueTypes`);
  }

  async syncMembers() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} syncMembers`);
  }

  async fetchProjects() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} fetchProjects`);
  }

  async fetchIssues() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} fetchIssues`);
  }

  async fetchUsers() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} fetchUsers`);
  }

  async fetchStatuses() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} fetchStatuses`);
  }

  async fetchRoles() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} fetchRoles`);
  }

  async fetchMembers() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} fetchMembers`);
  }

  async fetchSprints() {
    throw new Error(`${ERRORS.METHOD_NOT_IMPLEMENTED} fetchSprints`);
  }

  async createProject(parsedProject, parsedMembers) {
    try {
      const newProject = await Project.create(parsedProject);
      if (newProject) {
        // Create the project members

        const journal = await Journal.create({
          journalized_id: newProject.id,
          journalized_type: JOURNAL_TYPE.PROJECT,
        });

        if (parsedMembers && parsedMembers.length > 0) {
          const memberData = parsedMembers.map((member) => ({
            user_id: member.user_id,
            project_id: newProject.id,
          }));

          await Member.bulkCreate(memberData);
        }

        await JournalActivity.create({
          journal_id: journal.id,
          type: JORUNAL_ACTIVITY_TYPES.CREATE_PROJECT,
        });

        RealTimeUpdater.updateAllClients(SERVER_EVENT_TYPES.UPDATE_PROJECTS);
        return {
          status: HttpStatusCodes.CREATED,
          message: "Project created successfully",
        };
      }
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: "Project could not be created",
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async updateProject(parsedProject, parsedMembers) {
    try {
      const currentProject = await Project.findByPk(parsedProject.id, {
        include: {
          model: Member,
          as: "members",
        },
      });
      if (currentProject) {
        // Update the project
        currentProject.set(parsedProject);

        // Validate the new data
        await currentProject.validate();

        if (parsedMembers || parsedMembers.length >= 0) {
          const currentMemberIds = new Set(
            currentProject.members?.map((member) => +member.user_id) || []
          );
          const newMemberIds = new Set(
            parsedMembers?.map((member) => +member.user_id) || []
          );

          // Find removed and new members
          const removedMembers =
            currentProject.members?.filter(
              (member) => !newMemberIds.has(+member.user_id)
            ) || [];
          const addedMembers =
            parsedMembers?.filter(
              (member) => !currentMemberIds.has(+member.user_id)
            ) || [];

          if (removedMembers.length > 0) {
            // Process removed and added members
            const memberData = removedMembers.map((member) => ({
              user_id: member.user_id,
              project_id: currentProject.id,
            }));

            await Member.destroy({
              where: {
                [Op.and]: [
                  {
                    user_id: {
                      [Op.in]: memberData.map((member) => member.user_id),
                    },
                  },
                  { project_id: currentProject.id },
                ],
              },
            });
          }

          if (addedMembers.length > 0) {
            const memberData = addedMembers.map((member) => ({
              user_id: member.user_id,
              project_id: currentProject.id,
            }));

            await Member.bulkCreate(memberData);
          }
        }

        // Create a journal for the project
        await this.createJournalForProject(
          currentProject,
          parsedProject?.notes,
          parsedMembers
        );

        // Save the project
        await currentProject.save();

        RealTimeUpdater.updateAllClients(SERVER_EVENT_TYPES.UPDATE_PROJECTS);
      }
      return {
        status: HttpStatusCodes.OK,
        message: "Project updated successfully",
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async deleteProject(projectId) {
    try {
      if (projectId) {
        const project = await Project.findByPk(projectId);
        if (project) {
          await Member.destroy({
            where: { project_id: project.id },
          });

          await project.destroy();
          RealTimeUpdater.updateAllClients(SERVER_EVENT_TYPES.UPDATE_PROJECTS);
        }
      }
      return {
        status: HttpStatusCodes.OK,
        message: "Project deleted successfully",
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async createJournalDetailsForProject(project, journal, newMembers) {
    try {
      let journalDetails = [];
      let activityType;
      if (project && journal) {
        // Check for project name change
        if (project.changed("name")) {
          journalDetails.push({
            journal_id: journal.id,
            prop_key: "name",
            property: "attr",
            old_value: project.previous("name"),
            value: project.name,
          });
          activityType = JORUNAL_ACTIVITY_TYPES.PROJECT_NAME_UPDATE;
        }
        // Check for project description change
        if (project.changed("description")) {
          journalDetails.push({
            journal_id: journal.id,
            prop_key: "description",
            property: "attr",
            old_value: project.previous("description"),
            value: project.description,
          });
          activityType = JORUNAL_ACTIVITY_TYPES.PROJECT_DESCRIPTION_UPDATE;
        }

        if (newMembers && project.members && project.members.length > 0) {
          // Create sets for member IDs
          const currentMemberIds =
            new Set(project.members?.map((member) => +member.user_id)) || [];
          const newMemberIds =
            new Set(newMembers?.map((member) => +member.user_id)) || [];

          // Find removed and new members
          const removedMembers =
            project.members?.filter(
              (member) => !newMemberIds.has(+member.user_id)
            ) || [];
          const addedMembers =
            newMembers?.filter(
              (member) => !currentMemberIds.has(+member.user_id)
            ) || [];

          if (addedMembers.length > 0) {
            const journalDetail = await this.prepareJournalDetailMemberChanges(
              journal,
              addedMembers,
              "create"
            );
            journalDetails.push(...journalDetail);
            activityType = JORUNAL_ACTIVITY_TYPES.PROJECT_MEMBER_UPDATE;
          }

          if (removedMembers.length > 0) {
            // Process removed and added members
            const journalData = await this.prepareJournalDetailMemberChanges(
              journal,
              removedMembers,
              "delete"
            );
            journalDetails.push(...journalData);
            activityType = JORUNAL_ACTIVITY_TYPES.PROJECT_MEMBER_UPDATE;
          }

          if (journalDetails.length > 0) {
            await JournalDetail.bulkCreate(journalDetails);
          }
        }
      }
      switch (journalDetails.length) {
        case 0:
          activityType = JORUNAL_ACTIVITY_TYPES.CREATE_PROJECT;
          break;
        case 1:
          break;
        default:
          activityType = JORUNAL_ACTIVITY_TYPES.UPDATE_PROJECT;
          break;
      }
      await JournalActivity.create({
        journal_id: journal.id,
        type: activityType,
      });

      return null;
    } catch (error) {
      throw error;
    }
  }

  async prepareJournalDetailMemberChanges(journal, members, changeType) {
    // Fetch user details in a single query
    try {
      const userIds = members.map((member) => member.user_id);
      const users = await User.findAll({
        where: { id: userIds },
      });

      // Create journal detail for each member
      const journalData = users.map((user) => ({
        journal_id: journal.id,
        prop_key: "member",
        property: changeType,
        value: user.display_name,
      }));

      return journalData;
    } catch (error) {
      throw error;
    }
  }

  async createJournalForProject(project, notes, newMembers) {
    try {
      if (project) {
        const journal = await Journal.create({
          journalized_id: project.id,
          journalized_type: JOURNAL_TYPE.PROJECT,
          notes,
        });
        await this.createJournalDetailsForProject(project, journal, newMembers);
        return journal;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async getProjectJournals(projectId) {
    try {
      const journals = await Journal.findAll({
        where: {
          journalized_id: projectId,
          journalized_type: JOURNAL_TYPE.PROJECT,
        },
        include: [
          {
            model: JournalDetail,
            as: "details",
          },
          {
            model: JournalActivity,
            as: "activity",
          },
        ],
        order: [["created_on", "ASC"]],
      });
      if (journals && journals.length > 0) {
        return {
          status: HttpStatusCodes.OK,
          message: "Journals fetched successfully",
          journals,
        };
      }
      return {
        status: HttpStatusCodes.NOT_FOUND,
        message: "No journals found",
        journals: [],
      };
    } catch (error) {
      console.error(error);
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
        journals: [],
      };
    }
  }

  async createMember(member) {
    try {
      const newMember = await Member.create(member);
      if (newMember) {
        return newMember;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async updateMember(member) {
    try {
      const currentMember = await Member.findOne({
        where: {
          user_id: member.user_id,
          project_id: member.project_id,
        },
      });
      if (currentMember) {
        currentMember.set(member);
        await currentMember.save();
        return currentMember;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async deleteMember(member) {
    try {
      const currentMember = await Member.findOne({
        where: {
          user_id: member.user_id,
          project_id: member.project_id,
        },
      });
      if (currentMember) {
        await currentMember.destroy();
        return currentMember;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async createIssue(parsedIssue, parsedAssignments) {
    try {
      const position = (await Issue.max("position")) + POSITION_GAP_SIZE;
      const newIssue = await Issue.create({
        ...parsedIssue,
        position,
      });

      if (newIssue) {
        // create issue assignment
        if (parsedAssignments && parsedAssignments.length > 0) {
          for (let assignment of parsedAssignments) {
            await this.createIssueAssignment(newIssue.id, assignment?.user_id);
          }
        }

        newIssue.assignments = await IssueAssignment.findAll({
          where: { issue_id: newIssue.id },
        });

        // Create time entry
        if (parsedIssue?.time_entry) {
          const { user_id, time, comments, activity_id, author_id } =
            parsedIssue?.time_entry;
          if (time && time > 0) {
            await this.createTimeEntry({
              user_id,
              time,
              comments,
              activity_id,
              author_id,
              project_id: parsedIssue.project_id,
              issue_id: newIssue.id,
              spent_on: new Date(),
            });
          }
        }
        const journal = await Journal.create({
          journalized_id: newIssue.id,
          journalized_type: JOURNAL_TYPE.ISSUE,
        });

        await JournalActivity.create({
          journal_id: journal.id,
          type: JORUNAL_ACTIVITY_TYPES.CREATE_ISSUE,
        });

        RealTimeUpdater.updateClients(
          parsedIssue.project_id,
          SERVER_EVENT_TYPES.UPDATE_ISSUES
        );
      }
      return {
        status: HttpStatusCodes.OK,
        message: "Issue created successfully",
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async updateIssue(parsedIssue, parsedAssignments) {
    try {
      const currentIssue = await Issue.findByPk(parsedIssue.id, {
        include: {
          model: IssueAssignment,
          as: "assignments",
        },
      });

      delete parsedIssue.createdAt;
      delete parsedIssue.updatedAt;
      delete parsedIssue.created_on;
      delete parsedIssue.updated_on;

      if (currentIssue) {
        // Update the issue
        currentIssue.set(parsedIssue);

        // Validate the new data
        await currentIssue.validate();

        // Create a journal for the issue
        await this.createJournalForIssue(
          currentIssue,
          parsedIssue?.notes,
          parsedAssignments
        );

        if (parsedAssignments) {
          const currentAssignments = new Set(
            currentIssue.assignments?.map(
              (assignment) => +assignment.user_id
            ) || []
          );

          const newAssignments = new Set(
            parsedAssignments?.map((assignment) => +assignment.user_id) || []
          );

          // Find removed and new members
          const removedAssignments =
            currentIssue.assignments?.filter(
              (assignment) => !newAssignments.has(+assignment.user_id)
            ) || [];
          const addedAssignments =
            parsedAssignments?.filter(
              (assignment) => !currentAssignments.has(+assignment.user_id)
            ) || [];

          if (removedAssignments.length > 0) {
            // Process removed and added members
            for (let assignment of removedAssignments) {
              await this.deleteIssueAssignment(
                currentIssue.id,
                assignment.user_id
              );
            }
          }

          if (addedAssignments.length > 0) {
            for (let assignment of addedAssignments) {
              await this.createIssueAssignment(
                currentIssue.id,
                assignment.user_id
              );
            }
          }
        }

        // Save the issue
        await currentIssue.save();

        // Create a time entry for the issue
        if (parsedIssue?.time_entry) {
          await this.createTimeEntry({
            ...parsedIssue?.time_entry,
            project_id: parsedIssue.project_id,
            issue_id: currentIssue.id,
          });
        }

        RealTimeUpdater.updateClients(
          parsedIssue.project_id,
          SERVER_EVENT_TYPES.UPDATE_ISSUES
        );
      }
      return {
        status: HttpStatusCodes.OK,
        message: "Issue created successfully",
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async deleteIssue(issueId) {
    try {
      if (issueId) {
        const issue = await Issue.findByPk(issueId, {
          include: {
            model: IssueAssignment,
            as: "assignments",
          },
        });
        if (issue) {
          if (issue.assignments && issue.assignments.length > 0) {
            for (let assignment of issue.assignments) {
              await assignment.destroy();
            }
          }
          await issue.destroy();
          RealTimeUpdater.updateClients(
            issue.project_id,
            SERVER_EVENT_TYPES.UPDATE_ISSUES
          );
        }
      }
      return {
        status: HttpStatusCodes.OK,
        message: "Issue deleted successfully",
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async createIssueAssignment(issueId, userId) {
    try {
      if (issueId && userId) {
        const assignment = await IssueAssignment.create({
          issue_id: issueId,
          user_id: userId,
        });
        return assignment;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async updateIssueAssignment(issueId, userId) {
    try {
      if (issueId && userId) {
        const assignment = await IssueAssignment.update(
          { user_id: userId },
          { where: { issue_id: issueId } }
        );
        return assignment;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async deleteIssueAssignment(issueId, userId) {
    try {
      if (issueId && userId) {
        const assignment = await IssueAssignment.destroy({
          where: { issue_id: issueId, user_id: userId },
        });
        return assignment;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async createJournalForIssue(issue, notes, newAssignments) {
    try {
      if (issue) {
        const journal = await Journal.create({
          journalized_id: issue.id,
          journalized_type: JOURNAL_TYPE.ISSUE,
          user_id: issue?.assignments[0]?.user_id,
          notes,
        });
        await this.createJournalDetailsForIssue(issue, journal, newAssignments);
        return journal;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async createJournalDetailsForIssue(issue, journal, newAssignments) {
    try {
      let numberOfChanges = 0;
      let activityType;
      if (issue && journal) {
        if (issue.changed("status_id")) {
          await this.createJournalDetail(journal, {
            prop_key: "status_id",
            property: "attr",
            old_value: issue.previous("status_id"),
            value: issue.status_id,
          });
          numberOfChanges++;
          activityType = JORUNAL_ACTIVITY_TYPES.ISSUE_STATUS_UPDATE;
        }
        if (issue.changed("subject")) {
          await this.createJournalDetail(journal, {
            prop_key: "subject",
            property: "attr",
            old_value: issue.previous("subject"),
            value: issue.subject,
          });
          numberOfChanges++;
          activityType = JORUNAL_ACTIVITY_TYPES.ISSUE_SUBJECT_UPDATE;
        }
        if (issue.changed("issue_type_id")) {
          await this.createJournalDetail(journal, {
            prop_key: "issue_type_id",
            property: "attr",
            old_value: issue.previous("issue_type_id"),
            value: issue.issue_type_id,
          });
          numberOfChanges++;
          activityType = JORUNAL_ACTIVITY_TYPES.ISSUE_TRACKER_UPDATE;
        }
        if (issue.changed("description")) {
          await this.createJournalDetail(journal, {
            prop_key: "description",
            property: "attr",
            old_value: issue.previous("description"),
            value: issue.description,
          });
          numberOfChanges++;
          activityType = JORUNAL_ACTIVITY_TYPES.ISSUE_DESCRIPTION_UPDATE;
        }
        if (issue.changed("estimated_time")) {
          await this.createJournalDetail(journal, {
            prop_key: "estimated_time",
            property: "attr",
            old_value: issue.previous("estimated_time"),
            value: issue.estimated_time,
          });
          numberOfChanges++;
          activityType = JORUNAL_ACTIVITY_TYPES.ISSUE_ESTIMATED_HOURS_UPDATE;
        }
        if (issue.changed("done_ratio")) {
          await this.createJournalDetail(journal, {
            prop_key: "done_ratio",
            property: "attr",
            old_value: issue.previous("done_ratio"),
            value: issue.done_ratio,
          });
          numberOfChanges++;
          activityType = JORUNAL_ACTIVITY_TYPES.ISSUE_DONE_RATIO_UPDATE;
        }

        if (
          newAssignments &&
          issue.assignments &&
          issue.assignments.length > 0
        ) {
          // Create sets for member IDs
          const currentAssignmentsIds =
            new Set(
              issue.assignments?.map((assignment) => +assignment.user_id)
            ) || [];
          const newAssignmentsIds =
            new Set(newAssignments?.map((assignment) => +assignment.user_id)) ||
            [];

          // Find removed and new members
          const removedAssignments =
            issue.assignments?.filter(
              (assignment) => !newAssignmentsIds.has(+assignment.user_id)
            ) || [];
          const addedAssignments =
            newAssignments?.filter(
              (assignment) => !currentAssignmentsIds.has(+assignment.user_id)
            ) || [];

          if (addedAssignments.length > 0) {
            await this.processJournalDetailAssignmentChanges(
              journal,
              addedAssignments,
              "create"
            );
            activityType = JORUNAL_ACTIVITY_TYPES.ISSUE_ASSIGNMENT_UPDATE;
          }

          if (removedAssignments.length > 0) {
            // Process removed and added members
            await this.processJournalDetailAssignmentChanges(
              journal,
              removedAssignments,
              "delete"
            );
            activityType = JORUNAL_ACTIVITY_TYPES.ISSUE_ASSIGNMENT_UPDATE;
          }

          if (addedAssignments.length > 0 || removedAssignments.length > 0) {
            numberOfChanges++;
          }
        }
      }
      switch (numberOfChanges) {
        case 0:
          activityType = JORUNAL_ACTIVITY_TYPES.CREATE_ISSUE;
          break;
        case 1:
          break;
        default:
          activityType = JORUNAL_ACTIVITY_TYPES.UPDATE_ISSUE;
          break;
      }
      await JournalActivity.create({
        journal_id: journal.id,
        type: activityType,
      });

      return null;
    } catch (error) {
      throw error;
    }
  }

  async processJournalDetailAssignmentChanges(
    journal,
    assignments,
    changeType
  ) {
    // Fetch user details in a single query
    try {
      const userIds = assignments.map((assignment) => assignment.user_id);
      const users = await User.findAll({
        where: { id: userIds },
      });

      // Create journal detail for each member
      for (const user of users) {
        await this.createJournalDetail(journal, {
          prop_key: "assignment",
          property: changeType,
          value: user.display_name,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async createJournalDetail(journal, journalDetail) {
    try {
      if (journal && journalDetail) {
        const detail = await JournalDetail.create({
          journal_id: journal.id,
          prop_key: journalDetail.prop_key,
          property: journalDetail.property,
          old_value: journalDetail.old_value,
          value: journalDetail.value,
        });
        return detail;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async getIssueJournals(issueId) {
    try {
      const journals = await Journal.findAll({
        where: {
          journalized_id: issueId,
          journalized_type: JOURNAL_TYPE.ISSUE,
        },
        include: [
          {
            model: JournalDetail,
            as: "details",
          },
          {
            model: JournalActivity,
            as: "activity",
          },
        ],
        order: [["created_on", "ASC"]],
      });
      if (journals && journals.length > 0) {
        return {
          status: HttpStatusCodes.OK,
          message: "Journals fetched successfully",
          journals,
        };
      }
      return {
        status: HttpStatusCodes.NOT_FOUND,
        message: "No journals found",
        journals: [],
      };
    } catch (error) {
      console.error(error);
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
        journals: [],
      };
    }
  }

  async getActiveIssue(userId, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
      try {
        const sprintIds = await this.getSprintIdsFromFocusPeriod(
          startDate,
          endDate
        );

        const stories = await Issue.findAll({
          where: {
            sprint_id: {
              [Op.in]: sprintIds,
            },
            issue_type_id: ISSUE_TRACKERS.USER_STORY,
          },
        });

        const storyIds = stories.map((story) => story.id);

        const activeIssue = await Issue.findOne({
          where: {
            status_id: ISSUE_STATUS.IN_PROGRESS,
            parent_id: storyIds,
          },
          include: {
            model: IssueAssignment,
            as: "assignments",
            where: {
              user_id: userId,
            },
            include: {
              model: User,
              as: "user",
            },
          },
        });

        resolve({
          status: HttpStatusCodes.OK,
          message: "Active issue retrieved successfully",
          issue: activeIssue,
        });
      } catch (error) {
        console.error(error);
        resolve({
          status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "Error getting active issue",
          issue: null,
        });
      }
    });
  }

  async createTimeEntry(timeEntry) {
    try {
      const {
        user_id,
        time,
        comments,
        activity_id,
        author_id,
        project_id,
        issue_id,
        spent_on,
      } = timeEntry;
      if (time && time > 0) {
        const timeEntry = await TimeEntry.create({
          project_id,
          user_id,
          issue_id,
          time,
          activity_id,
          author_id,
          comments,
          spent_on: spent_on || new Date(),
        });
        return timeEntry;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async createSprint(sprint) {
    try {
      const newSprint = await Sprint.create(sprint);
      if (newSprint) {
        RealTimeUpdater.updateClients(
          sprint.project_id,
          SERVER_EVENT_TYPES.UPDATE_PROJECTS
        );
        return {
          status: HttpStatusCodes.CREATED,
          message: "Sprint created successfully",
        };
      }
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: "Sprint could not be created",
      };
    } catch (error) {
      console.error(error);
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async updateSprint(sprint) {
    try {
      if (!sprint) {
        return {
          status: HttpStatusCodes.NOT_FOUND,
          message: "Sprint not found",
        };
      }

      const currentSprint = await Sprint.findByPk(sprint.id);
      if (currentSprint) {
        currentSprint.set(sprint);
        await currentSprint.save();
        RealTimeUpdater.updateClients(
          sprint.project_id,
          SERVER_EVENT_TYPES.UPDATE_PROJECTS
        );
        return {
          status: HttpStatusCodes.OK,
          message: "Sprint updated successfully",
        };
      }
      return {
        status: HttpStatusCodes.NOT_FOUND,
        message: "Sprint not found",
      };
    } catch (error) {
      console.error(error);
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async deleteSprint(sprintId) {
    try {
      if (!sprintId) {
        return {
          status: HttpStatusCodes.NOT_FOUND,
          message: "Sprint not found",
        };
      }

      const sprint = await Sprint.findByPk(sprintId);
      if (!sprint) {
        return {
          status: HttpStatusCodes.NOT_FOUND,
          message: "Sprint not found",
        };
      }
      await sprint.destroy();
      RealTimeUpdater.updateClients(
        sprint.project_id,
        SERVER_EVENT_TYPES.UPDATE_PROJECTS
      );
      return {
        status: HttpStatusCodes.OK,
        message: "Sprint deleted successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async getSprintIdsFromFocusPeriod(startDate, endDate) {
    try {
      const startOfDay = (date) => new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = (date) => new Date(date.setHours(23, 59, 59, 999));

      const start_date = startOfDay(new Date(startDate));
      const end_date = endOfDay(new Date(endDate));

      if (!start_date || !end_date) {
        return {
          status: HttpStatusCodes.NOT_FOUND,
          message: "Start date and end date must be valid.",
        };
      }
      const sprints = await Sprint.findAll({
        where: {
          start_date: {
            [Op.gte]: start_date, // Greater than or equal to startDate
          },
          end_date: {
            [Op.lte]: end_date, // Less than or equal to endDate
          },
        },
      });

      const sprintIds = sprints.map((sprint) => sprint.id);

      return sprintIds;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getSprints(projectId) {
    try {
      if (!projectId) {
        return {
          status: HttpStatusCodes.NOT_FOUND,
          message: "Project not found",
        };
      }

      const sprints = await Sprint.findAll({
        where: { project_id: projectId },
        order: [["end_date", "DESC"]],
      });

      return {
        status: HttpStatusCodes.OK,
        message: "Sprints fetched successfully",
        sprints: sprints || [],
      };
    } catch (error) {
      console.error(error);
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async normalizePositions() {
    const issues = await Issue.findAll({ order: [["position", "ASC"]] });
    let currentPosition = GAP_SIZE; // Start with the first position

    for (const issue of issues) {
      if (issue.position === currentPosition) {
        currentPosition += GAP_SIZE;
        continue;
      } else {
        issue.position = currentPosition;
      }
      await issue.save();
      currentPosition += GAP_SIZE;
    }
    return;
  }

  async updateIssuePosition(issueId, position) {
    try {
      const issue = await Issue.findByPk(issueId);

      if (!issue) {
        return {
          status: HttpStatusCodes.NOT_FOUND,
          message: "Issue not found",
        };
      }

      // Update the issue position
      issue.position = position;
      await issue.save();

      // Check if there's another issue too close to the desired position
      const closeIssue = await Issue.findOne({
        where: {
          position: {
            [Op.between]: [position - 0.0000001, position + 0.0000001],
          },
          id: {
            [Op.ne]: issueId, // Exclude the current issue
          },
        },
      });

      if (closeIssue) {
        // If there's an issue too close, normalize the positions
        await normalizePositions();
      }

      return {
        status: HttpStatusCodes.OK,
        message: "Issue position updated successfully",
      };
    } catch (error) {
      console.error("Error updating issue position:", error);
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async updateStoryPosition(storyId, position) {
    await this.updateIssuePosition(storyId, position);
  }

  async createIssueOnSource(issue) {
    throw new Error("You have to implement the method createIssueOnSource!");
  }

  async updateIssueOnSource(issue) {
    throw new Error("You have to implement the method createIssueOnSource!");
  }

  async updateSourceIssueStatus(issueId, statusId) {
    throw new Error(
      "You have to implement the method updateSourceIssueStatus!"
    );
  }

  async createFocusPeriod(focusPeriod) {
    try {
      const parsedFocusPeriod = JSON.parse(focusPeriod);
      const newFocusPeriod = await FocusPeriod.create(parsedFocusPeriod);
      if (newFocusPeriod) {
        RealTimeUpdater.updateAllClients(
          SERVER_EVENT_TYPES.UPDATE_FOCUS_PERIOD
        );
        return {
          status: HttpStatusCodes.OK,
          message: "Focus period created successfully",
        };
      }
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: "Focus period could not be created",
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async updateFocusPeriod(focusPeriod) {
    return new Promise(async (resolve, reject) => {
      const parsedFocusPeriod = JSON.parse(focusPeriod);
      try {
        const { id, title, end_date, start_date, description } =
          parsedFocusPeriod;
        const focusPeriodExists = await FocusPeriod.findOne({
          where: { id: id },
        });

        let response = null;
        if (focusPeriodExists) {
          await FocusPeriod.update(
            {
              title,
              start_date,
              end_date,
              description,
            },
            { where: { id } }
          );
        } else {
          response = await FocusPeriod.create({
            id,
            title,
            data_source_id: SOURCES.redmine,
            external_id: id,
            start_date: start_date,
            end_date: end_date,
            description: description,
          });
        }
        RealTimeUpdater.updateAllClients(
          SERVER_EVENT_TYPES.UPDATE_FOCUS_PERIOD
        );
        resolve({
          status: HttpStatusCodes.OK,
          message: "Focus period updated succesfuly",
        });
      } catch (error) {
        resolve({
          status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "Error updating focus period",
        });
        console.log(error);
      }
    });
  }

  async deleteFocusPeriod(parsedId) {
    try {
      if (parsedId) {
        const focusPeriod = await FocusPeriod.findByPk(parsedId);
        if (focusPeriod) {
          const groups = await Group.findAll({
            where: { focusperiod_id: focusPeriod.id },
          });

          for (let group of groups) {
            await group.update({ focusperiod_id: null });
          }
          await focusPeriod.destroy();

          RealTimeUpdater.updateAllClients(SERVER_EVENT_TYPES.UPDATE_GROUPS);
        }
      }
      return {
        status: HttpStatusCodes.OK,
        message: "Focus period deleted successfully",
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async createGroup(group, selectedUsers) {
    try {
      const parsedGroup = JSON.parse(group);
      const newGroup = await Group.create(parsedGroup);
      if (newGroup) {
        const parsedSelectedUsers = JSON.parse(selectedUsers);
        parsedSelectedUsers.forEach(async (member) => {
          await GroupMember.create({
            group_id: newGroup.id,
            user_id: member.user.id,
          });
        });

        RealTimeUpdater.updateAllClients(SERVER_EVENT_TYPES.UPDATE_GROUPS);
        return {
          status: HttpStatusCodes.OK,
          message: "Group created successfully",
        };
      }
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: "Group could not be created",
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async deleteGroup(parsedGroupId) {
    try {
      if (parsedGroupId) {
        const group = await Group.findByPk(parsedGroupId);
        if (group) {
          await GroupMember.destroy({
            where: { group_id: group.id },
          });

          await group.destroy();
          RealTimeUpdater.updateAllClients(SERVER_EVENT_TYPES.UPDATE_GROUPS);
        }
      }
      return {
        status: HttpStatusCodes.OK,
        message: "Group deleted successfully",
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async getGroups(userId) {
    try {
      if (!userId) {
        throw new Error("User ID not provided.");
      }
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error("User not found.");
      }

      if (user.admin !== 1) {
        const groups = await Group.findAll({
          include: [
            {
              model: GroupMember,
              as: "group_members",
              include: {
                model: User,
                as: "user",
              },
            },
          ],
        });
        return {
          status: HttpStatusCodes.OK,
          message: "Groups fetched successfully",
          groups: groups,
        };
      } else {
        const groups = await Group.findAll({
          include: [
            {
              model: GroupMember,
              as: "group_members",
              where: { user_id: userId },
              include: {
                model: User,
                as: "user",
              },
            },
          ],
        });
        return {
          status: HttpStatusCodes.OK,
          message: "Groups fetched successfully",
          groups: groups,
        };
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
        groups: null,
      };
    }
  }

  async updateGroup(parsedGroup, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) {
          throw new Error("User ID not provided.");
        }
        const user = await User.findByPk(userId);

        if (!user) {
          throw new Error("User not found.");
        }

        if (user.admin !== 0) {
          const { id, name, description, group_members } = parsedGroup;
          const groupExists = await Group.findOne({
            where: { id: id },
          });

          if (groupExists) {
            await Group.update(
              {
                name,
                description,
              },
              { where: { id } }
            );

            await GroupMember.destroy({
              where: { group_id: parsedGroup.id },
            });
            if (group_members.length > 0) {
              await group_members.forEach(async (member) => {
                await GroupMember.create({
                  group_id: parsedGroup.id,
                  user_id: member.user.id,
                });
              });
            }
          }
          RealTimeUpdater.updateAllClients(SERVER_EVENT_TYPES.UPDATE_GROUPS);
          resolve({
            status: HttpStatusCodes.OK,
            message: "Group updated succesfuly",
          });
        } else {
          throw new Error("User is not an admin.");
        }
      } catch (error) {
        resolve({
          status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: "Error updating group",
        });
        console.log(error);
      }
    });
  }

  async getAllUsers(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) {
          throw new Error("User ID not provided.");
        }
        const user = await User.findByPk(userId);

        if (!user) {
          throw new Error("User not found.");
        }

        if (user.admin !== 0) {
          const users = await User.findAll();
          return resolve(users);
        }

        throw new Error("User is not an admin.");
      } catch (error) {
        console.error("Error fetching users:", error);
        return resolve([]);
      }
    });
  }

  async getProject(startDate, endDate, userId, projectId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) {
          throw new Error("User ID not provided.");
        }
        const user = await User.findByPk(userId);

        if (!user) {
          throw new Error("User not found.");
        }

        const sprintIds = await this.getSprintIdsFromFocusPeriod(
          startDate,
          endDate
        );

        const project = await this.getProjectData(
          projectId,
          sprintIds,
          userId,
          user.admin
        );
        if (!project) {
          return null;
        }

        // Fetch time entries in bulk for all issues in the project
        const issueIds = project.stories.flatMap((story) =>
          story.issues.map((issue) => issue.id)
        );
        const timeEntries = await this.getTimeEntries(issueIds);

        // Process stories and issues
        const transformedStories = await this.getTransformedStories(
          project.stories,
          timeEntries
        );

        const projectEntry = {
          ...project.get(),
          stories: transformedStories,
          metadata: await this.getProjectMetadata(project),
        };

        // return projectEntry;

        return resolve(projectEntry);
      } catch (error) {
        console.error("Error fetching projects:", error);
        return resolve(null);
      }
    });
  }
  async getProjectData(projectId, sprintIds, userId, isAdmin) {
    const includeOptions = [
      {
        model: Member,
        as: "members",
        include: {
          model: User,
          as: "user",
        },
      },
      {
        model: Issue,
        as: "stories",
        separate: true,
        where: {
          issue_type_id: ISSUE_TRACKERS.USER_STORY,
          sprint_id: { [Op.in]: sprintIds },
        },
        order: [["position", "ASC"]],
        include: [
          {
            model: Issue,
            as: "issues",
            separate: true,
            order: [["position", "ASC"]],
            include: [
              {
                model: IssueAssignment,
                as: "assignments",
                include: {
                  model: User,
                  as: "user",
                },
              },
            ],
          },
          {
            model: IssueAssignment,
            as: "assignments",
            include: {
              model: User,
              as: "user",
            },
          },
        ],
      },
      {
        model: Sprint,
        as: "sprints",
        separate: true,
        where: {
          id: { [Op.in]: sprintIds },
        },
        order: [["end_date", "DESC"]],
      },
    ];

    // Modify 'issues' include based on isAdmin flag
    if (!isAdmin) {
      includeOptions[1].include[0].include[0].where = { user_id: userId };
    }

    return await Project.findOne({
      where: { id: projectId },
      include: includeOptions,
    });
  }

  async getTimeEntries(issueIds) {
    const timeEntries = await TimeEntry.findAll({
      where: { issue_id: issueIds },
      attributes: [
        "issue_id",
        [Sequelize.fn("SUM", Sequelize.col("time")), "total_time"],
      ],
      group: ["issue_id"],
      raw: true,
    });

    // Convert to a map for efficient lookup
    const timeEntryMap = new Map(
      timeEntries.map((entry) => [entry.issue_id, entry.total_time])
    );
    return timeEntryMap;
  }

  async getTransformedStories(stories, timeEntryMap) {
    return Promise.all(
      stories.map(async (story) => {
        const transformedIssues = story.issues.map((issue) => {
          // Use the pre-fetched time entries
          const spentTimeSum = timeEntryMap.get(issue.id) || 0;

          return {
            issueId: issue.id,
            issue: {
              ...issue.get(),
              spent_time: spentTimeSum,
            },
          };
        });

        return {
          storyId: story.id,
          story: {
            ...story.get(),
            issues: transformedIssues,
          },
        };
      })
    );
  }

  async getProjects(startDate, endDate, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) {
          return {
            status: HttpStatusCodes.NOT_FOUND,
            message: "User Id must be provided.",
          };
        }
        const user = await User.findByPk(userId);

        if (!user) {
          return {
            status: HttpStatusCodes.NOT_FOUND,
            message: "User not found.",
          };
        }

        const start_date = new Date(startDate);
        const end_date = new Date(endDate);

        if (!start_date || !end_date) {
          return {
            status: HttpStatusCodes.NOT_FOUND,
            message: "Start date and end date must be valid.",
          };
        }

        const sprintIds = await this.getSprintIdsFromFocusPeriod(
          startDate,
          endDate
        );

        if (user && user.admin) {
          // If the user is an admin, return all projects

          const projects = await Project.findAll({
            include: [
              {
                model: Member,
                as: "members",
                include: {
                  model: User,
                  as: "user",
                },
              },
              {
                model: Issue,
                as: "stories",
                separate: true,
                where: {
                  issue_type_id: ISSUE_TRACKERS.USER_STORY,
                  sprint_id: { [Op.in]: sprintIds },
                },
                order: [["position", "ASC"]],
                include: [
                  {
                    model: Issue,
                    as: "issues",
                    separate: true,
                    order: [["position", "ASC"]],
                    include: {
                      model: IssueAssignment,
                      as: "assignments",
                    },
                  },
                  {
                    model: IssueAssignment,
                    as: "assignments",
                  },
                ],
              },
              {
                model: Sprint,
                as: "sprints",
                separate: true,
                where: {
                  id: { [Op.in]: sprintIds },
                },
                order: [["end_date", "DESC"]],
              },
            ],
          });

          const projectEntries = await Promise.all(
            projects.map(async (project) => ({
              projectId: project.id,
              project: {
                ...project.dataValues,
                stories: null,
                metadata: await this.getProjectMetadata(project),
              },
            }))
          );

          return resolve(projectEntries);
        }

        const memberProjects = await Member.findAll({
          where: { user_id: userId },
        });
        const projectIds = memberProjects.map((member) => member.project_id);

        const projects = await Project.findAll({
          where: { id: { [Op.in]: projectIds } },
          include: [
            {
              model: Member,
              as: "members",
              include: {
                model: User,
                as: "user",
              },
            },
            {
              model: Issue,
              as: "stories",
              separate: true,
              where: {
                issue_type_id: ISSUE_TRACKERS.USER_STORY,
                sprint_id: { [Op.in]: sprintIds },
              },
              order: [["position", "ASC"]],
              include: [
                {
                  model: Issue,
                  as: "issues",
                  separate: true,
                  order: [["position", "ASC"]],
                  include: {
                    model: IssueAssignment,
                    as: "assignments",
                    where: { user_id: userId },
                  },
                },
                {
                  model: IssueAssignment,
                  as: "assignments",
                },
              ],
            },
            {
              model: Sprint,
              as: "sprints",
              separate: true,
              where: {
                id: { [Op.in]: sprintIds },
              },
              order: [["end_date", "DESC"]],
            },
          ],
        });

        const projectEntries = await Promise.all(
          projects.map(async (project) => ({
            projectId: project.id,
            project: {
              ...project.dataValues,
              stories: null,
              metadata: await this.getProjectMetadata(project),
            },
          }))
        );

        return resolve(projectEntries);
      } catch (error) {
        console.error("Error fetching projects:", error);
        return resolve([]);
      }
    });
  }

  async getProjectMetadata(project) {
    return new Promise(async (resolve, reject) => {
      try {
        let projectMetadata = { ...project.metadata };
        if (project) {
          const storiesCount = project.stories.length;
          let NEW = 0,
            IN_PROGRESS = 0,
            RESOLVED = 0,
            ON_HOLD = 0;
          project?.stories.forEach((story) => {
            story?.issues.forEach((issue) => {
              if (issue?.issue_type_id === ISSUE_TRACKERS.USER_STORY) {
                return;
              }
              switch (issue?.status_id) {
                case ISSUE_STATUS.NEW:
                  NEW++;
                  break;
                case ISSUE_STATUS.IN_PROGRESS:
                  IN_PROGRESS++;
                  break;
                case ISSUE_STATUS.RESOLVED:
                  RESOLVED++;
                  break;
                case ISSUE_STATUS.ON_HOLD:
                  ON_HOLD++;
                  break;
                default:
                  break;
              }
            });
          });
          const issuesCount = {
            NEW,
            IN_PROGRESS,
            RESOLVED,
            ON_HOLD,
          };

          projectMetadata = {
            ...projectMetadata,
            stories: storiesCount,
            issues: issuesCount,
          };
        }
        return resolve(projectMetadata);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllProjectData(projectId) {
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: Member,
          as: "members",
          include: {
            model: User,
            as: "user",
          },
        },
        {
          model: Sprint,
          as: "sprints",
          separate: true,
          include: {
            model: Issue,
            as: "stories",
            where: {
              issue_type_id: ISSUE_TRACKERS.USER_STORY,
            },
            order: [["position", "ASC"]],
            include: [
              {
                model: Issue,
                as: "issues",
                separate: true,
                order: [["position", "ASC"]],
                include: [
                  {
                    model: TimeEntry,
                    as: "time_entries",
                    separate: true,
                  },
                  {
                    model: Journal,
                    as: "journals",
                    separate: true,
                    include: [
                      {
                        model: JournalDetail,
                        as: "details",
                      },
                      {
                        model: JournalActivity,
                        as: "activity",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          order: [["end_date", "DESC"]],
        },
      ],
    });

    return project;
  }

  async getAllSprintsWithData () {
    const sprints = await Sprint.findAll({
      include: {
        model: Issue,
        as: "stories",
        where: {
          issue_type_id: ISSUE_TRACKERS.USER_STORY,
        },
        order: [["position", "ASC"]],
        include: [
          {
            model: Issue,
            as: "issues",
            separate: true,
            order: [["position", "ASC"]],
            include: [
              {
                model: TimeEntry,
                as: "time_entries",
                separate: true,
              },
              {
                model: Journal,
                as: "journals",
                separate: true,
                include: [
                  {
                    model: JournalDetail,
                    as: "details",
                  },
                  {
                    model: JournalActivity,
                    as: "activity",
                  },
                ],
              },
            ],
          },
        ],
      },
      order: [["end_date", "DESC"]],
    });
    const sprintsList = {};
    sprints.forEach((sprint) => {
      sprintsList[sprint.id] = sprint;
    });
    return sprintsList;
  }

  async getProjectsAsJson() {
    const projects = await Project.findAll({
      include: {
        model: Sprint,
        as: "sprints",
        separate: true,
      },
    });

    const necessaryData = projects.map((project) => {
      return {
        id: project.id,
        name: project.name,
        sprints: project.sprints.map((sprint) => {
          return {
            id: sprint.id,
            name: sprint.name,
            start_date: sprint.start_date,
            end_date: sprint.end_date,
          };
        }),
      };
    });

    return {projects: necessaryData};
  }
}

module.exports = Adapter;
