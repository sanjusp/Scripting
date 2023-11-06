/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record'], (record) => {
    /**
     * Defines the Suitelet script trigger point for POST requests.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming POST request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (context) => {
        try {
            if (context.request.method === 'POST') {
                var postData = context.request.parameters;

                var patientRecord = record.create({
                    type: 'customrecord_jj_cr_patient_record_otp502',
                });
                log.debug('Record Loaded');

                patientRecord.setValue({
                    fieldId: 'custrecord1',
                    value: postData.name,
                });
                log.debug('Name Updated');

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
