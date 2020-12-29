var group = document.getElementsByClassName("btn-group-vertical")[0];

btns = group.children;
for (var j = 0; j < btns.length; j++) {
	btns[j].addEventListener("click", function() {
		var current = group.getElementsByClassName("active");
		current[0].className = current[0].className.replace(" active", "");
		this.className += " active";
	});
}
