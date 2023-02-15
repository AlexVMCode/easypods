import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Roles } from 'src/app/shared/models/roles';
import { Users } from 'src/app/shared/models/users';
import { LoginService } from 'src/app/shared/services/login.service';
import { RolesService } from 'src/app/shared/services/roles.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'user-form-component',
    templateUrl: 'user-form-component.html',
})
export class UserFormComponent implements OnInit {

    userForm: FormGroup;
    submitted: boolean = false;
    roles: Array<Roles> = [];
    marketId: number;
    userId: number;

    constructor(
        public dialogRef: MatDialogRef<UserFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Users | undefined,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private rolesService: RolesService,
        public loginService: LoginService
    ) {
        this.marketId = Number(loginService.getCurrentMarketId());
        this.userId = data ? data.id : 0;

        this.userForm = this.formBuilder.group({
            marketId: [this.marketId, Validators.required],
            id: [0, Validators.required],
            username: ['', Validators.required],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            rolId: ['', Validators.required],
            isActive: [true, Validators.required],
        });

        if (data) {
            this.userForm.get('id')?.setValue(data.id);
            this.userForm.get('username')?.setValue(data.userName);
            this.userForm.get('phone')?.setValue(data.phone);
            this.userForm.get('rolId')?.setValue(data.rolId);
            this.userForm.get('isActive')?.setValue(data.isActive);
        }
    }

    get f() {
        return this.userForm.controls;
    }

    ngOnInit(): void {
        this.getRoles();
    }

    getRoles() {
        this.rolesService.getRoles().subscribe(
            response => {
                this.roles = response;
            },
            error => {
                console.log(error);
            }
        )
    }

    saveUser() {
        this.submitted = true;
        if (this.userForm.invalid) {
            return;
        } else {
            this.userService.saveUser(this.userForm.value).subscribe(
                response => {
                    this.dialogRef.close();
                },
                error => {
                    console.log(error)
                }
            )
        }
    }
}