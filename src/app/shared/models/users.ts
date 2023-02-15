import { Injectable } from "@angular/core";
import { Adapter } from "../adapters/adapter";

export class Users {
    id: number;
    marketId: number;
    rolId: number;
    userName: string;
    phone: string;
    isActive: true;
    createdAt: string;

    constructor(
        id: number,
        marketId: number,
        rolId: number,
        userName: string,
        phone: string,
        isActive: true,
        createdAt: string
    ) {
        this.id = id;
        this.marketId = marketId;
        this.rolId = rolId;
        this.userName = userName;
        this.phone = phone;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }
}

@Injectable({
    providedIn: "root",
})
export class UserAdapter implements Adapter<Users> {
    adapt(item: any): Users {
        return new Users(
            item.id,
            item.marketId,
            item.rolId,
            item.userName,
            item.phone,
            item.isActive,
            item.created
        )
    }
}