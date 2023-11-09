/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/********************************************************************************
************************************************
**${OTP-5619} : ${Restrict IF Save}
* 
*********************************************************************************
*********************************************
* Author: Jobin & Jismi IT Services LLP
*
* Date Created : 9-November-2023
*
* Created By: Sanju S, Jobin & Jismi IT Services LLP
*
* Description : This script is written to restrict item fulfillment in NetSuite.
*               If the customer deposit amount is greater than or equal to sales 
*               order amount then only the item fulfillment will be saved or else 
*               there will be an alert box and also cannot be saved. 
**********************************************************************************
*******************************************************/
define(['N/record', 'N/search'],

    function (record, search) {

        function saveRecord(scriptContext) {
            try {
                var recIf = scriptContext.currentRecord;
                var order = recIf.getValue({
                    fieldId: 'createdfrom'
                });
                //log.debug('Sales Order', order);
                var orderRec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: order,
                    isDynamic: true
                });
                var docNo = orderRec.getValue({
                    fieldId: 'tranid'
                });
                log.debug('Document number', docNo);
                var tot = orderRec.getValue({
                    fieldId: 'total'
                });
                //log.debug('Sales Order Total', tot);
                var mySearch = search.create({
                    type: search.Type.CUSTOMER_DEPOSIT,
                    filters: [['salesorder', 'anyof', order], 'AND', ["mainline", "is", "T"]],
                    columns: ['amount']
                });

                var mySearch1 = mySearch.run().getRange({
                    start: 0,
                    end: 100
                });

                for (var i = 0; i < mySearch1.length; i++) {
                    var amt = mySearch1[i].getValue({
                        name: 'amount'
                    });
                    //log.debug('Deposit Amount', amt);

                    if (amt >= tot) {
                        return true;
                    } else {
                        alert("Item Fulfillment is restricted because of insufficient customer deposit.");
                        return false;
                    }
                }

            } catch (e) {
                log.error(e);
            }
        }

        return {
            saveRecord: saveRecord
        };
    });
