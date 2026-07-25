import React from 'react';

const AdminSidebar = ({
    activeMenu,
    setActiveMenu,
    isCollapsed,
    onToggleSidebar,
}) => {
   
    const menuItems = [
        { name: 'Admin Dashboard', icon: '📊' },
        {name: 'TMS Portal', icon: '📝'},
        { name: 'User Management', icon: '👥' },
      
    ];

    const handleMenuClick = (menuName) => {
        setActiveMenu(menuName);
    };

    return (
        <div style={{ width: isCollapsed ? '72px' : '250px', minWidth: isCollapsed ? '72px' : '250px', height: 'calc(100vh - 72px)', backgroundColor: '#ffffff', color: '#0f172a', padding: isCollapsed ? '16px 8px' : '18px 16px', boxSizing: 'border-box', zIndex: '1001', overflowY: 'auto', transition: 'width 0.25s ease, min-width 0.25s ease', boxShadow: '2px 0 12px rgba(15, 23, 42, 0.08)', flexShrink: 0, alignSelf: 'flex-start', position: 'sticky', top: '72px' }}>

            <div style={{ marginBottom: '20px' }}>
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    style={{
                        width: '100%',
                        height: '42px',
                        borderRadius: '10px',
                        border: '1px solid #fde68a',
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #e11d48 100%)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '700',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexShrink: 0,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)', // Typo 00 fixed to 0
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
                    // Ab item ek object hai, toh uska naam item.name se check karenge
                    const isActive = activeMenu === item.name;

                    return (
                        <React.Fragment key={item.name}>
                            <button
                                type="button"
                                onClick={() => handleMenuClick(item.name)}
                                style={{
                                    textAlign: 'left',
                                    width: '100%',
                                    padding: '12px 14px',
                                    cursor: 'pointer',
                                    borderRadius: '10px',
                                    background: isActive ? 'linear-gradient(135deg, #1d4ed8 0%, #e11d48 100%)' : '#fff7ed',
                                    color: isActive ? '#fff' : '#9a2c00',
                                    border: isActive ? '1px solid #f59e0b' : '1px solid #fde68a',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.2s ease',
                                    fontWeight: 700,
                                    boxShadow: isActive ? '0 4px 12px rgba(225, 29, 72, 0.25)' : 'none',
                                }}
                                title={item.name}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #e11d48 100%)';
                                    e.currentTarget.style.color = '#fff';
                                    e.currentTarget.style.transform = 'translateX(2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = isActive ? 'linear-gradient(135deg, #1d4ed8 0%, #e11d48 100%)' : '#fff7ed';
                                    e.currentTarget.style.color = isActive ? '#fff' : '#9a2c00';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {/* Icon bhi item.icon se direct aayega */}
                                    <span>{item.icon}</span>
                                    {!isCollapsed && <span>{item.name}</span>}
                                </div>
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminSidebar;