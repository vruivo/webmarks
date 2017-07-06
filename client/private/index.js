function addNewFav(data) {
  // -- classic --
  // var favicon_el = document.querySelector("#icon");
  // var title_el = document.querySelector("#title");
  // var base_url_el = document.querySelector("#base_url");
  // title_el.innerHTML = "asd"
  // favicon_el.appendChild(document.createTextNode("sssasd"))
  // document.querySelector("#base_url").appendChild(document.createTextNode("sss11asd"))

  // -- fragment --
  // var fragment = document.createDocumentFragment();
  // fragment.appendChild(document.createElement('div').appendChild(document.createTextNode("sssasd")))
  // document.querySelector("#item-row").appendChild(fragment)

  // -- template --
  // NOTES: importNode IE9, template Edge
  var new_item = document.importNode(document.querySelector("#item-template").content, true);
  new_item.querySelector("#title").appendChild(document.createTextNode(data.title));
  new_item.querySelector("#base_url").appendChild(document.createTextNode(data.base_url));
  new_item.querySelector("#icon").setAttribute('src', 'icon/'+data.icon);
  document.querySelector("#item-insert").appendChild(new_item);
}

function showAlert(type, msg) {
  $.bootstrapGrowl(msg, {
    ele: 'body', // which element to append to
    type: type, // (null, 'info', 'danger', 'success')
    offset: {from: 'top', amount: 20}, // 'top', or 'bottom'
    align: 'center', // ('left', 'right', or 'center')
    width: 600, // (integer, or 'auto')
    delay: 4000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
    allow_dismiss: true, // If true then will display a cross to close the popup.
    stackup_spacing: 10 // spacing between consecutively stacked growls.
  });
}
