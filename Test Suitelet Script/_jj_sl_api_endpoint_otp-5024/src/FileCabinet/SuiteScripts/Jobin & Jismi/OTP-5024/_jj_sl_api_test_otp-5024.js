/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget'], (record, serverWidget) => {
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (context) => {
        try {
            if (context.request.method === 'GET') {
                var form = serverWidget.createForm({
                    title: 'Patient Registration Form',
                });

                var nameField = form.addField({
                    id: 'name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name',
                });
                nameField.isMandatory = true;

                var ageField = form.addField({
                    id: 'age',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Age',
                });
                ageField.isMandatory = true;

                var sexField = form.addField({
                    id: 'sex',
                    type: serverWidget.FieldType.SELECT,
                    source: 'customlist_jj_cl_sex',
                    label: 'Sex',
                });
                sexField.isMandatory = true;

                var addressField = form.addField({
                    id: 'address',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Address',
                });
                addressField.isMandatory = true;

                form.addSubmitButton({
                    label: 'Submit',
                });

                context.response.writePage(form);
            } else if (context.request.method === 'POST') {
                var postData = context.request.parameters;

                var patientRecord = record.create({
                    type: 'customrecord_jj_cr_patient_record_otp502',
                });


                patientRecord.setValue({
                    fieldId: 'custrecord1',
                    value: postData.name,
                });

                patientRecord.setValue({
                    fieldId: 'custrecord2',
                    value: postData.age,
                });

                patientRecord.setValue({
                    fieldId: 'custrecord3',
                    value: postData.sex,
                });

                patientRecord.setValue({
                    fieldId: 'custrecord4',
                    value: postData.address,
                });

                var patientId = patientRecord.save();

                context.response.write('Internal ID of the created patient record: ' + patientId);
            }
        } catch (e) {
            log.debug(e);
        }
    }

    return { onRequest };
});
