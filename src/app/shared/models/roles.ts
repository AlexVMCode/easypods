import { Injectable } from "@angular/core";
import { Adapter } from "../adapters/adapter";

export class Roles {
    id: number;
    name: string;
    isActive: true;
    createdAt: string;

    constructor(
        id: number,
        name: string,
        isActive: true,
        createdAt: string
    ) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }
}

@Injectable({
    providedIn: "root",
})
export class RoleAdapter implements Adapter<Roles> {
    adapt(item: any): Roles {
        return new Roles(
            item.id,
            item.name,
            item.isActive,
            item.created
        )
    }
}