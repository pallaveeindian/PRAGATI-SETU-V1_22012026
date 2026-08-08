import React from 'react';
import { useNavigate } from 'react-router-dom';

const DmmSidebar = ({
  activeMenu,
  setActiveMenu,
  isCollapsed,
  onToggleSidebar,
  currentRole,
}) => {
  const menuItems = ['Dashboard', 'Application Forwarded', 'Report Section'];
  const navigate = useNavigate();

  const roleSegment = (currentRole || 'dmmu').toLowerCase();

  const routeFor = (item) => {
    if (item === 'Dashboard') return `/mffi/${roleSegment}/dashboard`;
    if (item === 'Application Forwarded') return `/mffi/${roleSegment}/dashboard/applications`;
    if (item === 'Report Section') return `/mffi/${roleSegment}/dashboard/reports`;
    return `/mffi/${roleSegment}/dashboard`;
  };

  return (
    <div 
      style={{ 
        width: isCollapsed ? '72px' : '250px', 
        minWidth: isCollapsed ? '72px' : '250px', 
        
        
        aalignSelf: 'stretch', 
        minHeight: '100%',    
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.32)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.45)',
        padding: isCollapsed ? '16px 8px' : '18px 16px', 
        boxSizing: 'border-box', 
        zIndex: '1001', 
        overflowY: 'auto', 
        transition: 'width 0.25s ease, min-width 0.25s ease', 
        boxShadow: '2px 0 12px rgba(0, 0, 0, 0.08)', 
        flexShrink: 0 
      }}
    >
      {/* Toggle Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{
            width: '100%',
            height: '42px',
            borderRadius: '10px',
            border: '1px solid #fde68a',
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '700',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 4px 10px rgba(245, 158, 11, 0.22)',
          }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {isCollapsed ? '☰' : '← Close Sidebar'}
        </button>
      </div>

      {/* Menu Buttons List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = activeMenu === item;
          const icon = item === 'Dashboard' ? '📊' : item === 'Application Forwarded' ? '📋' : '📑';

          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                setActiveMenu(item);
                navigate(routeFor(item));
              }}
              style={{
                textAlign: 'left',
                width: '100%',
                padding: '12px 14px',
                cursor: 'pointer',
                borderRadius: '10px',
                background: isActive ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' : '#fff7ed',
                color: isActive ? '#fff' : '#9a2c00',
                border: isActive ? '1px solid #f59e0b' : '1px solid #fde68a',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                fontWeight: 700,
                boxShadow: isActive ? '0 4px 10px rgba(245, 158, 11, 0.25)' : 'none',
              }}
              title={item}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px' }}>{icon}</span>
                {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DmmSidebar;