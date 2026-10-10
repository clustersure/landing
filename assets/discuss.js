/* Turns any element with data-topic into a mailto link with a prefilled subject and body. */
(function () {
  var TO = "ade@clustersure.com";

  var EXTRA = {
    "Remediation sprint": "Where the findings came from (our review, a pentest, an auditor, other):\nApproximate number of open findings:",
    "Audit-ready landing zone build": "New AWS environment or restructuring an existing one:\nNumber of AWS accounts today:",
    "Ongoing assurance retainer": "In-house security or platform engineers today:\nWhat support you need each month:"
  };

  function body(topic) {
    var lines = [
      "Hi Ade,",
      "",
      "I'd like to talk about: " + topic,
      "",
      "Company:",
      "My role:",
      "Number of EKS clusters / AWS accounts:",
      "Frameworks or audits we're working towards (e.g. DSPT, ISO 27001, SOC 2):",
      "Deadline, if any:",
      "What prompted this now:"
    ];
    if (EXTRA[topic]) lines.push(EXTRA[topic]);
    lines.push("", "A few times that suit me for a 30-minute call:", "", "", "Thanks,", "");
    return lines.join("\n");
  }

  function href(topic) {
    var subject = "ClusterSure: " + topic;
    return "mailto:" + TO +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body(topic));
  }

  var links = document.querySelectorAll("[data-topic]");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("href", href(links[i].getAttribute("data-topic")));
  }
})();
