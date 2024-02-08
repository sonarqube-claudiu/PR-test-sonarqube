require("dotenv").config();
const createIssue = require("./issues/createIssue");
const updateIssue = require("./issues/updateIssue");
const deleteIssue = require("./issues/deleteIssue");
const updateIssueStatus = require("./issues/updateIssueStatus");
const updateIssuePosition = require("./issues/updateIssuePosition");

const createProject = require("./projects/createProject");
const updateProject = require("./projects/updateProject");
const deleteProject = require("./projects/deleteProject");
const getProjects = require("./projects/getProjects");
const getProject = require("./projects/getProject");

const updateStoryPosition = require("./stories/updateStoryPosition");
const updateFocusPeriod = require("./focusperiod/updateFocusPeriod");
const deleteFocusPeriod = require("./focusperiod/deleteFocusPeriod");

const createSprint = require("./sprints/createSprint");
const updateSprint = require("./sprints/updateSprint");
const deleteSprint = require("./sprints/deleteSprint");

const login = require("./auth/login");
const getProjectJournals = require("./journal/getProjectJournals");
const getFocusPeriod = require("./focusperiod/getFocusPeriod");
const getStories = require("./stories/getStories");
const getActiveIssue = require("./issues/getActiveIssue");
const getIssueJournals = require("./journal/getIssueJournals");
const getSprints = require("./sprints/getSprints");

const createGroup = require("./group/createGroup");
const updateGroup = require("./group/updateGroup");
const getGroups = require("./group/getGroups");
const deleteGroup = require("./group/deleteGroup");

const createFocusPeriod = require("./focusperiod/createFocusPeriod");
const getAllFocusPeriods = require("./focusperiod/getAllFocusPeriods");
const getAllUsers = require("./user/getAllUsers");

const resolvers = {
  Mutation: {
    createIssue,
    createFocusPeriod,
    createGroup,
    updateIssue,
    deleteIssue,
    createProject,
    updateProject,
    deleteProject,
    createSprint,
    updateSprint,
    deleteSprint,
    updateIssueStatus,
    updateIssuePosition,
    updateStoryPosition,
    updateFocusPeriod,
    updateGroup,
    deleteGroup,
    deleteFocusPeriod, 
  },
  Query: {
    login,
    getGroups,
    getAllUsers,
    getProjects,
    getFocusPeriod,
    getAllFocusPeriods,
    getStories,
    getProject,
    getActiveIssue,
    getIssueJournals,
    getProjectJournals,
    getSprints
  },
};

module.exports = resolvers;
