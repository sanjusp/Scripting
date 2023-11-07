/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/email', 'N/record', 'N/search', 'N/ui/serverWidget', 'N/url'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 * @param{url} url
 */
    (email, record, search, serverWidget, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try {
                if (scriptContext.request.method === 'GET') {
                    var form = serverWidget.createForm({
                        title: 'Custom Record Entry'
                    });

                    form.addField({
                        id: 'cusname',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Customer Name',
                        isMandatory: true
                    });
                    

                    form.addField({
                        id: 'cusmail',
                        type: serverWidget.FieldType.EMAIL,
                        label: 'Customer Email',
                        isMandatory: true
                    });
                    

                    form.addField({
                        id: 'subject',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Subject',
                        isMandatory: true
                    });
                    

                    form.addField({
                        id: 'message',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Message',
                        isMandatory: true
                    });
                    

                    form.addSubmitButton({
                        label: 'Submit'
                    });

                    log.debug('Form Created');

                    scriptContext.response.writePage(form);

                } else {
                    let cusNameField = scriptContext.request.parameters.cusname;
                    //log.debug('Name',cusNameField);
                    let cusEmailField = scriptContext.request.parameters.cusmail;
                    //log.debug('Email',cusEmailField);
                    let subjectField = scriptContext.request.parameters.subject;
                    //log.debug('Subject',subjectField);
                    let messageField = scriptContext.request.parameters.message;
                    //log.debug('Message',messageField);
                    let customerSearch = search.create({
                        type: search.Type.CUSTOMER,
                        id: 'customsearch_jj_customer',
                        title: "Customer Search",
                        columns: ['email', 'salesrep', 'internalId']
                    });
                    let flag = 0;
                    let custId;
                    customerSearch.run().each(function (result) {
                        let customerEmail = result.getValue({
                            name: 'email'
                        });
                        //log.debug('Customer Email',customerEmail);
                        if (customerEmail == cusEmailField) {
                            flag = 1;
                            custId = result.id
                        }
                        //log.debug('Flag',flag);
                        return true;
                    });
                    email.send({
                        author: 962,
                        recipients: -5,
                        subject: "New Customer Alert",
                        body: "A new customer has registered"
                    });
                    if (flag == 1) {
                        let cusRec = record.load({
                            type: record.Type.CUSTOMER,
                            id: custId,
                            isDynamic: true
                        });
                        log.debug('Sales Rep Detail',cusRec);
                        let salesRepId = cusRec.getValue({
                            fieldId: 'salesrep'
                        });
                        log.debug('Sales Rep ID',salesRepId);
                        if (salesRepId) {
                            email.send({
                                author: 962,
                                recipients: salesRepId,
                                subject: "New Customer Alert",
                                body: "A new customer has registered"
                            });
                        }
                    }
                    scriptContext.response.write('</br><b><h2>The Customer Details:</h2>'
                        + '</br></br> Customer Name : ' + cusNameField
                        + '</br></br> Customer Email : ' + cusEmailField
                        + '</br></br> Subject : ' + subjectField
                        + '</br></br> Message : ' + messageField
                    );
                    let cusRecord = record.create({
                        type: 'customrecord_jj_cr_custom_record',
                        isDynamic: true
                    });
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_cf_customer_name',
                        value: cusNameField
                    });
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_cf_customer_email',
                        value: cusEmailField
                    });
                    if (flag == 1) {
                        let link = 'https://';
                        let hostUrl = url.resolveDomain({
                            hostType: url.HostType.APPLICATION
                        });
                        let urlPath = url.resolveRecord({
                            recordType: record.Type.CUSTOMER,
                            recordId: custId,
                            isEditMode: false
                        });
                        let cusUrl = link + hostUrl + urlPath;
                        cusRecord.setValue({
                            fieldId: 'custrecord_jj_cf_customer_reference',
                            value: cusUrl
                        });
                    }
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_cf_subject',
                        value: subjectField
                    });
                    cusRecord.setValue({
                        fieldId: 'custrecord_jj_cf_message',
                        value: messageField
                    });
                    var cusId = cusRecord.save({
                        ignoreMandatoryFields: true,
                        enableSourcing: true
                    });
                    scriptContext.response.write('</br></br> Record has been created with id ' + cusId)
                }
            }
            catch (err) {
                log.error("Error reported", err);
            }
        }
        return { onRequest }
    });