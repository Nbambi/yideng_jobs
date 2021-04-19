import Koa from 'koa';
import render from 'koa-swig';

export interface Context extends Koa.Context {
    render: typeof render;
}