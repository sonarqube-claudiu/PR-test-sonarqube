import { createSlice } from '@reduxjs/toolkit';
import { Issue } from 'models/Issue';
import { KanbanColumn } from 'models/KanbanColumn';
import { Utils } from 'models/Utils';
import { ISSUE_STATUS } from 'models/enums/IssueStatuses';

const initialState = {
  columns: [
    new KanbanColumn(ISSUE_STATUS.NEW, 'NEW', []),
    new KanbanColumn(ISSUE_STATUS.IN_PROGRESS, 'IN_PROGRESS', []),
    new KanbanColumn(ISSUE_STATUS.ON_HOLD, 'ON_HOLD', []),
    new KanbanColumn(ISSUE_STATUS.RESOLVED, 'RESOLVED', [])
  ]
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setActiveStory: {
      reducer: (state, action) => {
        state.activeUserStory = action.payload;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    updateSingleColumnItems: {
      reducer: (state, action) => {
        const { column, reorderedIssues } = action.payload;
        const myColumn = state.columns.find(c => c.id === column.id);
        myColumn.issues = reorderedIssues;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    updateDualColumnItems: {
      reducer: (state, action) => {
        const {
          sourceColumn,
          updatedSourceItems,
          destColumn,
          updatedDestItems
        } = action.payload;
        const source = state.columns.find(
          column => column.id === sourceColumn.id
        );
        const destination = state.columns.find(
          column => column.id === destColumn.id
        );
        source.issues = updatedSourceItems;
        destination.issues = updatedDestItems;
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    updateKanbanItemsWithIssues: {
      reducer: (state, action) => {
        const { issues } = action.payload;

        state.columns.forEach(column => (column.issues = []));

        issues.forEach(issue => {
          const currentIssue = { ...issue };
          currentIssue.labels = [Utils.getItemLabel(issue.issue_type_id)];
          if (Issue.isNew(issue)) {
            state.columns
              .filter(column =>
                Utils.isEqual(column.id, ISSUE_STATUS.NEW)
              )[0]
              .issues.push(currentIssue);
          } else if (Issue.isInProgress(issue)) {
            state.columns
              .filter(column =>
                Utils.isEqual(column.id, ISSUE_STATUS.IN_PROGRESS)
              )[0]
              .issues.push(currentIssue);
          } else if (Issue.isOnHold(issue)) {
            state.columns
              .filter(column =>
                Utils.isEqual(column.id, ISSUE_STATUS.ON_HOLD)
              )[0]
              .issues.push(currentIssue);
          } else if (Issue.isResolved(issue)) {
            state.columns
              .filter(column =>
                Utils.isEqual(column.id, ISSUE_STATUS.RESOLVED)
              )[0]
              .issues.push(currentIssue);
          }
        });

        state.columns.forEach(column =>
          column.issues.sort((a, b) => a.position - b.position)
        );
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    },
    moveItem: {
      reducer: (state, action) => {
        const { fromColumnId, toColumnId, fromIndex, toIndex } = action.payload;
        const fromColumn = state.columns.find(
          column => column.id === fromColumnId
        );
        const toColumn = state.columns.find(column => column.id === toColumnId);
        const issue = fromColumn.issues.splice(fromIndex, 1)[0];
        toColumn.issues.splice(toIndex, 0, issue);
      },
      prepare: payload => ({ payload, meta: { logLevel: 'DEBUG' } })
    }
  }
});

export const {
  setColumns,
  updateSingleColumnItems,
  updateDualColumnItems,
  updateKanbanItemsWithIssues
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
