import { request } from '@umijs/max';

export async function getRoles(){
    return  request('/api/roles');
}

export async function createRole(role:API.Role){
  return request('/api/roles',{
    method:'POST',
    data: role
  });
}

export async function updateRole(role:API.Role){
  return request(`/api/roles/${role.id}`,{
    method:'POST',
    data: role
  });
}

export async function deleteRole(roleId:string){
  return request(`/api/roles/${roleId}`,{
    method:'DELETE'
  });
}
