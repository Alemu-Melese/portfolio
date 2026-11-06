(() => {
  "use strict";

  const themeStorageKey = "amir-hamza-portfolio-theme";
  const themeRoot = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function readSavedTheme() {
    try {
      const savedTheme = window.localStorage.getItem(themeStorageKey);
      return savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : null;
    } catch {
      return null;
    }
  }

  let hasSavedTheme = readSavedTheme() !== null;

  function applyTheme(theme) {
    themeRoot.dataset.theme = theme;

    const toggle = document.querySelector("#theme-toggle");
    if (toggle) {
      const darkThemeIsActive = theme === "dark";
      toggle.setAttribute("aria-label", "Dark theme");
      toggle.setAttribute("aria-pressed", String(darkThemeIsActive));
      toggle.setAttribute(
        "title",
        darkThemeIsActive ? "Switch to light theme" : "Switch to dark theme",
      );
    }

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.content = theme === "dark" ? "#121b2b" : "#f5f4f9";
    }
  }

  const initialTheme = readSavedTheme() ?? (systemTheme.matches ? "dark" : "light");
  applyTheme(initialTheme);

  systemTheme.addEventListener("change", (event) => {
    if (!hasSavedTheme) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.querySelector("#theme-toggle");
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        themeRoot.dataset.theme === "dark" ? "light" : "dark";
      hasSavedTheme = true;
      applyTheme(nextTheme);

      try {
        window.localStorage.setItem(themeStorageKey, nextTheme);
      } catch {
        // Keep the selected theme for this page view when storage is unavailable.
      }
    });

    const menuButton = document.querySelector("#menu-toggle");
    const navigation = document.querySelector("#primary-navigation");
    const mobileQuery = window.matchMedia("(max-width: 640px)");

    function closeMenu(returnFocus = false) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      navigation.hidden = true;
      if (returnFocus) {
        menuButton.focus();
      }
    }

    navigation.hidden = mobileQuery.matches;

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu",
      );
      navigation.hidden = isOpen;
      if (!isOpen) {
        navigation.querySelector("a").focus();
      }
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a") && mobileQuery.matches) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        menuButton.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu(true);
      }
    });

    mobileQuery.addEventListener("change", (event) => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      navigation.hidden = event.matches;
    });

    const filterButtons = [...document.querySelectorAll(".filter-btn")];
    const projects = [...document.querySelectorAll(".project-card")];

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedCategory = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
          filterButton.setAttribute(
            "aria-pressed",
            String(filterButton === button),
          );
        });

        projects.forEach((project) => {
          project.hidden =
            selectedCategory !== "All" &&
            project.dataset.category !== selectedCategory;
        });
      });
    });

    const articles = {
      focus: {
        title: "Making room for focused work",
        paragraphs: [
          "This sample article is a starting point for a real note about your creative process. Replace the copy with an idea you have explored, a useful lesson, or a personal perspective.",
          "A thoughtful routine does not need to be complicated. It can begin with a clear priority, a quieter workspace, and permission to stay with one problem long enough to understand it.",
        ],
      },
      brand: {
        title: "What makes a brand feel whole?",
        paragraphs: [
          "This sample article invites you to explain how the parts of an identity work together: voice, type, color, imagery, and the experience people have at each touchpoint.",
          "Use a real example from your practice or a considered point of view. No project or client is claimed by this placeholder.",
        ],
      },
      digital: {
        title: "Designing for the in-between",
        paragraphs: [
          "This sample article is a place for your perspective on digital experiences and the small transitions that help a product feel understandable.",
          "Replace this text with a complete article that reflects your own thinking. There are no claimed publication dates or authors beyond this site owner.",
        ],
      },
    };

    const dialog = document.querySelector("#article-dialog");
    const dialogTitle = document.querySelector("#dialog-title");
    const dialogCopy = document.querySelector("#dialog-copy");
    let lastArticleTrigger = null;

    document.querySelectorAll("[data-article]").forEach((button) => {
      button.addEventListener("click", () => {
        const article = articles[button.dataset.article];
        if (!article) {
          return;
        }

        lastArticleTrigger = button;
        dialogTitle.textContent = article.title;
        dialogCopy.replaceChildren(
          ...article.paragraphs.map((text) => {
            const paragraph = document.createElement("p");
            paragraph.textContent = text;
            return paragraph;
          }),
        );
        dialog.showModal();
        dialog.querySelector(".dialog-close").focus();
      });
    });

    function closeDialog() {
      if (dialog.open) {
        dialog.close();
      }
    }

    dialog
      .querySelectorAll(".dialog-close, .dialog-close-bottom")
      .forEach((button) => button.addEventListener("click", closeDialog));

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        closeDialog();
      }
    });

    dialog.addEventListener("close", () => {
      if (lastArticleTrigger) {
        lastArticleTrigger.focus();
      }
    });

    const form = document.querySelector("#contact-form");
    const formStatus = document.querySelector("#form-status");

    form.addEventListener("input", () => {
      formStatus.textContent = "";
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.textContent = "";

      if (!form.reportValidity()) {
        formStatus.textContent =
          "Please complete each required field with a valid email address.";
        return;
      }

      formStatus.textContent =
        "No message was sent: a backend or form service is not configured.";
    });

    document.querySelector("#current-year").textContent =
      new Date().getFullYear();
  });
})();
