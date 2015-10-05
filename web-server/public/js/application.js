$(document).foundation();

$(function() {
  var x = $('[data-toggle]').on('click', function(event) {
    var target = $(event.target).closest('[data-toggle]');
    var y = $(target.data('toggle')).toggle();
    console.log(y);
  });
  console.log(x);
});
