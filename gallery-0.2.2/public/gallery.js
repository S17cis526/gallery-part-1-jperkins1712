// Javascript for the gallery page

var title = document.getElemyByID('gallery-title');
title.onclick = function(e) {
  e.preventDefault();
  var form = document.getElementByID('gallery-title-edit');
  form.style.display = 'block';
}
