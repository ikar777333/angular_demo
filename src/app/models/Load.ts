import {LoadAreas} from "../models/LoadAreas.enum"
import {LoadPurposes} from "../models/LoadPurposes.enum"
import {LoadSubPurposes} from "../models/LoadSubPurposes.enum"
import {LoadTypes} from "../models/LoadTypes.enum"

export class Load { 

  private id: number;  
  private name: string;
  private area: LoadAreas;
  private purpose: LoadPurposes;
  private subPurpose: LoadSubPurposes;
  private loadType: LoadTypes;
  private isSupply: boolean;
  private parentId: number;
  private isAllocated: boolean;
  private isBusbar: boolean;

  constructor($id: number, $name: string, $area: LoadAreas = LoadAreas.AREA1, $purpose: LoadPurposes = LoadPurposes.PURPOSE1, 
    $subPurpose: LoadSubPurposes = LoadSubPurposes.SUB_PURPOSE1, $loadType: LoadTypes, $isSupply: boolean = false, $parentId: number, 
    $isAllocated: boolean = false, $isBusbar: boolean = false) 
    {
		this.id = $id;
		this.name = $name;
		this.area = $area;
		this.purpose = $purpose;
		this.subPurpose = $subPurpose;
		this.loadType = $loadType;
		this.isSupply = $isSupply;
		this.parentId = $parentId;
		this.isAllocated = $isAllocated;
		this.isBusbar = $isBusbar;
  }
  
    /**
     * Getter $id
     * @return {number}
     */
	public get $id(): number {
		return this.id;
	}

    /**
     * Setter $id
     * @param {number} value
     */
	public set $id(value: number) {
		this.id = value;
	}

    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}

    /**
     * Getter $area
     * @return {LoadAreas}
     */
	public get $area(): LoadAreas {
		return this.area;
	}

    /**
     * Setter $area
     * @param {LoadAreas} value
     */
	public set $area(value: LoadAreas) {
		this.area = value;
	}

    /**
     * Getter $purpose
     * @return {LoadPurposes}
     */
	public get $purpose(): LoadPurposes {
		return this.purpose;
	}

    /**
     * Setter $purpose
     * @param {LoadPurposes} value
     */
	public set $purpose(value: LoadPurposes) {
		this.purpose = value;
	}

    /**
     * Getter $subPurpose
     * @return {LoadSubPurposes}
     */
	public get $subPurpose(): LoadSubPurposes {
		return this.subPurpose;
	}

    /**
     * Setter $subPurpose
     * @param {LoadSubPurposes} value
     */
	public set $subPurpose(value: LoadSubPurposes) {
		this.subPurpose = value;
	}

    /**
     * Getter $loadType
     * @return {LoadTypes}
     */
	public get $loadType(): LoadTypes {
		return this.loadType;
	}

    /**
     * Setter $loadType
     * @param {LoadTypes} value
     */
	public set $loadType(value: LoadTypes) {
		this.loadType = value;
	}

    /**
     * Getter $isSupply
     * @return {boolean}
     */
	public get $isSupply(): boolean {
		return this.isSupply;
	}

    /**
     * Setter $isSupply
     * @param {boolean} value
     */
	public set $isSupply(value: boolean) {
		this.isSupply = value;
	}

    /**
     * Getter $parentId
     * @return {number}
     */
	public get $parentId(): number {
		return this.parentId;
	}

    /**
     * Setter $parentId
     * @param {number} value
     */
	public set $parentId(value: number) {
		this.parentId = value;
	}

    /**
     * Getter $isAllocated
     * @return {boolean}
     */
	public get $isAllocated(): boolean {
		return this.isAllocated;
	}

    /**
     * Setter $isAllocated
     * @param {boolean} value
     */
	public set $isAllocated(value: boolean) {
		this.isAllocated = value;
	}

    /**
     * Getter $isBusbar
     * @return {boolean}
     */
	public get $isBusbar(): boolean {
		return this.isBusbar;
	}

    /**
     * Setter $isBusbar
     * @param {boolean} value
     */
	public set $isBusbar(value: boolean) {
		this.isBusbar = value;
	}
}