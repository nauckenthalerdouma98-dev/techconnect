// skillSelector.js – Reusable skill selector component
const SkillSelector = (function () {
  const predefinedSkills = [
    "Python", "JavaScript", "React", "Node.js", "UI/UX Design",
    "Logo Design", "Content Writing", "Video Editing", "Social Media",
    "Mobile Development", "Data Science", "Graphic Design"
  ];

  let selectedSkills = [];
  let container = null;
  let onSkillsChangeCallback = null;

  // --- Render the chips inside the container's .skills-display ---
  function renderSkills() {
    if (!container) return;
    const display = container.querySelector(".skills-display");
    if (!display) return;
    display.innerHTML = selectedSkills
      .map(
        (skill) =>
          `<span class="skill-chip">${skill} <button type="button" data-skill="${skill}">×</button></span>`
      )
      .join("");

    display.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const skill = e.target.getAttribute("data-skill");
        selectedSkills = selectedSkills.filter((s) => s !== skill);
        renderSkills();
        if (onSkillsChangeCallback) onSkillsChangeCallback(selectedSkills);
      });
    });
  }

  // --- Initialize the component ---
  function init(containerElement, onSkillsChange) {
    container = containerElement;
    onSkillsChangeCallback = onSkillsChange || null;

    const input = container.querySelector(".skill-input");
    const suggestions = container.querySelector(".skill-suggestions");
    if (!input || !suggestions) return;

    input.addEventListener("input", () => {
      const query = input.value.toLowerCase().trim();
      const filtered = predefinedSkills.filter(
        (s) =>
          s.toLowerCase().includes(query) && !selectedSkills.includes(s)
      );
      suggestions.innerHTML = filtered.map((s) => `<div>${s}</div>`).join("");
      suggestions.style.display = filtered.length ? "block" : "none";
    });

    suggestions.addEventListener("click", (e) => {
      if (e.target.tagName === "DIV") {
        const skill = e.target.textContent;
        if (!selectedSkills.includes(skill)) {
          selectedSkills.push(skill);
          renderSkills();
          input.value = "";
          suggestions.style.display = "none";
          if (onSkillsChangeCallback) onSkillsChangeCallback(selectedSkills);
        }
      }
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const customSkill = input.value.trim();
        if (customSkill && !selectedSkills.includes(customSkill)) {
          selectedSkills.push(customSkill);
          renderSkills();
          input.value = "";
          suggestions.style.display = "none";
          if (onSkillsChangeCallback) onSkillsChangeCallback(selectedSkills);
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) {
        suggestions.style.display = "none";
      }
    });

    renderSkills();
  }

  // --- Set skills from outside (e.g., after loading user data) ---
  function setSkills(skills) {
    selectedSkills = skills || [];
    renderSkills();
  }

  // --- Get current skills ---
  function getSkills() {
    return [...selectedSkills];
  }

  return { init, setSkills, getSkills };
})();