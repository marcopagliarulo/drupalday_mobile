var args = arguments[0] || {};
var current_schedule = "list";
var controller = Alloy.createController('schedule_list');
var view = controller.getView();
$.schedule_container.add(view);
controller = null;
var controller = Alloy.createController('schedule_group');
var view = controller.getView();
view.visible = false;
$.schedule_container.add(view);
controller = null;
var current = 0;
var schedule_switch = function(e){
	$.schedule_switch.text = (current_schedule == 'list') ? 'Visualizza tutti' : 'Visualizza sale';
	$.schedule_container.children[current].visible = false;
	current = (current_schedule == 'list') ? 1 : 0;
	current_schedule = (current_schedule == 'list') ? 'group' : 'list';
	$.schedule_container.children[current].visible = true;
};
