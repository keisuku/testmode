// CoinBattleSaki Knowledge Base - Search & Navigation

(function () {
  "use strict";

  // --- Navigation ---
  function showPage(slug) {
    // Hide all pages
    document.querySelectorAll(".page-content").forEach(function (el) {
      el.style.display = "none";
    });
    document.getElementById("welcome").style.display = "none";

    // Show target page
    var target = document.getElementById("page-" + slug);
    if (target) {
      target.style.display = "block";
    }

    // Update active link
    document.querySelectorAll(".sidebar-link").forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("data-page") === slug) {
        link.classList.add("active");
      }
    });

    // Update URL hash
    window.location.hash = slug;
  }

  // Sidebar click handlers
  document.querySelectorAll(".sidebar-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showPage(this.getAttribute("data-page"));
    });
  });

  // --- Search ---
  var searchInput = document.getElementById("search-input");
  var sidebarList = document.getElementById("sidebar-list");
  var allItems = Array.from(sidebarList.querySelectorAll("li"));

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var query = this.value.toLowerCase().trim();

      if (!query) {
        allItems.forEach(function (li) {
          li.style.display = "";
        });
        return;
      }

      // Search through SEARCH_DATA
      var matchingSlugs = {};
      SEARCH_DATA.forEach(function (item) {
        var matchTitle = item.title.toLowerCase().indexOf(query) !== -1;
        var matchText = item.text.toLowerCase().indexOf(query) !== -1;
        var matchTags = false;
        if (Array.isArray(item.tags)) {
          matchTags = item.tags.some(function (tag) {
            return tag.toLowerCase().indexOf(query) !== -1;
          });
        }
        if (matchTitle || matchText || matchTags) {
          matchingSlugs[item.slug] = true;
        }
      });

      // Show/hide sidebar items
      allItems.forEach(function (li) {
        var link = li.querySelector(".sidebar-link");
        if (link) {
          var slug = link.getAttribute("data-page");
          li.style.display = matchingSlugs[slug] ? "" : "none";
        }
      });
    });
  }

  // --- Hash navigation on load ---
  if (window.location.hash) {
    var slug = window.location.hash.substring(1);
    showPage(slug);
  }
})();
