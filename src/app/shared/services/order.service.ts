import { catchError, map, Observable, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../config/endpoints';
import { MessageChat, MessageChatAdapter } from '../models/message-chat';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService {
  constructor(public http: HttpClient, private adapter: MessageChatAdapter) {
    super();
  }

  /**
   * @description Service to consult a store's orders
   */
  public getOrderById(params: any): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_ORDER}/GetOrderByMarket`, params).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }

  /**
   * @description Service to consult a orders's detail
   */
  public getDetailOrderById(idOrder: any): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_ORDER}/` + idOrder).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }

  /**
   * @description Method to query the statuses of an order
   */
  public getStatusOrder(): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_ORDER}/GetOrderStatus`).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }

  /**
   * @description Method to query the statuses of an order
   */
  public getChangeStatus(params: any): Observable<any> {
    return this.http
      .post(`${URL_SERVICES.URL_ORDER}/ChangeStatus`, params)
      .pipe(
        map((response: any) => {
          return response;
        }),
        pipe(
          catchError((error: any) => {
            return this.handleError(error);
          })
        )
      );
  }

  /**
   * @description Method to query the statuses of an order
   */
  public changeStatusProduct(params: any): Observable<any> {
    return this.http
      .post(`${URL_SERVICES.URL_ORDER}/ChangeDetailStatus`, params)
      .pipe(
        map((response: any) => {
          return response;
        }),
        pipe(
          catchError((error: any) => {
            return this.handleError(error);
          })
        )
      );
  }

  /**
   * @description Listar historial de conversación con el cliente asociado al pedido
   * @param orderId
   */
  public getHistoricalChat(orderId: any): Observable<Array<MessageChat>> {
    return this.http.get(`${URL_SERVICES.URL_CHAT}/GetMessageHistory?orderId=` + orderId)
      .pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      ).pipe(
        map((response: any) =>
          response.resultData[0].messages.map(
            (item: any) => this.adapter.adapt(item)
          )
        )
      );
  }

  /**
   * @description Enviar un mensaje al cliente
   * @param phoneClient
   */
  public sendMessageChat(params: any): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_CHAT}/SendMessageToClient`, params).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }

  /**
   * @description Guardar archivo en API
   * @param params
   */
  public saveFile(params: FormData): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_CHAT}/SaveMediaContent`, params).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }

  /**
   * @description Returns the history of the chat with the customer
   * @param userId
   * @param orderId
   */
  public setUserToOrder(userId: number, orderId: number): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_MARKET}/AssignUserToOrder`, {
      marketUserId: userId,
      orderId: orderId
    }).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }

  /**
   * 
   * @description Permite obtener estado de despacho
   */
  public getDispatchStatus(orderId: number): Observable<any> {
    return this.http.get(`${URL_SERVICES.URL_ORDER}/OrderIsValidBeDispatched`, {
      params: {
        orderId: orderId
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }

  /**
   * 
   * @description Permite cambiar el estado del pago de una orden
   * @param orderId ID Orden
   * @param paymentStatus Estado pago
   */
  public changePaymentStatus(orderId: number, paymentStatus: boolean): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_ORDER}/MarkOrderWithPaymentReceived`, {
      orderId: orderId,
      orderPaymentReceived: paymentStatus
    }).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }

  /**
   * 
   * @description Permite cambiar el medio de pago de una orden
   * @param orderId ID Orden
   * @param payMethodId ID Medio pago
   */
  public changePaymentMethod(orderId: number, payMethodId: number): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_ORDER}/ChangePayMethod`, {
      orderId: orderId,
      payMethodId: payMethodId
    }).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }
  /**
   * 
   * @description Permite enviar información de pago de un pedido al cliente
   * @param orderId ID Orden
   */
  public sendPaymentInformation(orderId: number): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_CHAT}/SendPaymentInformationToClient`, {}, {
      params: {
        orderId: orderId,
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }
  /**
   * 
   * @description Permite enviar resumen de un pedido al cliente
   * @param orderId ID Orden
   */
  public sendOrderSummary(orderId: number): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_CHAT}/SendOrderResumeToClient`, {}, {
      params: {
        orderId: orderId,
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }
  /**
   * 
   * @description Permite agregar un producto a un pedido
   * @param orderId ID Orden
   * @param productId ID Producto
   * @param productName Nombre
   * @param productImage Imagen
   * @param productPrice Precio
   * @param productQuantity Cantidad
   * @param productStatusId Estado
   */
  public addProduct(
    orderId: number,
    productId: string,
    productName: string,
    productImage: string,
    productPrice: number,
    productQuantity: number,
    productStatusId: number,
  ): Observable<any> {
    return this.http.post(`${URL_SERVICES.URL_ORDER}/AddOrderDetail`, {
      orderId: orderId,
      productId: productId,
      productName: productName,
      productImage: productImage,
      productPrice: productPrice,
      productQuantity: productQuantity,
      productStatusId: productStatusId,
    }).pipe(
      map((response: any) => {
        return response;
      }),
      pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      )
    );
  }
}
