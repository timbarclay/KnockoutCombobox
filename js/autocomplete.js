/**
 * @param comboValue The selected value
 * @param comboOptions The list of options
 * @param comboOptionsValue (optional) If the options are objects, use a particular 
 * property as the value
 * @param comboOptionsText (optional) If the options are objects, which property to
 * display in the ui. By default comboOptionsValue is used
 */
ko.bindingHandlers["combobox"] = {
  init: function (element, valueAccessor, allBindingsAccessor){
    var options = valueAccessor() || {};
    var allBindings = allBindingsAccessor();
    var selected = allBindings.comboValue;
    var comboOptions = allBindings.comboOptions;
    var optionsValue = allBindings.comboOptionsValue;
    var optionsText = allBindings.comboOptionsText || optionsValue;
    
    // MinLength needs to be set to 0 so we can use the button to search with no term
    options = $.extend(options, {minLength: 0});
    
    // Write value whether or not it's observable
    function writeValueToModel(valueToWrite){
      if(ko.isWriteableObservable(selected)){
        selected(valueToWrite);
      } else if(allBindings["_ko_property_writers"] && 
      allBindings["_ko_property_writers"]["comboValue"]) {
        // Write to a non-observable
        allBindings["_ko_property_writers"]["comboValue"](valueToWrite);
      }
    }
    
    // On a selection write the proper value to the model
    options.select = function(event, ui){
      writeValueToModel(ui.item ? ui.item.actualValue : null);
    }
    
    // On a change, make sure that it is a valid value or clear out the model value
    options.change = function() {
      var matchingItem = ko.utils.arrayFirst(ko.unwrap(comboOptions), function(item){
        return ko.unwrap(item[optionsText]) === $(element).val();
      });
      
      if(!matchingItem){
        writeValueToModel(null);
      }
    }
    
    // Handle the choices being updated in a computed
    var mappedSource = ko.pureComputed(function() {
      var mapped = ko.utils.arrayMap(ko.unwrap(comboOptions), function(item){
        var label = optionsText ? ko.unwrap(item[optionsText]) : ko.unwrap(item).toString();
        return {
          label: label,
          value: label,
          actualValue: optionsValue ? ko.unwrap(item[optionsValue]) : item
        };
      });
      return mapped;
    });
    
    // Update the autocomplete if the source changes
    mappedSource.subscribe(function(newValue){
      $(element).autocomplete("option", "source", newValue);
    });
    
    options.source = mappedSource();
    
    // Initialise the autocomplete component
    $(element).autocomplete(options);
  },
  
  update: function(element, valueAccessor, allBindingAccessor) {
    var allBindings = allBindingAccessor();
    var selected = ko.unwrap(allBindings.comboValue) || '';
    var optionsValue = allBindings.comboOptionsValue;
    var optionsText = allBindings.comboOptionsText || optionsValue;
    
    // If we have an options value, locate the actual model
    if(optionsValue) {
      var source = ko.unwrap(allBindings.comboOptions) || [];
      selected = ko.utils.arrayFirst(source, function(item) {
        return ko.unwrap(item[optionsValue]) === selected[optionsValue];
      });
    }
    
    // Show the value in the input
    $(element).val(selected ? ko.unwrap(selected[optionsText]) : selected);
  }
};

ko.bindingHandlers["combodropdown"] = {
  init: function(element, valueAccessor) {
    var autoEl = $("#" + valueAccessor());
    
    $(element).click(function(e) {
      e.preventDefault();
      autoEl.autocomplete("search", "");
      autoEl.focus();
    });
  }
}