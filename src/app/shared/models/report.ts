import { Injectable } from "@angular/core";
import { Adapter } from "../adapters/adapter";
import { OrderByAssignment } from "../interfaces/order-by-assignment";
import { OrderByState } from "../interfaces/order-by-state";
import { OrderByTime } from "../interfaces/order-by-time";
import { OrderDetailReport } from "../interfaces/order-detail-report";

export class Report {

    activeOrders: number;

    totalPurchase: number;

    totalShippingCost: number;

    ordersByState: Array<OrderByState>;

    orderDetailReport: Array<OrderDetailReport>;

    ordersByAssignment: Array<OrderByAssignment>;

    green: string;

    greenQuantity: number;

    yellow: string;

    yellowQuantity: number;

    red: string;

    redQuantity: number;

    constructor(
        activeOrders: number,
        totalPurchase: number,
        totalShippingCost: number,
        ordersByState: Array<OrderByState>,
        orderDetailReport: Array<OrderDetailReport>,
        ordersByAssignment: Array<OrderByAssignment>,
        green: string,
        greenQuantity: number,
        yellow: string,
        yellowQuantity: number,
        red: string,
        redQuantity: number,
    ) {
        this.activeOrders = activeOrders;
        this.totalPurchase = totalPurchase;
        this.totalShippingCost = totalShippingCost;
        this.ordersByState = ordersByState;
        this.orderDetailReport = orderDetailReport;
        this.ordersByAssignment = ordersByAssignment;
        this.green = green;
        this.greenQuantity = greenQuantity;
        this.yellow = yellow;
        this.yellowQuantity = yellowQuantity;
        this.red = red;
        this.redQuantity = redQuantity;
    }
}

@Injectable({
    providedIn: "root",
})
export class ReportAdapter implements Adapter<Report> {
    adapt(reportData: any): Report {

        let activeOrders: number = 0;
        let totalPurchase: number = 0;
        let totalShippingCost: number = 0;
        let ordersByState: Array<OrderByState> = [];
        let orderDetailReport: Array<OrderDetailReport> = [];
        let ordersByAssignment: Array<OrderByAssignment> = [];
        let ordersByTime: OrderByTime = {
            green: "Green",
            greenQuantity: 0,
            yellow: "Yellow",
            yellowQuantity: 0,
            red: "Red",
            redQuantity: 0
        };

        if (reportData) {
            let activeOrdersData: Array<any> = reportData["1"];
            activeOrdersData.forEach(element => {
                activeOrders = element.quantity;
            });

            let ordersByStateData: Array<any> = reportData["2"];
            let orderPurchaseData: Array<any> = reportData["7"];
            ordersByStateData.forEach(element => {
                let orderByState: OrderByState = {
                    statusId: element.orderStatusId,
                    statusName: element.statusName,
                    quantity: element.quantity,
                    average: element.average,
                };

                let orderPurchase = orderPurchaseData.find(elementPurchase => elementPurchase.orderStatusId == element.orderStatusId)

                if (orderPurchase) {
                    orderByState.totalPurchase = orderPurchase.totalPurchase;
                    orderByState.shippingCost = orderPurchase.shippingCost;
                }
                ordersByState.push(orderByState);
            });

            ordersByState.sort((x, y) => x.statusId - y.statusId);

            let orderPurchase = orderPurchaseData.find(elementPurchase => elementPurchase.orderStatusId == 0)
            if (orderPurchase) {
                totalPurchase = orderPurchase.totalPurchase ? orderPurchase.totalPurchase : 0;
                totalShippingCost = orderPurchase.shippingCost ? orderPurchase.shippingCost : 0;
            }

            let orderDetailData: Array<any> = reportData["3"];
            let orderTimeData: Array<any> = reportData["6"];
            orderDetailData.forEach(element => {

                let orderDetail: OrderDetailReport = {
                    id: element.id,
                    orderNumber: element.orderNumber,
                    createdAt: element.createdAt,
                    names: element.names,
                    userName: element.userName ? element.userName : 'No asignado',
                    paymentName: element.paymentName,
                    statusId: element.orderStatusId,
                    statusName: element.statusName,
                    totalPurchase: element.totalPurchase,
                    shippingCost: element.shippingCost
                };

                let orderTime = orderTimeData.find(elementTime => elementTime.orderNumber == element.orderNumber)

                if (orderTime) {
                    orderDetail.currentDate = orderTime.currentDate;
                    orderDetail.minutesDiff = orderTime.minutesDiff;
                    orderDetail.color = orderTime.color;
                }

                orderDetailReport.push(orderDetail);
            });

            let ordersByAssignmentData: Array<any> = reportData["4"];

            ordersByAssignmentData.forEach(element => {
                let orderByAssignment: OrderByAssignment = {
                    userName: element.userName ? element.userName : 'No asignado',
                    quantity: element.quantity,
                    average: element.average,
                };
                ordersByAssignment.push(orderByAssignment);
            });

            let orderByTimeData: Array<any> = reportData["5"];

            orderByTimeData.forEach(element => {
                switch (element.color) {
                    case "Green":
                        ordersByTime.green = element.color ? element.color : ordersByTime.green;
                        ordersByTime.greenQuantity = element.quantity;
                        break;
                    case "Yellow":
                        ordersByTime.yellow = element.color ? element.color : ordersByTime.yellow;
                        ordersByTime.yellowQuantity = element.quantity;
                        break;
                    case "Red":
                        ordersByTime.red = element.color ? element.color : ordersByTime.red;
                        ordersByTime.redQuantity = element.quantity;
                        break;
                    default:
                        break;
                }
            });
        }

        return new Report(
            activeOrders,
            totalPurchase,
            totalShippingCost,
            ordersByState,
            orderDetailReport,
            ordersByAssignment,
            ordersByTime.green,
            ordersByTime.greenQuantity,
            ordersByTime.yellow,
            ordersByTime.yellowQuantity,
            ordersByTime.red,
            ordersByTime.redQuantity
        )
    }
}