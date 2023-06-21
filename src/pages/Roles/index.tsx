import React from 'react';

import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';

import { getRoles } from '@/services/ant-design-pro/roles';

const RoleList: React.FC = () =>{
    const colums : ProColumns[] = [
        {
            title: "ID",
            dataIndex: "id",
        }, {
            title: "Name",
            dataIndex: "name",
        }
    ]
    return <>
        <ProTable 
            columns={colums}
            request={ async (params)=> {
                const result = await getRoles();
                return result;
            }}
        />
    </>
}
export default RoleList;