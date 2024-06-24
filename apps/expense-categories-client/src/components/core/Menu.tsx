import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { menuHelpers, MinimalMenu } from '@dtdot/lego';

import { faChartLine, faEye } from '@fortawesome/free-solid-svg-icons';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <MinimalMenu>
      <MinimalMenu.Item
        label='Categorise'
        icon={faEye}
        active={menuHelpers.isActiveItem([/\/categorise/g], location.pathname)}
        onClick={() => navigate('/categorise')}
        data-testid='menu-item-categorise'
      />
      <MinimalMenu.Item
        label='Analyse'
        icon={faChartLine}
        active={menuHelpers.isActiveItem([/\/analyse/g], location.pathname)}
        onClick={() => navigate('/analyse')}
        data-testid='menu-item-analyse'
      />
    </MinimalMenu>
  );
};

export default Menu;
