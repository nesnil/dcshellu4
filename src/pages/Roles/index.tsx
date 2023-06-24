import React, {useRef, useState} from 'react';
import {Button, Checkbox, Form, Input, InputNumber, message, Modal, Space} from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';

import {createRole, deleteRole, getRoles, updateRole} from '@/services/ant-design-pro/roles';
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

const handleSaveRole: (role:API.Role) => Promise<boolean> = async (role)=>{
  const loadMsgHide = message.loading("正在保存");
  const resp = role.id? await updateRole(role) : await createRole(role);
  loadMsgHide();
  if(resp && resp.success) {
    message.success(resp.data);
    return true;
  }
  message.error(resp.data);
  return false;
}

const handleDeleteRole: (roleId:string) => Promise<boolean> = async (roleId)=>{
  const loadMsgHide = message.loading("正在删除");
  const resp = await deleteRole(roleId) ;
  loadMsgHide();
  if(resp && resp.success) {
    message.success(resp.data);
    return true;
  }
  message.error(resp.data);
  return false;
}

const RoleList: React.FC = () =>{

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addRoleForm] = Form.useForm();
    const tableRef = useRef<ProTable>(null);
    const cols : ProColumns<API.Role>[] = [
      {
        title: "ID",
        dataIndex: "id",
      }, {
        title: "Name",
        dataIndex: "name",
      }, {
        title: "Identifier",
        dataIndex: "identifier",
      }, {
        title: "Order",
        dataIndex: "order",
      }, {
        title: "Enabled",
        dataIndex: "enabled",
        /* 使用文本渲染 TF
        renderText: (text: any,record: API.Role, index:number ) => {
          return record.enabled?"启用":"禁用"
        }*/
        //使用枚举渲染 TF
        valueEnum: {
          "true" : { text : "启用" , status : "Success"},
          "false": { text : "禁用" , status : "Error"},
        }
      }, {
        title: "ExpireTime",
        dataIndex: "expireTime",
      }, {
        title: "Action ",
        dataIndex: "action",
        render: (dom:React.ReactDOM, entity:API.Role) => {
          return (
            <>
              <Space>
              <Button icon={<EditOutlined/>} onClick={()=>{
                setIsModalOpen(true);
                addRoleForm.setFieldsValue(entity);
              }}></Button>
              <Button icon={<DeleteOutlined/>} onClick={ async ()=>{
                const res = await handleDeleteRole(entity.id);
                if(res){
                  tableRef.current.reload();
                }
              }}></Button>
              </Space>
            </>
          )
        }
      }
    ]
    return <>
        <ProTable<API.Role> key={"tableRoles"} rowKey={"id"}
            actionRef={tableRef}
            columns={cols}
            toolbar={{
              actions: [
                <Button
                  key="primary"
                  type="primary"
                  onClick={() => {
                    setIsModalOpen(true);
                    const newRole:API.Role = {
                      enabled: false, id: "", identifier: "", name: "", order: 0
                    }
                    addRoleForm.setFieldsValue(newRole);
                  }}
                >
                  添加
                </Button>

              ],
            }}
            request={ async ()=> await getRoles()}
        />
      <Modal title={"角色对话框"}
        open={isModalOpen}
        onCancel={()=>{setIsModalOpen(false)}}
        onOk={()=>{
          addRoleForm.validateFields()
            .then(async role => {
              const res:boolean = await handleSaveRole(role);
              if(res){
                setIsModalOpen(false);
                tableRef.current.reload();
              }
            })
        }}
      >
        <Form form={addRoleForm}>
          <Form.Item label="role.id" name="id" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item label="role.name" name="name" required={true}>
            <Input />
          </Form.Item>
          <Form.Item label="role.identifier" name="identifier" required={true}>
            <Input />
          </Form.Item>
          <Form.Item label="role.order" name="order" required={true}>
            <InputNumber/>
          </Form.Item>
          <Form.Item label="role.enabled" name="enabled" required={true} valuePropName={"checked"}>
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </>
}
export default RoleList;
