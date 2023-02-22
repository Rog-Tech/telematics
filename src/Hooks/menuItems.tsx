import { Toast } from 'primereact/toast'
import React, { useRef } from 'react'
import { SpeedDial } from 'primereact/speeddial';
import { MenuItem } from 'primereact/menuitem';
import { Badge } from 'primereact/badge';

export const MenuItems = (props:any) => {
    const toast = useRef<Toast>(null);
    const items: MenuItem[] = [
        {
            label: 'Add',
            icon: 'pi pi-bell',
            command: () => {
                props.setShowAlerts(true)
            }
        },
       
        {
            label: 'Delete',
            icon: 'pi pi-envelope',
            command: () => {
                // toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
            }
        }
    ];

    return (
        <div className='floating-menu'>
            <Badge className='notification-badge' value="2"></Badge>
            <Toast ref={toast} />
            <SpeedDial model={items} direction="up" style={{ left: 'calc(50% - 2rem)', bottom: 0 }} />
         </div>
    )
}
