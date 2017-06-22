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
