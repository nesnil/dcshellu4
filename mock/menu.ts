import { Request, Response } from 'express';
import {isEmpty, nnid, waitTime} from '../src/utils';

const menus:API.Menu[] = [
  {
    id: "0",
    name: "欢迎",
    icon: 'smile',
    path: '/welcome',
    children:[],
    order: 0,
    hide: false
  },{
    id: "1",
    name: "管理员首页",
    icon: 'crown',
    path: '/admin',
    children:[
      {
        id: "2",
        pid: "1",
        name: "管理员子页面",
        icon: 'smile',
        path: '/admin/sub-page',
        children:[ ],
        order: 0,
        hide: false
      }
    ],
    order: 1,
    hide: false
  },  {
    id: "3",
    name: "菜单",
    icon: 'menu',
    path: '/menus',
    children:[],
    order: 2,
    hide: false
  }];


const getMenus = async (req: Request, res: Response) =>{
  await waitTime(1000);
  const result = {
    success: true,
    data: menus
  }
  return res.json(result);
}

const createSubMenu = async (req: Request, res: Response) =>{
  await waitTime(1000);

}
const createMenu = async (req: Request, res: Response) =>{
  await waitTime(1000);

  const pid = req.body.pid

  const newMenu:API.Menu = {
    id : nnid(),
    pid : req.body.pid,
    name : req.body.name,
    path: req.body.path,
    order: req.body.order,
    icon: req.body.icon,
    children: [],
    hide: req.body.hide,
  }
  if(isEmpty(pid)){
    menus.push(newMenu);
  }else{
    const parentMenuIdx = menus.findIndex(r=>r.id===pid)
    menus[parentMenuIdx].children.push(newMenu)
  }

  const result = {
    success: true,
    data: "新增菜单成功"
  }
  return res.json(result);
}

const updateMenu = async (req: Request, res: Response) =>{
  await waitTime(1000);

  const reqMenuIdx = menus.findIndex(r=>r.id===req.body.id)
  if(reqMenuIdx < 0){
    return res.json({
      success: false,
      data: "更新菜单信息失败"
    });
  }else{
    const newMenu:API.Menu = {
      id : req.body.id,
      name : req.body.name,
      path: req.body.path,
      order: req.body.order,
      icon: req.body.icon,
      children: req.body.children,
      hide: req.body.hide,
      type: req.body.type
    }
    menus.splice(reqMenuIdx,1,newMenu);
    return res.json({
      success: true,
      data: "更新角色信息成功"
    });
  }
}

const deleteMenu = async (req: Request, res: Response) =>{
  await waitTime(1000);

  const menuId = req.params.id;
  const reqMenuIdx = menus.findIndex(r=>r.id===menuId)
  console.log("reqMenuIdx -> ",reqMenuIdx);
  if(reqMenuIdx === -1) {
    return res.json({
      success: false,
      data: "删除菜单信息不存在"
    });
  }else{
    menus.splice(reqMenuIdx,1);
    return res.json({
      success: true,
      data: "删除菜单信息成功"
    });
  }
}

export default {
  'GET /api/menus': getMenus,
  'POST /api/menus': createMenu,
  'POST /api/menus/:id': updateMenu,
  'DELETE /api/menus/:id': deleteMenu
};
