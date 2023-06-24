import { request } from '@umijs/max';

export async function getMenus(){
    return  request('/api/menus');
}

export async function createMenu(menu:API.Menu){
  return request('/api/menus',{
    method:'POST',
    data: menu
  });
}

export async function updateMenu(menu:API.Menu){
  return request(`/api/menus/${menu.id}`,{
    method:'POST',
    data: menu
  });
}

export async function deleteMenu(menuId:string){
  return request(`/api/menus/${menuId}`,{
    method:'DELETE'
  });
}
