import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/shared/services/login.service';
import { CatalogService } from 'src/app/shared/services/catalog.service';
import { Products } from 'src/app/shared/models/products';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { map, Observable, startWith } from 'rxjs';
import { TakePhotoComponent } from 'src/app/components/take-photo/take-photo.component';
import { FileUtils } from 'src/app/shared/functions/file-utils';
import { OrderService } from 'src/app/shared/services/order.service';
@Component({
  selector: 'app-suggest-change',
  templateUrl: './suggest-change.component.html',
  styleUrls: ['./suggest-change.component.css']
})
export class SuggestChangeComponent implements OnInit {
  suggetsChangeForm: FormGroup;
  public submitted: boolean = false;
  public marketId: string;
  public products: Array<Products> = [];
  public options: string[] = [];
  public filteredOptions: Observable<string[]>;
  public product: Products = {
    id: "",
    name: "",
    image: "",
    brand: "",
    price: 0,
    availableQuantity: 0,
    availability: "",
    categoryName: "",
    description: "",
    checkSelected: false,
  };
  public showInputFile: boolean = false;
  public link: string;
  public type: string;
  public file: any = null;
  public allowTypes: string;
  public typeFile: any = '';

  constructor(
    public dialogRef: MatDialogRef<SuggestChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public loginService: LoginService,
    public catalogService: CatalogService,
    public notificationService: NotificationService,
    public dialog: MatDialog,
    private fileUtils: FileUtils,
    private orderService: OrderService
  ) {
    this.suggetsChangeForm = this.formBuilder.group({
      productId: [data.productId],
      productName: [data.productName, Validators.required],
      productPrice: [data.productPrice, [Validators.required, Validators.pattern('^[0-9]*$')]],
      productQuantity: [data.productQuantity, [Validators.required, Validators.pattern('^[0-9]*$')]],
    });

    this.product = {
      id: data.productId,
      name: data.productName,
      image: data.productImage,
      brand: '',
      price: data.productPrice,
      availableQuantity: 0,
      availability: '',
      categoryName: '',
      description: '',
      checkSelected: false,
    }
  }

  get f() {
    return this.suggetsChangeForm.controls;
  }

  ngOnInit(): void {
    this.allowTypes = this.fileUtils.getAllowTypesFormated();
    this.getCatalog();
  }

  saveSuggetsChange() {
    this.submitted = true;
    if (!this.suggetsChangeForm.invalid) {
      this.dialogRef.close(
        {
          change: true,
          product: this.data,
          productId: this.suggetsChangeForm.get('productId')?.value,
          productName: this.suggetsChangeForm.get('productName')?.value,
          productPrice: this.suggetsChangeForm.get('productPrice')?.value,
          productQuantity: this.suggetsChangeForm.get('productQuantity')?.value,
          productImage: this.product.image
        }
      );
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  public getCatalog() {
    this.marketId = this.loginService.getCurrentMarketId();
    this.catalogService.getCatalog(this.marketId).subscribe(
      response => {
        if (response.isSuccess) {
          response.resultData.map(
            (item: any) => {
              let product: Products = {
                id: item.productId,
                name: item.productName,
                image: item.productImage,
                brand: item.productBrand,
                price: item.productPrice,
                availableQuantity: item.availableQuantity,
                availability: item.availability,
                categoryName: item.categoryName,
                description: item.description,
                checkSelected: item.checkSelected,
              }
              if (product.checkSelected) {
                this.products.push(product);
                this.options.push(product.name);
              }
            }
          );
          this.filterProduct(this.data.productName);
        } else {
          this.notificationService.notification('info', '', response.message);
        }
      },
      error => {
        this.notificationService.notification('info', '', error);
      }
    )
  }

  filterProduct(productName: string) {
    let control = this.suggetsChangeForm.get('productName');
    if (control) {
      this.filteredOptions = control.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
      control.setValue(productName);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  changeProduct() {
    let value: string = this.suggetsChangeForm.get('productName')?.value;
    let product = this.products.find(product => product.name == value.trim());
    if (product) {
      this.product = product;
    } else {
      this.product = {
        id: "",
        name: "",
        image: "",
        brand: "",
        price: 0,
        availableQuantity: 0,
        availability: "",
        categoryName: "",
        description: "",
        checkSelected: false,
      }
    }
  }

  // *************************** PHOTO ********************************************************

  showModalTakePhoto() {
    const dialogRef = this.dialog.open(TakePhotoComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.link = data;
        let extension = this.fileUtils.getExtension(this.link);
        let type = this.fileUtils.getType(extension);
        if (type) {
          this.type = type;
          this.showInputFile = false;

          this.product = {
            id: "",
            name: this.suggetsChangeForm.get('productName')?.value,
            image: this.link,
            brand: '',
            price: 0,
            availableQuantity: 0,
            availability: '',
            categoryName: '',
            description: '',
            checkSelected: false,
          }
        }
      }
    });
  }

  /**
 * Obtener archivo de input
 *
 * @return response()
 */
  onFileChange(event: any) {
    this.file = null;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let typeListImage = this.fileUtils.getAllowTypes().filter(f => f.label == 'image');

      typeListImage.forEach(t => {
        if (t.value == file.type) {
          this.typeFile = file;
          if (this.fileUtils.isAllowType(file.type)) {
            this.file = file;
          } else {
            this.file = null;
          }
          return;
        }
      });
      if (this.file == null)
        this.typeFile = null;
    }
  }

  // *************************** MULTIMEDIA ********************************************************

  public saveFile() {
    this.submitted = true;
    if (this.file) {
      const params = new FormData();
      params.append('file', this.file);

      this.orderService.saveFile(params).subscribe(
        response => {
          this.link = response.resultData;
          let extension = this.fileUtils.getExtension(this.link);
          let type = this.fileUtils.getType(extension);
          if (type) {
            this.type = type;
            this.showInputFile = false;

            this.product = {
              id: "",
              name: this.suggetsChangeForm.get('productName')?.value,
              image: this.link,
              brand: '',
              price: 0,
              availableQuantity: 0,
              availability: '',
              categoryName: '',
              description: '',
              checkSelected: false,
            }
          }
        },
        error => {
          console.log(error)
        }
      );
    }
  }

}
