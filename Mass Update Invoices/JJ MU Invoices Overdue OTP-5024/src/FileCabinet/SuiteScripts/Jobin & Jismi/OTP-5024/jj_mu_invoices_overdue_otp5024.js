/**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/search', 'N/runtime', 'N/format'],
    /**
 * @param{record} record
 */
    (record, search, runtime, format) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            /*if (params.type === record.Type.INVOICE) {
                const daysPastDue = 1;
                const currentDate = new Date('2023-04-11');
                log.debug('Date',currentDate)
                const dueDate = new Date(currentDate.getTime() - (daysPastDue * 24 * 60 * 60 * 1000));
                
                const invoiceSearch = search.create({
                    type: search.Type.INVOICE,
                    filters: [
                        ['mainline', 'is', 'T'],
                        'AND',
                        ['status', 'anyof', 'Invoice:Open'],
                        'AND',
                        ['duedate', 'before', dueDate]
                    ],
                    columns: ['internalid']
                });
                
                const resultSet = invoiceSearch.run();
                const results = resultSet.getRange({ start: 0, end: 1000 });

                results.forEach(result => {
                    const invoiceId = result.getValue({ name: 'internalid' });
                    const invoiceRecord = record.load({
                        type: record.Type.INVOICE,
                        id: invoiceId
                    });

                    invoiceRecord.setValue({
                        fieldId: 'duedate',
                        value: currentDate
                    });

                    invoiceRecord.save();
                });
            }*/

            let sales = record.load({
                type: params.type,
                id: params.id
            });
            const currentDate = new Date();
            let formattedDate = format.format({
                value: currentDate,
                type: format.Type.DATE
            });

            // formattedDate will contain the date in the "M/D/YYYY" format

            sales.setValue({
                fieldId: 'duedate',
                value: formattedDate
            });

            sales.save();
        };

        return { each };
    }
);
