/*
Author: Hermann Plass (hermann.plass@gmail.com)
fsm.js (c) 2021
Desc: description
Created:  2021-03-18T18:46:20.392Z
Modified: 2021-03-18T21:17:13.865Z
*/

class ctx {
    constructor(){
        data:{}
    }
}

let id = 0;
const getId = window.getId = () => `node_${id++}`;

class Node
{
    constructor(options = {})
    {
        this.id = options.id ?? getId(); //string
        this.data = options.data ?? null; //object
        this.type = options.data ?? "default"; //string
        this.selected = options.selected ?? false; //boolean
        //this.sourcePosition: //string
        //this.targetPosition: //string
    }


}