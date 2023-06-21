import { request } from '@umijs/max';

export async function getRoles(){
    return  request('/api/roles');
}