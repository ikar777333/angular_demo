import { Load } from '../Load'

export class Node {
    load: Load;
    children: Array<Node>;
    parents: Array<Node>;

    constructor(data: Load) {
        this.load = data;
        this.children = data.$childrenLoads.map(function(element){return new Node(element)});
    }
}