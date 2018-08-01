import resource from './index';

export const example = resource('/example/:id');
export const exampleError = resource('/example/:id/error');
export const staticResult = resource('/static');
export const staticFixResult = resource('/static/fixed');
export const staticList = resource('/static/list');
export const tokyoList = resource('/tokyo/list');
export const tokyoResult = resource('/tokyo');
