import { Injectable } from "@angular/core";
import { Adapter } from "../adapters/adapter";

export class Permission {

    rolId: number;
    marketModuleId: number;
    moduleName: string;

    constructor(
        rolId: number,
        marketModuleId: number,
        moduleName: string,
    ) {
        this.rolId = rolId;
        this.marketModuleId = marketModuleId;
        this.moduleName = moduleName;
    }
}

@Injectable({
    providedIn: "root",
})
export class PermissionAdapter implements Adapter<Permission> {
    adapt(item: any): Permission {
        return new Permission(
            item.rolId,
            item.marketModuleId,
            item.moduleName
        )
    }
}