/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
/****************************************************************************
************************************************
**${OTP-5548} : ${Monthly Over Due Reminder for Customer}
* 
*****************************************************************************
*********************************************
* Author: Jobin & Jismi IT Services LLP
*
* Date Created : 6-November-2023
*
* Created By: Sanju S, Jobin & Jismi IT Services LLP
*
* Description : 
*Send an email notification to all Customers once a month if they have overdue Invoices.
*We need to send the Overdue Invoice information till the previous month to the corresponding Customer.
*The email notification should contain all of the customers overdue invoices.
*This email notification should contain the Customer Name and Customer Email, Invoice document Number, Invoice Amount, Days Overdue which is attached as a CSV File to the email.
*The sender of the email should be Sales Rep. If there is no Sales rep for the customer, sender will be a static NetSuite Admin
* 
*****************************************************************************
*******************************************************/
define(['N/email', 'N/file', 'N/search'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{search} search
 */
    (email, file, search) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {

            try {
                //log.debug('Entered in the Script');

                let salesSearch = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: [['mainline', 'is', 'T'],
                        'and',
                    ['trandate', 'within', 'thismonth']],
                    columns: ['tranid', 'salesrep']
                });

                log.debug('Search Created');
                return salesSearch;

            } catch (e) {
                log.error(e);
            }

        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try {
                const searchResult = JSON.parse(mapContext.value);
                //log.debug('Map Input', searchResult);
                let saleRep = searchResult.values.salesrep;
                //log.debug('Sales Rep Details', saleRep);
                let saleRepId = saleRep.value;
                //log.debug('Sales Rep ID', saleRepId);
                let results = [];
                let saleObj = search.lookupFields({
                    type: search.Type.SALES_ORDER,
                    id: searchResult.id,
                    columns: ['entity', 'email', 'tranid', 'total']
                });
                //log.debug('Lookup', saleObj);

                results.push(saleObj.entity[0].text);
                results.push(saleObj.email);
                results.push(saleObj.tranid);
                results.push(saleObj.total);
                //log.debug('Results', results);
                if (saleRepId) {
                    mapContext.write({
                        key: saleRepId,
                        value: results
                    });
                }
                else {
                    mapContext.write({
                        key: -5,
                        value: results
                    });
                }

            } catch (e) {
                log.error(e);
            }
        }


        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {

            let reduceKey = reduceContext.key;
            log.debug('Reduce Key', reduceKey);
            let reduceValue = reduceContext.values;
            log.debug('Reduce Value', reduceValue);
            let len = reduceValue.length;
            log.debug('Length', len);

            let csvContent = "customer name, email, document number, amount\n";
            for (let i = 0; i < len; i++) {
                var c1 = JSON.parse(reduceValue[i]);
                for (let j = 0; j < c1.length; j++) {
                    csvContent += c1[j];
                    if (j < c1.length - 1) {
                        csvContent += ', ';
                    }
                }
                csvContent += "\n";
            }
            let fileObj = file.create({
                name: "Customer Detail.csv",
                fileType: file.Type.CSV,
                contents: csvContent,
                folder: -14
            });
            let fileId = fileObj.save();
            log.debug("file has been created with id ", fileId);
            let adminkey = -5
            if (reduceKey == -5) {
                email.send({
                    author: -5,
                    recipients: adminkey,
                    subject: "sales order details for the previous month",
                    body: "Sir/Madam\nPlease find the attached sales order details of the customers and assign a salesrep for the customers\nThank you. ",
                    attachments: [fileObj]
                });
            }
            else {
                email.send({
                    author: -5,
                    recipients: reduceKey,
                    subject: "sales order details for the previous month",
                    body: "Sir/Madam\nPlease find the attached sales order details of the customers\nThank you. ",
                    attachments: [fileObj]
                });
            }

        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {

        }

        return { getInputData, map, reduce }

    });
