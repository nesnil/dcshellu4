import { Request, Response } from 'express';
import { waitTime } from '../src/utils';

const roles:API.Role[] = [
  {
    id: "0",
    name: "Admin",
    identifier: 'admin',
    order: 0,
    enabled: true
  },{
    id: "1",
    name: "Linsen",
    identifier: 'test',
    order: 20,
    enabled: false,
    expireTime: 1687424355
  }];

const getRoles = async (req: Request, res: Response) =>{
    await waitTime(1000);
    const result = {
        success: true,
        data: roles
    }
    return res.json(result);
}

const createRole = async (req: Request, res: Response) =>{
  await waitTime(1000);

  const newRole:API.Role = {
    id : `${roles.length+1}`,
    name : req.body.name,
    identifier: req.body.identifier,
    order: req.body.order,
    enabled: req.body.enabled
  }
  // roles = [...roles,newRole];
  roles.push(newRole);

  const result = {
    success: true,
    data: "新增角色成功"
  }
  return res.json(result);
}

const updateRole = async (req: Request, res: Response) =>{
  await waitTime(1000);

  const reqRoleIdx = roles.findIndex(r=>r.id===req.body.id)
  if(reqRoleIdx < 0){
    return res.json({
      success: false,
      data: "更新角色信息失败"
    });
  }else{
    const newRole:API.Role = {
      id : req.body.id,
      name : req.body.name,
      identifier: req.body.identifier,
      order: req.body.order,
      enabled: req.body.enabled
    }
    roles.splice(reqRoleIdx,1,newRole);
    return res.json({
      success: true,
      data: "更新角色信息成功"
    });
  }
}

const deleteRole = async (req: Request, res: Response) =>{
  await waitTime(1000);

  const roleId = req.params.id;
  const reqRoleIdx = roles.findIndex(r=>r.id===roleId)

  if(reqRoleIdx === -1) {
    return res.json({
      success: false,
      data: "删除角色信息不存在"
    });
  }else{
    roles.splice(reqRoleIdx,1);
    return res.json({
      success: true,
      data: "删除角色信息成功"
    });
  }
}

export default {
  'GET /api/roles': getRoles,
  'POST /api/roles': createRole,
  'POST /api/roles/:id': updateRole,
  'DELETE /api/roles/:id': deleteRole
};
