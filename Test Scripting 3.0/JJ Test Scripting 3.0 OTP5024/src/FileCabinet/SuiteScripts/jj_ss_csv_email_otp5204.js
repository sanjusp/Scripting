/**
* @NApiVersion 2.1
* @NScriptType ScheduledScript
*/

/****************************************************************************
**************************************************
** OTP-5024 | Sent Customer deatails as CSV to Administrator**
* 
*****************************************************************************
**************************************************
* Author: Jobin & Jismi IT Services LLP
*
* Date Created : 25-August-2022
*
* Created By: Sanju S, Jobin & Jismi IT Services LLP
*
* Description : Sent mail to administrator with attachment of a CSV and an 
*               EXCEL file conatining the deatails of customers that created 
*               in the current month. 
* 
* REVISION HISTORY

*****************************************************************************
*******************************************************/

define(['N/search', 'N/email', 'N/file', 'N/runtime', 'N/encode'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{runtime} runtime
 * @param{search} search
 * @param{encode} encode
 */
    (search, email, file, runtime, encode) => {
        const execute = (scriptContext) => {
            try {
                var customerSearch = search.create({
                    type: search.Type.CUSTOMER,
                    filters: [
                        search.createFilter({
                            name: 'datecreated',
                            operator: search.Operator.WITHIN,
                            values: ['thismonth']
                        })
                    ],
                    columns: ['internalid', 'entityid', 'email']
                });
                log.debug('Search Created', customerSearch);
            } catch (e) {
                log.error(e);
            }

            var customerData = [];

            customerSearch.run().each(function (result) {
                var customerId = result.getValue({ name: 'internalid' });
                var customerName = result.getValue({ name: 'entityid' });
                var customerEmail = result.getValue({ name: 'email' });
                customerData.push([customerId, customerName, customerEmail]);
                return true;
            });

            var csvContent = customerData.map(row => row.join(',')).join('\n');
            try {
                var csvFile = file.create({
                    name: 'New Customer Details.csv',
                    fileType: file.Type.CSV,
                    contents: csvContent
                });
                log.debug('CSV File Created', csvFile);
            } catch (e) {
                log.error('CSV Error', e);
            }
            try {
                var base64EncodedCSV = encode.convert({
                    string: csvContent,
                    inputEncoding: encode.Encoding.UTF_8,
                    outputEncoding: encode.Encoding.BASE_64
                });

                var excelFile = file.create({
                    name: 'New Customer Details.xlsx',
                    fileType: file.Type.EXCEL,
                    contents: base64EncodedCSV
                });
                log.debug('EXCEL File Created', excelFile);
            } catch (e) {
                log.error('EXCEL Error', e);
            }

            try {
                email.send({
                    author: -5,
                    recipients: 'adminfun080723SB@netsuite.com',
                    subject: 'Monthly Customer Report',
                    body: 'Attachments are the list of customers created this month.',
                    attachments: [csvFile, excelFile],
                });
                log.debug('Email Sent');
            } catch (e) {
                log.error('Email Error', e);
            }
        };

        return { execute };
    });