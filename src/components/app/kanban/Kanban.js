import React, { useContext, useEffect, useState } from 'react';
import KanbanHeader from './KanbanHeader';
import AppContext from 'context/Context';
import KanbanContainer from './KanbanContainer';

const Kanban = () => {
  const {
    config: { isFluid, isNavbarVerticalCollapsed },
    setConfig
  } = useContext(AppContext);

  const [kanbanIsFluid] = useState(isFluid);
  const [kanbanIsNavbarVerticalCollapsed] = useState(isNavbarVerticalCollapsed);

  useEffect(() => {
    setConfig('isFluid', true);
    setConfig('isNavbarVerticalCollapsed', true);

    return () => {
      setConfig('isFluid', kanbanIsFluid);
      setConfig('isNavbarVerticalCollapsed', kanbanIsNavbarVerticalCollapsed);
    };
  }, []);

  return (
    <>
      <KanbanHeader />
      <KanbanContainer />
    </>
  );
};

export default Kanban;
