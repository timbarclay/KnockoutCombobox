/**
 * View model for the combo box
 */
function Index() {
  this.selected = ko.observable(null);
  this.options = ko.observableArray([
    {id: 1, name: "one"},
    {id: 2, name: "two"},
    {id: 3, name: "three"}
  ]);
  this.optionsText = "name";
  this.id = "index-options";
  this.settings = {delay: 0};
}

$(document).ready(function(){
  var vm = new Index();
  ko.applyBindings(vm);
});