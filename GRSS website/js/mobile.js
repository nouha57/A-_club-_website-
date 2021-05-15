window.onload = function () {
	var getNavi = document.getElementById('navigation');

	var mobile = document.createElement("span");
	mobile.setAttribute("id", "mobile-navigation");
	getNavi.parentNode.insertBefore(mobile, getNavi);

	document.getElementById('mobile-navigation').onclick = function () {
		var a = getNavi.getAttribute('style');
		if (a) {
			getNavi.removeAttribute('style');
			document.getElementById('mobile-navigation').style.backgroundImage = 'url(images/mobile/mobile-menu.png)';
		} else {
			getNavi.style.display = 'block';
			document.getElementById('mobile-navigation').style.backgroundImage = 'url(images/mobile/mobile-close.png)';
		}
	};
	var getElm = getNavi.getElementsByTagName("LI");
	for (var i = 0; i < getElm.length; i++) {
		if (getElm[i].children.length > 1) {
			var smenu = document.createElement("span");
			smenu.setAttribute("class", "mobile-submenu");
			smenu.setAttribute("OnClick", "submenu(" + i + ")");
			getElm[i].appendChild(smenu);
		};
	};

	// TODO: Review broken code for fixes
	// submenu = function (i){
	// 	var sub = getElm[i].children[1];
	// 	var b = sub.getAttribute('style');
	// 	if(b){
	// 		sub.removeAttribute('style');
	// 		getElm[i].lastChild.style.backgroundImage='url(images/mobile/mobile-expand.png)';
	// 		getElm[i].lastChild.style.backgroundColor='rgba(98, 0, 49, 0.91)';
	// 	} else {
	// 		sub.style.display='block';
	// 		getElm[i].lastChild.style.backgroundImage='url(images/mobile/mobile-collapse.png)';
	// 		getElm[i].lastChild.style.backgroundColor='rgba(0, 0, 0, 0.91)';
	// 	}
	// };

	// contact form logic, validates that the form inputs are typed fully and sends the info to firebase for storage
	if (window.location.href.replace('.html', '').endsWith('contact')) {
		let contactForm = document.querySelector('form');
		let nameInput = document.getElementById('name');
		let emailInput = document.getElementById('email');
		let subjectInput = document.getElementById('subject');
		let messageTextArea = document.getElementById('message');
		let submitBtn = document.getElementById('submit');

		submitBtn.addEventListener('click', (e) => {
			e.preventDefault();
			if (contactForm.reportValidity()) {
				const dataPayload = {
					name: nameInput.value,
					email: emailInput.value,
					subject: subjectInput.value,
					message: messageTextArea.value
				};

				submitBtn.disabled = true;
				submitBtn.value = 'Loading...';

				fetch('https://europe-west1-grss-website.cloudfunctions.net/addContactFormSubmission', {
					method: 'POST',
					body: JSON.stringify(dataPayload),
					headers: {
						'Content-type': 'application/json'
					}
				})
					.then(_ => window.location.href = '/', err => window.location.href = '/');
			}
		})
	}

};
