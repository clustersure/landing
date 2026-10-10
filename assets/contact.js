/* Contact dialogs: "Discuss this" opens a short form that builds a prefilled email (or copies it),
   "Book a scoping call" opens booking options. Without JS, the links fall back to #contact. */
(function () {
  var TO = "ade@clustersure.com";

  // Button topics that don't match a service option exactly
  var ALIAS = {
    "Posture review": "EKS security posture review",
    "Audit-ready landing zone build": "Audit-ready landing zone"
  };

  var discuss = document.getElementById("discuss-dialog");
  var book = document.getElementById("book-dialog");
  var form = document.getElementById("discuss-form");
  if (!discuss || !book || !form || typeof discuss.showModal !== "function") return;

  function status(dialog, text) {
    var el = dialog.querySelector(".modal-status");
    if (el) el.textContent = text;
  }

  function open(dialog) {
    status(dialog, "");
    if (!dialog.open) dialog.showModal();
    var first = dialog.querySelector("input, select, textarea, a.btn");
    if (first) first.focus();
  }

  function value(name) {
    return (form.elements[name].value || "").trim();
  }

  function subject() {
    var company = value("company");
    return "ClusterSure: " + value("service") + (company ? " for " + company : "");
  }

  function body() {
    var lines = [
      "Hi Ade,",
      "",
      "I'd like to talk about: " + value("service"),
      "",
      "Name: " + value("name"),
      "Email: " + value("email"),
      "Company: " + value("company")
    ];
    if (value("role")) lines.push("Role: " + value("role"));
    if (value("scale")) lines.push("EKS clusters / AWS accounts: " + value("scale"));
    if (value("frameworks")) lines.push("Frameworks or audits: " + value("frameworks"));
    lines.push("Timing: " + value("timing"), "", "What prompted this now:", value("message"), "", "Thanks,", value("name"));
    return lines.join("\n");
  }

  function copy(text, onDone, onFail) {
    try {
      navigator.clipboard.writeText(text).then(onDone, onFail);
    } catch (e) {
      onFail();
    }
  }

  // Close on the X button or a click on the backdrop (the dialog element itself, outside .modal-body)
  [discuss, book].forEach(function (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
    });
  });

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-topic], [data-book]");
    if (!trigger || trigger.closest("dialog")) return;
    e.preventDefault();
    if (trigger.hasAttribute("data-book")) return open(book);
    var topic = trigger.getAttribute("data-topic");
    form.elements.service.value = ALIAS[topic] || topic;
    if (form.elements.service.selectedIndex < 0) form.elements.service.selectedIndex = 0;
    open(discuss);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    window.location.href = "mailto:" + TO +
      "?subject=" + encodeURIComponent(subject()) +
      "&body=" + encodeURIComponent(body());
    status(discuss, "Opening your email app. If nothing happens, use Copy message.");
  });

  form.querySelector("[data-copy-message]").addEventListener("click", function () {
    if (!form.reportValidity()) return;
    var text = "To: " + TO + "\nSubject: " + subject() + "\n\n" + body();
    copy(text,
      function () { status(discuss, "Copied. Paste it into a new email to " + TO + "."); },
      function () { status(discuss, "Copy is blocked in this browser. Please email " + TO + " directly."); });
  });

  book.querySelector("[data-copy-address]").addEventListener("click", function (e) {
    var btn = e.currentTarget;
    copy(TO,
      function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1800); },
      function () { btn.textContent = "Select and copy"; });
  });

  book.querySelector("[data-switch-form]").addEventListener("click", function () {
    book.close();
    form.elements.service.selectedIndex = 0;
    open(discuss);
  });

  // Prefill the booking email body with the same prompts the contact section asks for
  document.getElementById("book-mailto").setAttribute("href", "mailto:" + TO +
    "?subject=" + encodeURIComponent("ClusterSure: scoping call") +
    "&body=" + encodeURIComponent("Hi Ade,\n\nI'd like to book a scoping call.\n\nTimes that suit me (with time zone):\n\nCompany:\nNumber of EKS clusters / AWS accounts:\nAudit or customer deadline, if any:\n\nThanks,\n"));
})();
