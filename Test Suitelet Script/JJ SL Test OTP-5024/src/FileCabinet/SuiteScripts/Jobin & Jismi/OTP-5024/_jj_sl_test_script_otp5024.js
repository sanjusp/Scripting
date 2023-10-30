/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (serverWidget) => {
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
                        title: 'Registration Form',
                    });

                    form.addField({
                        id: '_custpage_name_name',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Name',
                    });

                    form.addField({
                        id: '_custpage_age',
                        type: serverWidget.FieldType.INTEGER,
                        label: 'Age',
                    });

                    form.addField({
                        id: '_custpage_phone',
                        type: serverWidget.FieldType.PHONE,
                        label: 'Phone Number',
                    });

                    form.addField({
                        id: '_custpage_email',
                        type: serverWidget.FieldType.EMAIL,
                        label: 'Email',
                    });

                    form.addField({
                        id: '_custpage_father_name',
                        type: serverWidget.FieldType.TEXT,
                        label: "Father's Name",
                    });

                    form.addField({
                        id: '_custpage_address',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Address',
                    });

                    form.addSubmitButton({
                        label: 'Submit',
                    });
                    scriptContext.response.writePage(form);
                }
                else{
                    log.debug('scriptContext', scriptContext);
                    log.debug('scriptContext', scriptContext.request.parameters.email);
                    scriptContext.response.write(`You have sucessfully click button: \n
                    Name is: ${scriptContext.request.parameters._custpage_name_name} \n
                    Email is: ${scriptContext.request.parameters._custpage_email} `);
                }
                log.debug('Form Created Successfully');
            } catch (e) {
                log.debug(e);
            }

        }

        return { onRequest }

    });
