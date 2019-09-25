import { Load } from '../Load'
import { Node } from './Node'

export class Zone {

    name: string;
    childrenZones: Array<Zone>;
    childrenNodes: Array<Node>;

    constructor(name: string, childrenZones: Array<Zone>, childrenLoads: Array<Load>) {
        this.name = name;
        this.childrenZones = childrenZones
        this.childrenNodes = childrenLoads.map(function(element){return new Node(element)});
    }
}
