/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/ui/message'],
    /**
 * @param{record} record
 */
    (message) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            if (scriptContext.type === 'edit') {
                try {
                    log.debug("Script Execution Begins");
                    var form = scriptContext.form;

                    form.addButton({
                        id: 'custpage_button',
                        label: 'Test',
                        functionName: 'clientButton()'
                    })
                    form.clientScriptFileId = 15;
                } catch (error) {
                    log.error("Error @BeforeLoad", error);
                }
           
                log.debug("Message Shown");
                let myMsg = message.create({
                    title: 'Edit Mode',
                    message: 'This is record editing page',
                    type: message.Type.ERROR,
                    duration:50000
                });
                form.addPageInitMessage(myMsg);

                log.debug("Message",myMsg);
                myMsg.show();
                log.debug("Message2",myMsg);
            }

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
