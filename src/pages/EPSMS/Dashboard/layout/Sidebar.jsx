import React, { useEffect, useState } from 'react';

const Sidebar = ({
    activeMenu,
    setActiveMenu,
    isCollapsed,
    onToggleSidebar,
}) => {
    // Nested menu ke liye state (Abhi comment kar diya hai)
    // const [expandedMenu, setExpandedMenu] = useState(null);

    const menuItems = ['Home Dashboard', 'Mapped CRP List', 'Login Status', 'CRP Performance', 'Form Beneficiaries'];

    /* 
    // Nested items for Form Beneficiaries (Commented)
    const formSubItems = [
      { name: 'Enterprise Detail', icon: '🏢' },
      { name: 'New Opening EnterPrise Detail', icon: '🆕' },
      { name: 'Not Interseted', icon: '❌' }
    ];
  
    // Agar user direct kisi sub-menu item par hai, toh parent open rahe (Commented)
    useEffect(() => {
      const subItemNames = formSubItems.map(sub => sub.name);
      if (subItemNames.includes(activeMenu)) {
        setExpandedMenu('Form Beneficiaries');
      } else if (activeMenu !== 'Form Beneficiaries') {
        setExpandedMenu(null);
      }
    }, [activeMenu]);
    */

    const handleMenuClick = (item) => {
        // Purana normal logic wapas laga diya hai
        setActiveMenu(item);

        /* 
        // Nested dropdown toggle logic (Commented)
        if (item === 'Form Beneficiaries') {
          setExpandedMenu(prev => prev === 'Form Beneficiaries' ? null : 'Form Beneficiaries');
          setActiveMenu(item);
        } else {
          setActiveMenu(item);
          setExpandedMenu(null);
        }
        */
    };

    return (
        <div style={{ width: isCollapsed ? '72px' : '250px', minWidth: isCollapsed ? '72px' : '250px', height: '100%', backgroundColor: '#ffffff', color: '#0f172a', padding: isCollapsed ? '16px 8px' : '18px 16px', boxSizing: 'border-box', zIndex: '1001', overflowY: 'auto', transition: 'width 0.25s ease, min-width 0.25s ease', boxShadow: '2px 0 12px rgba(15, 23, 42, 0.08)', flexShrink: 0, alignSelf: 'stretch' }}>

            <div style={{ marginBottom: '20px' }}>
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
                        flexShrink: 0,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0 4px 10px rgba(245, 158, 11, 0.22)',
                    }}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 14px rgba(245, 158, 11, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(245, 158, 11, 0.22)';
                    }}
                >
                    {isCollapsed ? '☰ ' : '← Close Sidebar'}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {menuItems.map((item) => {
                    // Normal active logic
                    const isActive = activeMenu === item;

                    /* 
                    // Nested active logic (Commented)
                    const isActive = activeMenu === item || (item === 'Form Beneficiaries' && formSubItems.some(sub => sub.name === activeMenu));
                    */

                    const icon = item === 'Home Dashboard' ? '🏠' : item === 'Login Status' ? '🔐' : item === 'CRP Performance' ? '📈' : item === 'Form Beneficiaries' ? '👥' : '📋';

                    /*
                    // Dropdown variables (Commented)
                    const hasDropdown = item === 'Form Beneficiaries';
                    const isExpanded = expandedMenu === item;
                    */

                    return (
                        <React.Fragment key={item}>
                            {/* Main Menu Button */}
                            <button
                                type="button"
                                onClick={() => handleMenuClick(item)}
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
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';
                                    e.currentTarget.style.color = '#fff';
                                    e.currentTarget.style.transform = 'translateX(2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = isActive ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' : '#fff7ed';
                                    e.currentTarget.style.color = isActive ? '#fff' : '#9a2c00';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>{icon}</span>
                                    {!isCollapsed && <span>{item}</span>}
                                </div>

                                {/* Show Dropdown Arrow (JSX Commented) */}
                                {/* 
                {!isCollapsed && hasDropdown && (
                  <span style={{ fontSize: '12px' }}>{isExpanded ? '▲' : '▼'}</span>
                )}
                */}
                            </button>

                            {/* Nested Sub-Menu Buttons (JSX Commented) */}
                            {/* 
              {hasDropdown && isExpanded && (
                <div 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '6px', 
                    paddingLeft: isCollapsed ? '0px' : '28px',
                    marginTop: '-4px',
                    marginBottom: '4px'
                  }}
                >
                  {formSubItems.map((subItem) => {
                    const isSubActive = activeMenu === subItem.name;
                    return (
                      <button
                        key={subItem.name}
                        onClick={() => setActiveMenu(subItem.name)}
                        style={{
                          textAlign: 'left',
                          width: '100%',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          background: isSubActive ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' : 'transparent',
                          color: isSubActive ? '#fff' : '#9a2c00',
                          border: 'none',
                          display: 'flex',
                          justifyContent: isCollapsed ? 'center' : 'flex-start',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s ease',
                          fontWeight: 600,
                          fontSize: '13px',
                        }}
                        title={subItem.name}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isSubActive ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' : '#ffedd5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isSubActive ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' : 'transparent';
                        }}
                      >
                        <span>{subItem.icon}</span>
                        {!isCollapsed && <span>{subItem.name}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
              */}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;