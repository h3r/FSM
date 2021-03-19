/*
Author: Hermann Plass (hermann.plass@gmail.com)
fsm.js (c) 2021
Desc: description
Created:  2021-03-18T18:46:20.392Z
Modified: 2021-03-19T02:16:52.510Z
*/
import { v4 as uuidv4 } from 'uuid';
var LEvent = window.LEvent;

class ctx {
    constructor(){
        data:{}
    }
}

let id = 0;
const getId = window.getId = () => uuidv4();

class Node
{
    constructor(options = {})
    {
        this.id = options.id ?? getId(); //string
        this.data = options.data ?? {label: `Node ${++id}`}; //object
        this.type = options.data ?? "default"; //string
        this.selected = options.selected ?? false; //boolean
        //this.sourcePosition: //string
        //this.targetPosition: //string
    }
}

class FSM{

}