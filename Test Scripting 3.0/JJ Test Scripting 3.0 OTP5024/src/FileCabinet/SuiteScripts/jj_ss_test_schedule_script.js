/**
* @NApiVersion 2.1
* @NScriptType ScheduledScript
*/

/****************************************************************************
************************************************
** Project Name | Task description**
* 
*****************************************************************************
*********************************************
* Author: Jobin & Jismi IT Services LLP
*
* Date Created : 25-August-2022
*
* Created By: Manikandan T.m, Jobin & Jismi IT Services LLP
*
* Description : 
* 
* REVISION HISTORY

*****************************************************************************
*******************************************************/
define(['N/search', 'N/record', 'N/runtime', 'N/task', 'N/email'], (search, record, runtime, task, email) => {
    /**
    * Defines the Scheduled script trigger point.
    * @param {Object} scriptContext
    * @param {string} scriptContext.type - Script execution context.
    * @since 2015.2
    */
    const execute = (scriptContext) => {
        try {
            var mySearch = search.load({
                id: 'customsearch_jj_test'
            });

            log.debug('mySearch', mySearch);

            // Create a search to find specific invoices
            const invoiceSearch = search.create({
                type: search.Type.INVOICE,
                filters: [
                    ['mainline', 'is', 'T'],
                    'AND',
                    ['cogs', 'is', 'F'],
                    'AND',
                    ['taxline', 'is', 'F'],
                    'AND',
                    ['shipping', 'is', 'F'],
                    'AND',
                    ['type', 'anyof', 'CustInvc'],
                    'AND',
                    ['custbody_jj_test_invoice', 'isempty', '']

                ],
                columns: ['internalid', 'type', 'tranid', 'trandate']
            });

            let pagedData = invoiceSearch.runPaged();
            // Log the search count
            log.debug('Search Count', pagedData.count);
            let invoiceObj = {};

            pagedData.pageRanges.forEach((range) => {
                let currentPage = pagedData.fetch({ index: range.index });
                currentPage.data.forEach((result) => {
                    // Access fields of each result
                    invoiceObj[result.getValue('internalid')] = {
                        "type": result.getValue('type'),
                        "tranId": result.getValue('tranid'),
                        "tranDate": result.getValue('trandate')
                    }
                });
            });

            log.debug('invoiceObj', invoiceObj);

            for (let key in invoiceObj) {
                record.submitFields({
                    type: record.Type.INVOICE,
                    id: key,
                    values: { custbody_jj_test_invoice: 'test' }
                });

                let usage = runtime.getCurrentScript().getRemainingUsage();
                log.debug('usage', usage)
                if (usage < 9980) {
                    log.debug('enter condition')
                    var mrTask = task.create({
                        taskType: task.TaskType.SCHEDULED_SCRIPT,
                        scriptId: 'customscriptjj_ss_test_schedule_otp5024',
                        deploymentId: 'customdeployjj_ss_test_schedule1_otp5024',
                        params: {
                        }
                    });
                    let mrTaskId = mrTask.submit();
                    log.debug('mrTaskId', mrTaskId)
                    break;
                }

            }
        } catch (error) {
            log.error('Error @ execute', error);
        }
    }
    return { execute };
});