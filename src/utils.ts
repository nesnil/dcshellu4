import {nanoid} from 'nanoid';

export const nnid = () => {
  return nanoid(10);
}

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const isEmpty = (str: string) => {
  return !str
}
