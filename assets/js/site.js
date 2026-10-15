// gttn.global: the mobile menu and the contact form. No cookies, no tracking, no third-party requests.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Contact form: until a form service is connected (data-endpoint on the form), the message opens in the
  // visitor's own e-mail program, addressed to the right GTTN mailbox. Nothing is stored by the website.
  var form = document.querySelector('form.contact');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var params = new URLSearchParams(location.search);
  var topic = params.get('topic');
  if (topic && form.topic) form.topic.value = topic;
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.reportValidity()) return;
    var v = function (n) {
      return (form[n] && form[n].value ? form[n].value : '').trim();
    };
    var to = form.topic.selectedOptions[0].getAttribute('data-to') || form.getAttribute('data-to');
    var subject = 'GTTN: ' + form.topic.selectedOptions[0].textContent + ' (' + v('organisation') + ')';
    var body =
      'Name: ' +
      v('name') +
      '\n' +
      'Organisation: ' +
      v('organisation') +
      '\n' +
      'Role: ' +
      v('role') +
      '\n' +
      'Country: ' +
      v('country') +
      '\n' +
      'E-mail: ' +
      v('email') +
      '\n\n' +
      v('message');
    var endpoint = form.getAttribute('data-endpoint');
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ to: to, subject: subject, body: body, email: v('email') }),
      })
        .then(function (r) {
          status.textContent = r.ok
            ? 'Thank you. Your message has been sent; we reply within two working days.'
            : 'The message could not be sent. Please e-mail ' + to + ' directly.';
        })
        .catch(function () {
          status.textContent = 'The message could not be sent. Please e-mail ' + to + ' directly.';
        });
      return;
    }
    location.href =
      'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Your e-mail program should open with the message ready to send to ' + to + '.';
  });
})();
