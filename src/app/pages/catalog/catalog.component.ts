import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Products } from 'src/app/shared/models/products';
import { CatalogService } from 'src/app/shared/services/catalog.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatDrawer } from '@angular/material/sidenav'

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent {

  marketId: string;
  products: Array<Products> = [];
  selectedProduct: Products = new Products();
  dataSource: MatTableDataSource<Products> = new MatTableDataSource<Products>();
  sorteable: MatSortable;
  displayedColumns: string[] = ['image', 'name', 'brand', 'price', 'status'];
  showFiller: boolean = false;

  @ViewChild('scheduledOrdersPaginator', { static: false }) set paginator(pager: MatPaginator) {
    if (pager) this.dataSource.paginator = pager;
  }

  @ViewChild(MatSort, { static: false }) set sort(sorter: MatSort) {
    if (sorter) this.dataSource.sort = sorter;
  }

  @ViewChild('drawer', { static: false }) matDrawer: MatDrawer;

  constructor(
    public catalogService: CatalogService,
    public loginService: LoginService,
    public spinner: NgxSpinnerService,
    public notificationService: NotificationService,
  ) {
    this.getCatalog();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public getCatalog() {
    this.spinner.show();
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
              this.products.push(product);
            }
          );
          this.dataSource.data = (Object.values(this.products));
        } else {
          this.notificationService.notification('info', '', response.message);
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    )
  }

  public changeStateProduct(productId: string, status: boolean) {

    this.products.forEach(function (item, index, products) {
      if (item.id == productId) {
        item.checkSelected = status;
      }
    });

    this.catalogService.changeStatus(this.marketId, productId, status).subscribe(
      response => {
        if (!response.isSuccess) {
          this.notificationService.notification('info', '', response.message);
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.notificationService.notification('info', '', error);
      }
    )
  }

  public setDataDrawer(productId: string) {
    let product = this.products.find(item => item.id == productId);
    if (product) {
      this.selectedProduct = product;
      this.matDrawer.toggle();
    }
  }
}
