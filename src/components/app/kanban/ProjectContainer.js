import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { ProjectItem } from './ProjectItem';
import { ISSUE_TRACKER } from 'models/enums/IssueTrackers';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import useManageActiveProject from 'hooks/useManageActiveProject';
import { setProjectsScrollCompleted } from 'features/projectsSlice';
import { useDispatch } from 'react-redux';

export const ProjectContainer = () => {
  const projects = useSelector(state => state.projects.projects);
  const loading = useSelector(state => state.projects.loading);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const activeProject = useSelector(state => state.projects.activeProject);

  const dispatch = useDispatch();
  useManageActiveProject();

  useLayoutEffect(() => {
    if (
      projects &&
      Object.values(projects).length > 0 &&
      activeProject &&
      sliderRef.current
    ) {
      const activeElement = sliderRef.current.querySelector(
        `[data-active-id="${activeProject.id}"]`
      );
      dispatch(setProjectsScrollCompleted(false));
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
      setTimeout(() => {
        dispatch(setProjectsScrollCompleted(true));
      }, 1000);
    }
  }, [activeProject, sliderRef.current]);

  const scroll = direction => {
    let distance = 100;
    if (direction === 'left') sliderRef.current.scrollLeft -= distance;
    if (direction === 'right') sliderRef.current.scrollLeft += distance;
  };

  const handleMouseDown = e => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = x - startX; // *2 for faster scroll
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="d-flex align-items-center justify-content-between w-100">
      <div className="d-flex flex-column justify-content-between">
        <button className="btn btn-light" onClick={() => scroll('left')}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      </div>

      <div
        className="d-flex flex-row over mx-3 scrollbar p-2"
        style={{ overflowX: 'scroll' }}
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {Object.values(projects || []).length > 0 &&
          [...Object.values(projects)].map(project => {
            return (
              <div key={project.id} data-active-id={project.id}>
                <ProjectItem project={project} />
              </div>
            );
          })}

        {projects.length === 0 && <p>No projects found</p>}
      </div>

      <button className="btn btn-light" onClick={() => scroll('right')}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};
