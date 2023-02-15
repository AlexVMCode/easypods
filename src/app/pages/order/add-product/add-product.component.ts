import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { TakePhotoComponent } from 'src/app/components/take-photo/take-photo.component';
import { FileUtils } from 'src/app/shared/functions/file-utils';
import { Products } from 'src/app/shared/models/products';
import { CatalogService } from 'src/app/shared/services/catalog.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  @Input()
  orderId: number;

  @Output() sidenav: EventEmitter<any> = new EventEmitter();

  public productForm: FormGroup;
  public submitted: boolean = false;
  public myControl = new FormControl('');
  public filteredOptions: Observable<string[]>;
  public options: string[] = [];
  public marketId: string;
  public products: Array<Products> = [];
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
  public allowTypes: string;
  public file: any = null;
  public typeFile: any = '';

  constructor(
    public formBuilder: FormBuilder,
    public loginService: LoginService,
    public notificationService: NotificationService,
    public catalogService: CatalogService,
    public orderService: OrderService,
    public dialog: MatDialog,
    private fileUtils: FileUtils,
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  get f() {
    return this.productForm.controls;
  }

  ngOnInit(): void {
    this.allowTypes = this.fileUtils.getAllowTypesFormated();
    this.getCatalog();
    this.resetForm();
  }

  resetForm() {
    this.productForm.get('name')?.setValue('');
    this.productForm.get('price')?.setValue('');
    this.productForm.get('quantity')?.setValue('');
  }

  public getCatalog() {
    this.marketId = this.loginService.getCurrentMarketId();
    this.catalogService.getCatalog(this.marketId).subscribe(
      response => {
        if (response.isSuccess === true) {
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
          this.filterProduct('');
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
    let control = this.productForm.get('name');
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
    let value: string = this.productForm.get('name')?.value;
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

  saveProduct() {
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    } else {
      this.orderService.addProduct(
        this.orderId,
        this.product.id,
        this.productForm.get('name')?.value,
        this.product.image,
        this.productForm.get('price')?.value,
        this.productForm.get('quantity')?.value,
        1
      ).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.sidenav.emit();
          } else {
            console.log(response);
            this.notificationService.notification('danger', 'Error al guardar producto', '');
          }
        },
        error: (error) => {
          console.log(error);
          this.notificationService.notification('danger', 'Error al guardar producto', '');
        }
      })
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
            name: this.productForm.get('name')?.value,
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
              name: this.productForm.get('name')?.value,
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
