/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

define(['serverWidget'], function(serverWidget) {

    function pageInit(context) {
        // Create a form button
        var form = context.form;
        form.addButton({
            id: 'custom_button',
            label: 'Custom Button',
            functionName: 'onClickCustomButton'
        });

        // Define a client script function to be called when the button is clicked
        form.clientScriptModulePath = './customButtonClientScript.js';
    }

    return {
        pageInit: pageInit
    };
});
