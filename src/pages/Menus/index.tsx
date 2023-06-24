import React, {useRef, useState} from 'react';
import {Button, Checkbox, Form, Input, InputNumber, message, Modal, Space} from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';

import {createMenu, deleteMenu, getMenus, updateMenu} from '@/services/ant-design-pro/menus';
import {DeleteOutlined, EditOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {useModel} from "@umijs/max";

const handleSaveMenu: (menu:API.Menu) => Promise<boolean> = async (menu)=>{
  const loadMsgHide = message.loading("正在保存");
  const resp = menu.id? await updateMenu(menu) : await createMenu(menu);
  loadMsgHide();
  if(resp && resp.success) {
    message.success(resp.data);
    return true;
  }
  message.error(resp.data);
  return false;
}

const handleDeleteMenu: (menuId:string) => Promise<boolean> = async (menuId)=>{
  const loadMsgHide = message.loading("正在删除");
  console.log("Delete MenuId -> ",menuId);
  const resp = await deleteMenu(menuId) ;
  loadMsgHide();
  if(resp && resp.success) {
    message.success(resp.data);
    return true;
  }
  message.error(resp.data);
  return false;
}

const MenuList: React.FC = () =>{

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addMenuForm] = Form.useForm();
    const tableRef = useRef<ProTable>(null);

    const {initialState,setInitialState} = useModel('@@initialState');

    const cols : ProColumns<API.Role>[] = [
      {
        title: "ID",
        dataIndex: "id",
      }, {
        title: "Icon",
        dataIndex: "icon",
      }, {
        title: "Name",
        dataIndex: "name",
      }, {
        title: "Path",
        dataIndex: "path",
      }, {
        title: "Order",
        dataIndex: "order",
      }, {
        title: "Hide",
        dataIndex: "hide",
        renderText: (text: any,record: API.Menu) => {
          return record.hide?"启用菜单":"禁用菜单"
        }
      }, {
        title: "Action ",
        dataIndex: "action",
        render: (dom:React.ReactDOM, entity:API.Menu) => {
          return (
            <>
              <Space>
                <Button icon={<EditOutlined/>} onClick={()=>{
                  setIsModalOpen(true);
                  entity.pid="";
                  addMenuForm.setFieldsValue(entity);
                }}></Button>
                <Button icon={<PlusCircleOutlined/>} onClick={()=>{
                  setIsModalOpen(true);
                  const newSubMenu:API.Menu = {
                    pid: entity.id,
                    children: [], hide: false, icon: "", id: "", name: "", order: 0, path: ""
                  }
                  addMenuForm.setFieldsValue(newSubMenu);
                }}></Button>
              <Button icon={<DeleteOutlined/>} onClick={ async ()=>{
                const res = await handleDeleteMenu(entity.id);
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
        <ProTable<API.Role> key={"tableMenus"} rowKey={"id"}
            actionRef={tableRef}
            columns={cols}
            toolbar={{
              actions: [
                <Button
                  key="primary" type="primary"
                  onClick={() => {
                    setIsModalOpen(true);
                    const newMenu:API.Menu = {
                      pid: "", children: [], hide: false, icon: "", id: "", name: "", order: 0, path: ""
                    }
                    addMenuForm.setFieldsValue(newMenu);
                  }}
                >
                  添加
                </Button>

              ],
            }}
            request={ async ()=> await getMenus()}
        />
      <Modal title={"菜单对话框"}
        open={isModalOpen}
        onCancel={()=>{setIsModalOpen(false)}}
        onOk={()=>{
          addMenuForm.validateFields()
            .then(async menu => {
              const res:boolean = await handleSaveMenu(menu);
              if(res){

                const menus = await initialState!.fetchMenus!();

                setInitialState({
                  menus,
                  ...initialState
                })
                window.location.reload();

                setIsModalOpen(false);
                tableRef.current.reload();
              }
            })
        }}
      >
        <Form form={addMenuForm}>
          <Form.Item label="Id" name="id" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item label="Pid" name="pid" >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="Icon" name="icon" required={true}>
            <Input />
          </Form.Item>
          <Form.Item label="Name" name="name" required={true}>
            <Input />
          </Form.Item>
          <Form.Item label="Path" name="path" required={true}>
            <Input />
          </Form.Item>
          <Form.Item label="Order" name="order" required={true}>
            <InputNumber/>
          </Form.Item>
          <Form.Item label="Hide" name="hide" required={true} valuePropName={"checked"}>
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </>
}
export default MenuList;
