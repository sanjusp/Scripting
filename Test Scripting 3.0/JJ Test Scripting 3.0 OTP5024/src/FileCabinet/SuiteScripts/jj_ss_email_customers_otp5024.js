/**
* @NApiVersion 2.1
* @NScriptType ScheduledScript
*/

/****************************************************************************
**************************************************
** OTP-5024 | Sent email to particular customers**
* 
*****************************************************************************
**************************************************
* Author: Jobin & Jismi IT Services LLP
*
* Date Created : 25-August-2022
*
* Created By: Sanju S, Jobin & Jismi IT Services LLP
*
* Description : Sent email to the customers in the subsidiary 'Nike'. 
*               Customers name begins with the value entered in the field 
*               'XYZ'
* 
* REVISION HISTORY

*****************************************************************************
*******************************************************/

define(['N/search', 'N/email'], (search, email) => {
    /**
    * Defines the Scheduled script trigger point.
    * @param {Object} scriptContext
    * @param {string} scriptContext.type - Script execution context.
    * @since 2015.2
    */
    const execute = (scriptContext) => {
        try {
            var customRecordId = 'customrecord_jj_cr_cr';
            var internalId = '4';
            var subject = 'Test Mail';
            var message = 'Hi';

            var customRecordLookup = search.lookupFields({
                type: customRecordId,
                id: internalId,
                columns: ['custrecord_jj_cf_xyz']
            });
            log.debug('Lookup Done', customRecordLookup);

            var xyzValue = customRecordLookup.custrecord_jj_cf_xyz;

            var customerSearch = search.create({
                type: search.Type.CUSTOMER,
                title: 'Custom Customer Search',
                filters: [
                    search.createFilter({
                        name: 'subsidiary',
                        operator: search.Operator.IS,
                        values: 8
                    }),
                    search.createFilter({
                        name: 'companyname',
                        operator: search.Operator.STARTSWITH,
                        values: xyzValue
                    })
                ],
                columns: ['email']
            });
            log.debug('Search Done', customerSearch);

            customerSearch.run().each(function (customerResult) {
                var recipientEmail = customerResult.getValue({ name: 'email' });
                try {
                    email.send({
                        author: -5,
                        recipients: recipientEmail,
                        subject: subject,
                        body: message
                    });
                } catch (e) {
                    log.error('Email Sending Error', e);
                }
                return true;
            });
            log.debug('Mail Sent');
        } catch (error) {
            log.error('Error @ execute', error);
        }
    }
    return { execute };
});