/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/error'], function (error) {
    function pageInit(context) {
        console.log("pageInit***********");
        if (context.mode == 'create')
            return;
        var currentRecord = context.currentRecord;
        currentRecord.setValue({
            fieldId: 'otherrefnum',
            value: "diya"
        });
    };

    function saveRecord(context) {
        console.log("saveRecord*********");

        var currentRecord = context.currentRecord;
        if (!context.currentRecord.getValue({ fieldId: "otherrefnum" })) {
            return false;
        }

        return true;
    };

    function validateField(context) {
        console.log("validateField******");
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var sublistFieldName = context.fieldId;
        var line = context.line;

        if (sublistName === 'item' && sublistFieldName === 'quantity') {

            let quantity = currentRecord.getCurrentSublistValue({
                sublistId: sublistName,
                fieldId: sublistFieldName
            })

            if (quantity < 3) {
                alert("please enter the quantity greater than 3")
                return false;
            }
        }
        return true;
    };

    function fieldChanged(context) {

        console.log("fieldChanged*******");
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var sublistFieldName = context.fieldId;
        var line = context.line;
        if (sublistName === 'item' && sublistFieldName === 'item') {
            currentRecord.setValue({
                fieldId: 'quantity',
                value: 3
            });
        }

    };

    function postSourcing(context) {
        console.log("postSourcing**********");
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var sublistFieldName = context.fieldId;
        var line = context.line;
        if (sublistFieldName === 'subsidiary') {
            alert("You are changing the loaction")
        }
    };

    function lineInit(context) {
        console.log("lineInit*******");
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        if (sublistName === 'item') {
            alert("Line Init")
        }

    };

    function validateDelete(context) {
        console.log("validateDelete*******");
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        if (sublistName === 'item') {
            var itemName = currentRecord.getCurrentSublistValue({
                sublistId: sublistName,
                fieldId: 'item'
            });

            if (itemName == 60) {
                return false;
            }
        }
        return true;
    };

    function validateInsert(context) {
        var sublistFieldName = context.fieldId;
        
        if (sublistFieldName == "class"){
            console.log("validateInsert***********");
            alert('validateInsert***********')
        }
        return true;
    };

    function validateLine(context) {
        console.log("validateLine*****");
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        if (sublistName === 'item') {
            let quantity = currentRecord.getCurrentSublistValue({
                sublistId: sublistName,
                fieldId: "quantity"
            })

            if (quantity < 3) {
                return false;
            }
        }

        return true;
    };

    function sublistChanged(context) {
        console.log("sublistChanged**********");
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var op = context.operation;
        if (sublistName === 'item')
            currentRecord.setValue({
                fieldId: 'memo',
                value: "Diya" + currentRecord.getCurrentSublistValue({
                    sublistId: "item",
                    fieldId: "item"
                })
            });
    };

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        sublistChanged: sublistChanged,
        lineInit: lineInit,
        validateField: validateField,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete,
        saveRecord: saveRecord
    };
});