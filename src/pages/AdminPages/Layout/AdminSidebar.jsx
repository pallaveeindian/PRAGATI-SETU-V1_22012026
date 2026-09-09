import React, { useState } from 'react';
import { 
    FaHome,          
    FaChartBar, 
    FaFileAlt, 
    FaUsers, 
    FaClipboardList, 
    FaBars, 
    FaArrowLeft,
    FaChevronDown,
    FaChevronRight
} from 'react-icons/fa';

const AdminSidebar = ({
    activeMenu,
    setActiveMenu,
    isCollapsed,
    onToggleSidebar,
    fixed = false,
    transparent = false,
    currentGradient // <-- Naya prop jo AdminLayout se color laayega
}) => {
    // State to handle the toggle of the TMS Portal sub-menu
    const [isTmsOpen, setIsTmsOpen] = useState(() =>
        ['User Management', 'Training Batch List', 'Training Request List'].includes(activeMenu),
    );
    
    const menuItems = [
        { name: 'Home Dashboard', icon: <FaHome /> }, 
        { name: 'Grievances List', icon: <FaChartBar /> },
        { 
            name: 'TMS Portal', 
            icon: <FaFileAlt />,
            isParent: true, // Indicates that this menu has children (nested items)
            children: [
                { name: 'User Management', icon: <FaUsers /> },
                { name: 'Training Batch List', icon: <FaClipboardList /> },
                { name: 'Training Request List', icon: <FaClipboardList /> },
                { name: 'Training Target', icon: <FaClipboardList /> },
            ]
        },
    ];

    const handleMenuClick = (item) => {
        // 1. Always update the active menu so the data loads on the main dashboard
        setActiveMenu(item.name);
        
        // 2. If it is a parent menu, also toggle the nested dropdown visibility
        if (item.isParent) {
            setIsTmsOpen(!isTmsOpen);
        }
    };

    // Reusable function to render menu buttons (both parent and children)
    const renderMenuButton = (item, isChild = false) => {
        const isActive = activeMenu === item.name;
        
        return (
            <button
                key={item.name}
                type="button"
                onClick={() => handleMenuClick(item)}
                style={{
                    textAlign: 'left',
                    width: '100%',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    // Semi-transparent background for the active state
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    color: '#fff',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid transparent',
                    display: 'flex',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    fontWeight: 600,
                    fontSize: isChild ? '14px' : '15px', // Slightly smaller font for nested items
                    boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
                }}
                title={item.name}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%' }}>
                    <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    {!isCollapsed && <span>{item.name}</span>}
                </div>
                
                {/* Show toggle arrow only for parent menus when sidebar is expanded */}
                {!isCollapsed && item.isParent && (
                    <span style={{ fontSize: '12px' }}>
                        {isTmsOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                )}
            </button>
        );
    };

    return (
        <div className={transparent ? 'admin-sidebar-transparent' : ''} style={{ 
            width: isCollapsed ? '72px' : '260px', 
            minWidth: isCollapsed ? '72px' : '260px', 
            height: 'calc(100vh - 70px)', 
            
            // Yahan par dynamic color pass ho raha hai (jab transparent nahi hoga)
            background: transparent ? 'rgba(15, 23, 42, 0.38)' : currentGradient, 
            
            color: '#fff', 
            padding: isCollapsed ? '16px 8px' : '18px 16px', 
            boxSizing: 'border-box', 
            zIndex: '999', 
            overflowY: 'auto', 
            // Background change hone par smooth 0.5s ka transition effect aayega
            transition: 'width 0.25s ease, min-width 0.25s ease, background 0.5s ease', 
            boxShadow: '2px 0 12px rgba(15, 23, 42, 0.15)', 
            flexShrink: 0, 
            alignSelf: 'flex-start', 
            position: fixed ? 'fixed' : 'sticky', 
            top: fixed ? '70px' : 0, 
            left: fixed ? 0 : undefined 
        }}>

            <style>{`
                .admin-sidebar-transparent {
                    backdrop-filter: blur(7px);
                }
            `}</style>

            {/* Toggle Sidebar Button */}
            <div style={{ marginBottom: '20px' }}>
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    style={{
                        width: '100%',
                        height: '42px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(0, 0, 0, 0.15)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '700',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexShrink: 0,
                        transition: 'transform 0.2s ease, background 0.2s ease',
                    }}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.15)';
                    }}
                >
                    {isCollapsed ? <FaBars /> : <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaArrowLeft /> Close Sidebar</span>}
                </button>
            </div>

            {/* Menu Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map((item) => (
                    <React.Fragment key={item.name}>
                        {/* Render Main Menu Button */}
                        {renderMenuButton(item)}
                        
                        {/* Render Nested Sub-Menu if parent is open */}
                        {item.isParent && isTmsOpen && (
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '4px', 
                                // Indent the sub-menu items to create a tree structure
                                paddingLeft: isCollapsed ? '0px' : '25px',
                                marginTop: '4px',
                                borderLeft: isCollapsed ? 'none' : '2px solid rgba(255, 255, 255, 0.2)',
                                marginLeft: isCollapsed ? '0px' : '15px'
                            }}>
                                {item.children.map((child) => renderMenuButton(child, true))}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default AdminSidebar;