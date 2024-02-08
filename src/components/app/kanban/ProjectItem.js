import SoftBadge from 'components/common/SoftBadge';
import { setActiveProject, setLoadingProjects } from 'features/projectsSlice';
import { getProject } from 'features/projectsThunk';
import { DISPLAY_PROJECT_TITLE_MAX_LEN } from 'models/Constants';
import { Issue } from 'models/Issue';
import { Story } from 'models/Story';
import { Utils } from 'models/Utils';
import { ISSUE_STATUS } from 'models/enums/IssueStatuses';
import { ISSUE_TRACKER } from 'models/enums/IssueTrackers';
import React, { Fragment, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export const ProjectItem = ({ project }) => {
  const dispatch = useDispatch();
  const activeProject = useSelector(state => state.projects.activeProject);
  const intl = useIntl();
  const language = useSelector(state => state.language.locale);

  const [showProject, setShowProject] = React.useState(true);
  const [sprintTimeLeft, setSprintTimeLeft] = React.useState('');

  useEffect(() => {
    if (project) {
      // setShowProject(state => {
      //   return project.metadata.stories > 0;
      // });

      const endDate =
        Object.values(project?.sprints || [])?.length > 0 &&
        Object.values(project?.sprints || [])[0]?.end_date;
      const startDate =
        Object.values(project?.sprints || [])?.length > 0 &&
        Object.values(project?.sprints || [])[0]?.start_date;
      const { weeks, days } = Utils.getTimeLeftInWeeksAndDays(
        startDate,
        endDate
      );
      const timeLeftInWeeeksAndDays = `${weeks} ${
        weeks === 1
          ? intl.formatMessage({ id: 'project.container.week' })
          : intl.formatMessage({ id: 'project.container.weeks' })
      } ${days} ${
        days === 1
          ? intl.formatMessage({ id: 'project.container.day' })
          : intl.formatMessage({ id: 'project.container.days' })
      }`;
      setSprintTimeLeft(timeLeftInWeeeksAndDays);
    }
  }, [project, language]);

  const handleItemClick = () => {
    dispatch(setActiveProject(project));
  };
  return (
    <>
      {showProject && (
        <div
          className="kanban-item-card cursor-pointer p-2 d-flex flex-column mx-1"
          style={{
            maxWidth: '400px',
            minWidth: '250px',
            minHeight: '120px',
            maxHeight: '120px',
            border: `${
              activeProject && Utils.isEqual(activeProject.id, project.id)
                ? 1
                : 0
            }px solid white`
          }}
          onClick={handleItemClick}
        >
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip
                style={{
                  position: 'fixed' //changed properties of .tooltip-inner class in theme.css
                }}
              >
                {project.name.length > 50 ? (
                  <>
                    {project.name.substring(0, project.name.length / 2)}{' '}
                    <br></br>
                    {project.name.substring(
                      project.name.length / 2 + 1,
                      project.name.length
                    )}{' '}
                  </>
                ) : (
                  <> {project.name}</>
                )}
              </Tooltip>
            }
          >
            <span className="fw-bold fs-0 mx-1 text-break">
              {project.name.length > 50
                ? `${project.name.substring(
                    0,
                    DISPLAY_PROJECT_TITLE_MAX_LEN
                  )}...`
                : project.name}
            </span>
          </OverlayTrigger>
          <div className="d-flex flex-column flex-grow-1 justify-content-end">
            <div className="text-nowrap mx-1 my-1 d-flex align-items-center">
              <FormattedMessage
                id={Utils.getStatusTranslation('User Stories')}
              />
              <SoftBadge
                bg={'warning'}
                className="d-flex align-items-center mx-1 mb-1"
              >
                {project?.metadata?.stories} ({sprintTimeLeft})
                {/* <FormattedMessage id="project.item.timeLeft" /> */}
              </SoftBadge>
            </div>
            <div className="d-flex flex-row m-0 p-0 justify-content-center">
              {Object.entries(project?.metadata?.issues || []).map(
                ([key, value]) => {
                  return (
                    <div
                      className="d-flex flex-row mx-1 p-0 text-nowrap"
                      key={key}
                    >
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="bottom"
                        overlay={
                          <Tooltip style={{ position: 'fixed' }}>
                            <FormattedMessage
                              id={Utils.getStatusTranslation(key)}
                            />
                          </Tooltip>
                        }
                      >
                        <>
                          {
                            <FormattedMessage
                              id={Utils.getStatusTranslation(key)}
                            />
                          }
                          <SoftBadge
                            bg={Utils.getBadgeColor(key)}
                            className="d-flex align-items-center justify-content-center mx-1 mb-1"
                            style={{ height: '20px', width: '20px' }}
                          >
                            {value}
                          </SoftBadge>
                        </>
                      </OverlayTrigger>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
